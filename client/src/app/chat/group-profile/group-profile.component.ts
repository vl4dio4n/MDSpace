import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupRolesEnum } from 'src/app/shared/enums/group-roles-enum';
import { SidenavEnum } from 'src/app/shared/enums/sidenav-enum';
import { IEditGroupProfile } from 'src/app/shared/interfaces/edit-group-profile-interface';
import { IError } from 'src/app/shared/interfaces/error-interface';
import { IGroupInfo } from 'src/app/shared/interfaces/group-info-interface';
import { IGroupMember } from 'src/app/shared/interfaces/group-member-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { IUserGroup } from 'src/app/shared/interfaces/user-group-interface';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-group-profile',
  templateUrl: './group-profile.component.html',
  styleUrls: ['./group-profile.component.scss']
})
export class GroupProfileComponent implements OnChanges{
  @Input() groupId!: number;
  @Input() sidenavType!: SidenavEnum;
  @Output() profileUpdated = new EventEmitter<boolean>();
  @Output() selectedUsername = new EventEmitter<string>();   

  sessionUser: IUser;
  sessionUserRole?: GroupRolesEnum;
  groupInfo?: IGroupInfo;
  error: IError | undefined;
  editGroupProfileForm?: FormGroup;

  sidenavEnum = SidenavEnum;
  groupRolesEnum = GroupRolesEnum

  constructor(
    private chatService: ChatService,
    private authenticationService: AuthenticationService){
      this.sessionUser = this.authenticationService.sessionUser!;
  }
  
  ngOnChanges(): void {
    this.chatService.getGroupInfo(this.groupId).subscribe((response: IResponse<IGroupInfo>) => {
      if(response.content){
        this.groupInfo = response.content;
        this.groupInfo.members.forEach((member: IGroupMember) => {
          if(member.username == this.sessionUser.username)
            this.sessionUserRole = member.role;
        });
        this.editGroupProfileForm = new FormGroup({
          groupId: new FormControl(this.groupInfo!.groupId),
          groupName: new FormControl(this.groupInfo!.groupName, [Validators.required]),
          description: new FormControl(this.groupInfo!.description)
        });
      }
    });
  }

  onSubmit(): void {
    const data = this.editGroupProfileForm!.value as IEditGroupProfile;
    this.chatService.editGroupProfile(data).subscribe((response: IResponse<IGroupInfo>) => {
      if(response.content){
        this.groupInfo = response.content;
        this.sidenavType = SidenavEnum.GroupProfile;
        this.profileUpdated.emit(true);
      }
      this.error = response.error;
    })
  }

  onUsernameClicked(username: string){
    this.selectedUsername.emit(username);
  }

  kickMember(username: string){
    const data: IUserGroup = {
      username: username,
      groupId: this.groupInfo!.groupId
    }
    this.chatService.kickGroupMember(data).subscribe((response: IResponse<boolean>) => {
      if(response.content){
        this.ngOnChanges();
      }
    });
  }

  promoteMember(username: string){
    const data: IUserGroup = {
      username: username,
      groupId: this.groupInfo!.groupId
    }
    this.chatService.promoteGroupMember(data).subscribe((response: IResponse<boolean>) => {
      if(response.content){
        this.ngOnChanges();
      }
    });
  }

  demoteMember(username: string){
    const data: IUserGroup = {
      username: username,
      groupId: this.groupInfo!.groupId
    }
    this.chatService.demoteGroupMember(data).subscribe((response: IResponse<boolean>) => {
      if(response.content){
        this.ngOnChanges();
      }
    });
  }
}
