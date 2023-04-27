import { AfterViewInit, Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/shared/services/chat.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavEnum } from 'src/app/shared/enums/sidenav-enum';
import { IGroupInfo } from 'src/app/shared/interfaces/group-info-interface';
import { IShortGroupInfo } from 'src/app/shared/interfaces/short-group-info-interface';
import { IShortThreadInfo } from 'src/app/shared/interfaces/short-thread-info-interface';
import { GroupTypeEnum } from 'src/app/shared/enums/group-type-enum';
import { GroupRolesEnum } from 'src/app/shared/enums/group-roles-enum';
import { IGroupMember } from 'src/app/shared/interfaces/group-member-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnChanges {
  sessionUser: IUser;
  sessionUserRole?: GroupRolesEnum;
  searchBarHasInput = false;
  selectedThread: IShortThreadInfo | undefined;
  selectedGroup: IShortGroupInfo | undefined;
  groupInfo?: IGroupInfo;

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  sidenavType: SidenavEnum | undefined;
  data: string | undefined;
  
  sidenavEnum = SidenavEnum;
  groupTypeEnum = GroupTypeEnum;
  groupRolesEnum = GroupRolesEnum;

  contactsUpdated = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private chatService: ChatService){
    this.sessionUser = this.authenticationService.sessionUser!;
    this.chatService.getMessage();
  }

  ngOnChanges(): void {
    this.chatService.getGroupInfo(this.selectedGroup!.groupId).subscribe((response: IResponse<IGroupInfo>) => {
      if(response.content){
        this.groupInfo = response.content;
        this.selectedGroup = {
          groupName: this.groupInfo.groupName,
          groupId: this.groupInfo.groupId
        }
      }
    });
  }

  signout(): void{
    this.authenticationService.signout().subscribe((response: IResponse<void>) => {
      this.authenticationService.sessionUser = undefined;  
      this.router.navigate(['/signin']);
    });
  }

  hasInput(data: boolean): void{
    this.searchBarHasInput = data;
  }

  selectThread(selectedThread: IShortThreadInfo){
    this.selectedThread = selectedThread;
  }

  async selectGroup(selectedGroup: IShortGroupInfo): Promise<void>{
    await this.closeSidenav();
    this.selectedGroup = selectedGroup;
    this.chatService.getGroupInfo(selectedGroup.groupId).subscribe((response: IResponse<IGroupInfo>) => {
      if(response.content){
        this.groupInfo = response.content;
        this.groupInfo.members.forEach((member: IGroupMember) => {
          if(member.username == this.sessionUser.username)
            this.sessionUserRole = member.role;
        });
      }
    });
  }

  async closeSidenav(): Promise<void>{
    if(this.sidenav.opened){
      await this.sidenav.close();
      this.sidenavType = SidenavEnum.Empty;
    }
  }

  async toggleSidenav(sidenavType: SidenavEnum, data?: number | string): Promise<void>{
    this.sidenavType = sidenavType;   
    this.data = data?.toString();
    await this.sidenav.toggle();
  }

  edit(): void{
    if(this.sidenavType == SidenavEnum.UserProfile)
      this.sidenavType = SidenavEnum.EditUserProfile;
    else if(this.sidenavType == SidenavEnum.GroupProfile)
      this.sidenavType = SidenavEnum.EditGroupProfile;
  }

  back(): void{
    if(this.sidenavType == SidenavEnum.EditUserProfile)
      this.sidenavType = SidenavEnum.UserProfile;
    else if(this.sidenavType == SidenavEnum.EditGroupProfile)
      this.sidenavType = SidenavEnum.GroupProfile;
  }

  async showUserProfile(username: string): Promise<void> {
    if(this.sidenav.opened)
      await this.closeSidenav();
    this.toggleSidenav(SidenavEnum.UserProfile, username); 
  }

  async showGroupProfile(groupId: number): Promise<void> {
    if(this.sidenav.opened)
      await this.closeSidenav();
    this.toggleSidenav(SidenavEnum.GroupProfile, groupId); 
  }

  async createGroup(): Promise<void>{
    if(this.sidenav.opened)
      await this.closeSidenav();
    this.toggleSidenav(SidenavEnum.CreateGroup);
  }

  onGroupInfoRequested(): void {
    if(this.groupInfo!.type == GroupTypeEnum.User)
      this.showUserProfile(this.selectedGroup!.groupName);
    else
      this.showGroupProfile(this.selectedGroup!.groupId);
  }

  async onAddUserRequested(): Promise<void> {
    if(this.sidenav.opened)
      await this.sidenav.close();
    this.toggleSidenav(SidenavEnum.AddUser);
  }
  
  async onGroupUpdated(): Promise<void> {
    this.sidenavType = SidenavEnum.GroupProfile;
    this.contactsUpdated = !this.contactsUpdated;
    this.ngOnChanges();
  }

  async onGroupCreated(): Promise<void> {
    await this.closeSidenav();
    this.contactsUpdated = !this.contactsUpdated;
  }

  async onUsersAdded(): Promise<void>{
    await this.closeSidenav();
  }
}
