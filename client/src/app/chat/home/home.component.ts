import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/shared/services/chat.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavEnum } from 'src/app/shared/enums/sidenav-enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  sessionUser: IUser;
  searchBarHasInput = false;
  selectedThread: number | undefined;

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  sidenavType: SidenavEnum | undefined;
  data: string | undefined;
  sidenavEnum = SidenavEnum;

  contactsListSpan = 2;
  chatBoxSpan = 5;
  totalCols = 7;

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

  selectThread(selectedThread: number){
    this.selectedThread = selectedThread;
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
    this.totalCols = this.sidenav.opened ? 8 : 7
  }
}
