import { Component, EventEmitter, Output } from '@angular/core';
import { OnInit } from '@angular/core';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { SearchService } from 'src/app/shared/services/search.service';
import { IGroup } from 'src/app/shared/interfaces/group-interface';
import { IShortThreadInfo } from 'src/app/shared/interfaces/short-thread-info-interface';
import { IShortGroupInfo } from 'src/app/shared/interfaces/short-group-info-interface';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit{
  @Output() selectedThread = new EventEmitter<IShortThreadInfo>();
  @Output() selectedGroup = new EventEmitter<IShortGroupInfo>();
  lastGroupId?: number; 
  contacts: IGroup[] = [];  

  constructor(private searchService: SearchService){}

  ngOnInit(): void {
    this.searchService.getContacts().subscribe((response: IResponse<IGroup[]>) => {
      if(response.content){
        this.contacts = response.content;
        console.log(this.contacts);
      }
    });
  }

  selectThread(threadId: number, threadName: string, groupId: number, groupName: string){
    this.selectedThread.emit({threadId, threadName});
    if(groupId != this.lastGroupId){
      this.lastGroupId = groupId;
      this.selectedGroup.emit({groupId, groupName});
    }
  }

}
