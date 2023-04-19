import { Component } from '@angular/core';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  sessionUser: IUser;

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
}
