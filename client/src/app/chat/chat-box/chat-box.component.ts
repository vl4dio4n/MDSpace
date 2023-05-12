import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IMessage } from 'src/app/shared/interfaces/message-interface';
import { INewMessage } from 'src/app/shared/interfaces/new-message-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { HomeComponent } from '../home/home.component';
import { Subscription, debounceTime } from 'rxjs';
import { IUserTyping } from 'src/app/shared/interfaces/user-typing-interface';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnChanges, OnInit, OnDestroy{
  @Input() threadId: number | undefined;
  @Input() groupId: number | undefined;
  @Input() unseenMessages: number | undefined;
  @Output() selectedUsername = new EventEmitter<string>();   
  messages: IMessage[] = [];
  sessionUser: IUser;
  messageControl = new FormControl('');

  @ViewChild('messagesContainer') messagesContainerRef?: ElementRef;
  @ViewChild('bookmark') bookmarkRef?: ElementRef;

  private messageSubscription?: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private chatService: ChatService,
    private homeComponent: HomeComponent){
      this.sessionUser = authenticationService.sessionUser!;
      
      this.messageControl.valueChanges.pipe(debounceTime(20)).subscribe(value => {
        const userTyping: IUserTyping = {
          username: this.sessionUser.username,
          threadId: this.threadId!,
          isTyping: false
        };
        if(value != null && value != ""){
          userTyping.isTyping = true;
        } else {
          userTyping.isTyping = false;
        }
        this.chatService.userTyping(userTyping);
      })
  }

  scrollToBottom(){
    if(this.messagesContainerRef){
      const element = this.messagesContainerRef.nativeElement;
      element.scrollTop = element.scrollHeight; 
    }
  }

  ngOnInit(): void {
    this.messageSubscription = this.homeComponent.messageSubject.subscribe((newMessage: IMessage) => {
      if(newMessage.threadId == this.threadId){
        this.messages.push(newMessage);
        if(newMessage.senderUsername == this.authenticationService.sessionUser?.username){
          setTimeout(this.scrollToBottom.bind(this), 100);
        }
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chatService.getMessages(changes['threadId'].currentValue).subscribe((response: IResponse<IMessage[]>) => {
      if(response.content){
        this.messages = response.content;
      }
      
      if(changes['threadId'].previousValue){
        const userTyping: IUserTyping = {
          username: this.sessionUser.username,
          threadId: changes['threadId'].previousValue,
          isTyping: false
        };
        this.chatService.userTyping(userTyping);
      }

      setTimeout(this.scrollToBottom.bind(this), 100);      
    });
  }

  dateChanged(i: number): boolean{
    let timestamp1: Date = new Date(this.messages[i - 1].timestamp);
    let timestamp2: Date = new Date(this.messages[i].timestamp);
    return timestamp1.getFullYear() != timestamp2.getFullYear() ||
      timestamp1.getMonth() != timestamp2.getMonth() ||
      timestamp1.getDate() != timestamp2.getDate();
  }

  onUsernameClicked(username: string){
    this.selectedUsername.emit(username);
  }

  onSend(){
    if(this.messageControl.value?.length){
      const newMessage: INewMessage = {
        threadId: this.threadId!,
        groupId: this.groupId!,
        content: this.messageControl.value!,
        timestamp: new Date(),
        type: 'text'
      } 
      this.chatService.sendMessage(newMessage);
      this.messageControl.reset('');
      this.unseenMessages = 0; 
    }
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }
}
