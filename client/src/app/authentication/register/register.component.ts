import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IError } from 'src/app/shared/interfaces/error-interface';
import { IRegister } from 'src/app/shared/interfaces/register-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { passwordMatchValidator } from 'src/app/shared/utils/password-match-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  hide = true;
  error: IError | undefined;
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl(''),
    description: new FormControl('')
  }, { validators: passwordMatchValidator });

  constructor(private router: Router,
    private authenticationService: AuthenticationService
  ){
    this.authenticationService.sessionUser = undefined;
  }

  onSubmit(): void {
    const data = this.registerForm.value as IRegister;
    this.authenticationService.register(data).subscribe((response: IResponse<IUser>) => {
      if(response.content){
        this.authenticationService.sessionUser = response.content;
        this.router.navigateByUrl('/home');
      }
      this.error = response.error;
    });
  }

  back(): void {
    this.router.navigate(['/signin']);
  }
}
