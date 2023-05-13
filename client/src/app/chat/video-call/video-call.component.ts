import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IServer } from 'src/app/shared/interfaces/server-interface';
import AgoraRTM, { RtmChannel, RtmClient, RtmMessage } from 'agora-rtm-sdk';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  remoteUserConnected: boolean = false; 
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  peerConnection?: RTCPeerConnection;
  servers: IServer = {
    iceServers: [{
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }]
  }
  
  APP_ID:string = "ec69b3fef3b844b4934a58d593aebc87";
  token?: string;
  uid: string;
  roomId?: string;
  client?: RtmClient;
  channel?: RtmChannel;

  constructor (
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private chatService: ChatService
    ) {
      this.uid = this.authenticationService.sessionUser!.username; 
    }

  async ngOnInit(): Promise<void> {

    this.client = AgoraRTM.createInstance(this.APP_ID);
    await this.client.login({uid: this.uid, token: this.token});

    this.roomId = this.activatedRoute.snapshot.queryParams['roomId'];
    this.channel = this.client.createChannel(this.roomId!);
    await this.channel.join();

    this.channel.on('MemberJoined', this.handleUserJoined.bind(this));
    this.channel.on('MemberLeft', this.handleUserLeft.bind(this));

    this.client.on("MessageFromPeer", this.handleMessageFromPeer.bind(this));

    let constraints = {
      video: {
        width: {min: 640, ideal: 1920, max: 1920},
        height: {min: 480, ideal: 1080, max: 1080}
      },
      audio: true
    }
    this.localStream = await navigator.mediaDevices.getUserMedia(constraints);

    this.chatService.joinCall(this.authenticationService.sessionUser!.username, this.roomId!);

  }

  async handleUserLeft(memberId: string): Promise<void> {
    this.remoteUserConnected = false;
  }

  async handleMessageFromPeer(message: RtmMessage, memberId: string): Promise<void> {
    let msg = JSON.parse(message.text!);
    if(msg.type === 'offer'){
      this.createAnswer(memberId, msg.offer);
    } else if(msg.type === 'answer'){
      this.addAnswer(msg.answer);
    } else if(msg.type === 'candidate'){
      if(this.peerConnection){
        this.peerConnection.addIceCandidate(msg.candidate);
      }
    }
  }

  async handleUserJoined(memberId:string): Promise<void>{
    await this.createOffer(memberId);
  } 

  async createPeerConnection(memberId: string): Promise <void> {
    this.peerConnection = new RTCPeerConnection(this.servers);
    this.remoteStream = new MediaStream();
    this.remoteUserConnected = true;

    this.localStream?.getTracks().forEach((track) => {
      this.peerConnection?.addTrack(track, this.localStream!);
    });

    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream?.addTrack(track);
      })
    }

    this.peerConnection.onicecandidate = async (event) => {
      if(event.candidate){
        this.client?.sendMessageToPeer({text: JSON.stringify({'type': 'candidate', 'candidate': event.candidate})}, memberId);
      }
    }
  }

  async createOffer(memberId: string): Promise<void> {
    await this.createPeerConnection(memberId);

    let offer: RTCSessionDescriptionInit = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(offer);

    this.client?.sendMessageToPeer({text: JSON.stringify({'type': 'offer', 'offer': offer})}, memberId);
  }

  async createAnswer(memberId: string, offer: RTCSessionDescriptionInit): Promise<void>{
    await this.createPeerConnection(memberId);

    await this.peerConnection?.setRemoteDescription(offer);

    let answer = await this.peerConnection?.createAnswer();
    await this.peerConnection?.setLocalDescription(answer);

    this.client?.sendMessageToPeer({text: JSON.stringify({'type': 'answer', 'answer': answer})}, memberId);
  }

  async addAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if(!this.peerConnection?.currentRemoteDescription){
      this.peerConnection?.setRemoteDescription(answer);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  async leaveChannel(): Promise<void>{
    await this.channel?.leave();
    await this.client?.logout();
  }

  async leaveCall(): Promise<void>{
    this.leaveChannel();
    let videoTrack = this.localStream?.getTracks().find(track => track.kind === 'video');
    if(videoTrack?.enabled){
      videoTrack.stop();
    }
    this.chatService.leaveCall(this.authenticationService.sessionUser!.username);
    this.router.navigateByUrl('/home');
  }

  async toggleCamera(): Promise<void> {
    let videoTrack = this.localStream?.getTracks().find(track => track.kind === 'video');
    if(videoTrack?.enabled){
      videoTrack.enabled = false;
    } else {
      videoTrack!.enabled = true;
    }
  }

  async toggleMic(): Promise<void> {
    let audioTrack = this.localStream?.getTracks().find(track => track.kind === 'audio');
    if(audioTrack?.enabled){
      audioTrack.enabled = false;
    } else {
      audioTrack!.enabled = true;
    }
  }

  /******************************************************** Call Chat ******************************************************/

  async closeSidenav(): Promise<void>{
    if(this.sidenav.opened){
      await this.sidenav.close();
    }
  }

  async toggleSidenav(): Promise<void>{
    await this.sidenav.toggle();
  }
}
