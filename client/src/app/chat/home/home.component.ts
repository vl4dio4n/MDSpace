import { AfterViewInit, Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  sessionUser: IUser;
  searchBarHasInput = false;
  selectedThread: IShortThreadInfo | undefined;
  selectedGroup: IShortGroupInfo | undefined;
  groupInfo?: IGroupInfo;

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  sidenavType: SidenavEnum | undefined;
  data: string | undefined;
  
  contactsListSpan = 2;
  chatBoxSpan = 5;
  totalCols = 7;

  sidenavEnum = SidenavEnum;
  groupTypeEnum = GroupTypeEnum;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private chatService: ChatService){
    this.sessionUser = this.authenticationService.sessionUser!;
    this.chatService.getMessage();
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

  selectGroup(selectedGroup: IShortGroupInfo){
    this.selectedGroup = selectedGroup;
    this.chatService.getGroupInfo(selectedGroup.groupId).subscribe((response: IResponse<IGroupInfo>) => {
      if(response.content){
        this.groupInfo = response.content;
      }
    });
  }

  async closeSidenav(): Promise<void>{
    await this.sidenav.close();
    this.contactsListSpan = 2;
    this.totalCols = 7;
  }

  async toggleSidenav(sidenavType: SidenavEnum, data?: number | string): Promise<void>{
    this.sidenavType = sidenavType;   
    this.data = data?.toString();
    await this.sidenav.toggle();
    this.contactsListSpan = this.sidenav.opened ? 3 : 2;
    this.totalCols = this.sidenav.opened ? 8 : 7;
  }

  edit(): void{
    if(this.sidenavType == SidenavEnum.UserProfile)
      this.sidenavType = SidenavEnum.EditUserProfile;
  }

  back(): void{
    if(this.sidenavType == SidenavEnum.EditUserProfile)
      this.sidenavType = SidenavEnum.UserProfile;
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

  onGroupInfoRequested(): void {
    if(this.groupInfo!.type == GroupTypeEnum.User)
      this.showUserProfile(this.selectedGroup!.groupName);
    else
      this.showGroupProfile(this.selectedGroup!.groupId);
  }
  
}
