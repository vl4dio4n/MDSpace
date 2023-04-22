import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core';
import { IMessage } from 'src/app/shared/interfaces/message-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnChanges{
  @Input() threadId: number | undefined;
  @Output() selectedUsername = new EventEmitter<string>();   
  messages: IMessage[] = [];
  sessionUser: IUser;

  constructor(
    private authenticationService: AuthenticationService,
    private chatService: ChatService){
      this.sessionUser = authenticationService.sessionUser!;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chatService.getMessages(changes['threadId'].currentValue).subscribe((response: IResponse<IMessage[]>) => {
      if(response.content)
        this.messages = response.content;
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
}
