import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGroupInfo } from 'src/app/shared/interfaces/group-info-interface';
import { IGroupMember } from 'src/app/shared/interfaces/group-member-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  @Input() groupId!: number;
  members: string[] = [];
  newMembers: string[] = [];

  @Output() usersAdded = new EventEmitter<boolean>();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getGroupInfo(this.groupId).subscribe((response: IResponse<IGroupInfo>) => {
      if(response.content) {
        this.members = response.content.members.map((memeber: IGroupMember) => memeber.username);
      } 
    })
  }

  getMembers(newMembers: string[]){
    this.newMembers = newMembers;
  }

  onAdd() {
    this.chatService.addUsers([this.groupId.toString(), ...this.newMembers]).subscribe((response: IResponse<boolean>) => {
      if(response.content){
        this.usersAdded.emit(true);
        this.chatService.addGroupMembers(this.groupId, this.newMembers);
      }
    });

  }
}
