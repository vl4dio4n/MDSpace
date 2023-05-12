import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { OnInit } from '@angular/core';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { SearchService } from 'src/app/shared/services/search.service';
import { IGroup } from 'src/app/shared/interfaces/group-interface';
import { IShortThreadInfo } from 'src/app/shared/interfaces/short-thread-info-interface';
import { IShortGroupInfo } from 'src/app/shared/interfaces/short-group-info-interface';
import { HomeComponent } from '../home/home.component';
import { Subscription } from 'rxjs';
import { IMessage } from 'src/app/shared/interfaces/message-interface';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { IStartChat } from 'src/app/shared/interfaces/start-chat-interface';
import { IThread } from 'src/app/shared/interfaces/thread-interface';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit, OnChanges, OnDestroy {
  @Output() selectedThread = new EventEmitter<IShortThreadInfo>();
  @Output() selectedGroup = new EventEmitter<IShortGroupInfo>();
  @Input() updated = false;
  @Input() startChat?: IStartChat;
  lastGroupId?: number;
  contacts: IGroup[] = [];
  threadId: number | undefined;

  private messageSubscription?: Subscription;
  private groupSubscription?: Subscription;
  private threadSubscription?: Subscription;
  private leaveGroupSubscription?: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private searchService: SearchService,
    private homeComponent: HomeComponent,
    private chatService: ChatService
  ) { }

  getContacts() {
    this.searchService.getContacts().subscribe((response: IResponse<IGroup[]>) => {
      if (response.content) {
        this.contacts = response.content;
      }
    });
  }

  ngOnInit(): void {
    this.getContacts();

    this.messageSubscription = this.homeComponent.messageSubject.subscribe((newMessage: IMessage) => {
      if (this.authenticationService.sessionUser?.username != newMessage.senderUsername && this.threadId != newMessage.threadId) {
        const contact = this.contacts.find(group => group.groupId == newMessage.groupId);
        contact!.unseenMessages += 1;

        const thread = contact!.threads.find(thread => thread.threadId == newMessage.threadId);
        thread!.unseenMessages += 1;
        thread!.lastMessage = newMessage;
      } else {
        const contact = this.contacts.find(group => group.groupId == newMessage.groupId);
        const thread = contact!.threads.find(thread => thread.threadId == newMessage.threadId);
        thread!.lastMessage = newMessage;
      }
    });

    this.groupSubscription = this.chatService.userAddedToGroupListener().subscribe(() => this.getContacts());
    this.threadSubscription = this.chatService.threadCreatedListener().subscribe(() => this.getContacts());
    this.leaveGroupSubscription = this.chatService.leaveGroupListener().subscribe(() => this.getContacts());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.searchService.getContacts().subscribe((response: IResponse<IGroup[]>) => {
      if (response.content) {
        this.contacts = response.content;
        if (changes['startChat']?.previousValue != changes['startChat']?.currentValue && this.startChat) {
          const group: IGroup = this.contacts.find((contact: IGroup) => contact.groupId == this.startChat!.groupId)!;
          const thread: IThread = group.threads.find((thread: IThread) => thread.threadId == this.startChat!.threadId)!;
          this.selectThread(thread.threadId, thread.threadName, thread.unseenMessages, group.groupId, group.groupName);
        }
      }
    });

  }

  selectThread(threadId: number, threadName: string, unseenMessages: number, groupId: number, groupName: string) {
    this.selectedThread.emit({ threadId, threadName, unseenMessages });
    this.threadId = threadId;
    if (groupId != this.lastGroupId) {
      this.lastGroupId = groupId;
      this.selectedGroup.emit({ groupId, groupName });
    }

    const contact = this.contacts.find(group => group.groupId == groupId);
    const thread = contact!.threads.find(thread => thread.threadId == threadId);
    contact!.unseenMessages -= thread!.unseenMessages;
    thread!.unseenMessages = 0;
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    this.groupSubscription?.unsubscribe();
    this.threadSubscription?.unsubscribe();
    this.leaveGroupSubscription?.unsubscribe();
  }

}
