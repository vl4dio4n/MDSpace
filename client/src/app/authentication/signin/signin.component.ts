import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IError } from 'src/app/shared/interfaces/error-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { ISignin } from 'src/app/shared/interfaces/signin-interface';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  hide = true;
  error: IError | undefined;
  signinForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ){
    this.authenticationService.sessionUser = undefined;
  }

  onSubmit(): void{
    const credentials = this.signinForm.value as ISignin;
    this.authenticationService.signin(credentials).subscribe((response: IResponse<IUser>) => {
      if(response.content){
        this.authenticationService.sessionUser = response.content;
        this.router.navigateByUrl('/home');
      }
      this.error = response.error;
    });
  }

  register(): void{
    this.router.navigate(['/register']);
  }
}
