import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageTypeEnum } from 'src/app/shared/enums/message-type-enum';
import { ICallMessage } from 'src/app/shared/interfaces/call-message-interface';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-call-chat-box',
  templateUrl: './call-chat-box.component.html',
  styleUrls: ['./call-chat-box.component.scss']
})
export class CallChatBoxComponent implements OnInit, OnDestroy {
  @Input() roomId?: string;

  startTime = new Date();
  messages: ICallMessage[] = [];
  sessionUser: IUser;
  messageTypeEnum = MessageTypeEnum;
  messageControl = new FormControl('');

  @ViewChild('messagesContainer') messagesContainerRef?: ElementRef;

  private messageSubscription?: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private chatService: ChatService
    ){
      this.sessionUser = this.authenticationService.sessionUser!;
    }  

  scrollToBottom(){
    if(this.messagesContainerRef){
      const element = this.messagesContainerRef.nativeElement;
      element.scrollTop = element.scrollHeight; 
    }
  }

  ngOnInit(): void {
    this.messageSubscription = this.chatService.callMessageListener().subscribe((callMessage: ICallMessage) => {
      console.log(callMessage);
      if(callMessage.roomId == this.roomId){
        this.messages.push(callMessage);
        if(callMessage.senderUsername == this.authenticationService.sessionUser?.username){
          setTimeout(this.scrollToBottom.bind(this), 100);
        }
      }
    })
  }

  onSend(): void {
    if(this.messageControl.value?.length){
      console.log("--> Sent:", this.messageControl.value);
      const newMessage: ICallMessage = {
        roomId: this.roomId!,
        senderUsername: this.sessionUser.username,
        content: this.messageControl.value,
        timestamp: new Date(),
        type: MessageTypeEnum.Text
      }
      this.chatService.sendCallMessage(newMessage);
      this.messageControl.reset();
    }
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }
}
