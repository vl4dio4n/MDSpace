import { Component } from '@angular/core';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  sessionUser: IUser;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService){
    this.sessionUser = this.authenticationService.sessionUser!;
  }

  signout(): void{
    this.authenticationService.signout().subscribe((response: IResponse<void>) => {
      this.authenticationService.sessionUser = undefined;  
      this.router.navigate(['/signin']);
    });
  }
}
