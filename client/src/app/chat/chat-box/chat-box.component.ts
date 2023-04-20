import { Component, Input, SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core';
import { IMessage } from 'src/app/shared/interfaces/message-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnChanges{
  @Input() threadId: number | undefined;
  messages: IMessage[] = [];

  constructor(private chatService: ChatService){}

  ngOnChanges(changes: SimpleChanges): void {
    this.chatService.getMessages(changes['threadId'].currentValue).subscribe((response: IResponse<IMessage[]>) => {
      if(response.content)
        this.messages = response.content;
    });
  }
}
