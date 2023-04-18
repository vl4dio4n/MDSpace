import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { ISignin } from '../interfaces/signin-interface';
import { IUser } from '../interfaces/user-interface';
import { IResponse } from '../interfaces/response-interfacce';
import { IRegister } from '../interfaces/register-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService{
  public sessionUser: IUser | undefined;

  constructor(private http: HttpClient) { 
    this.http.get<IResponse<IUser>>('/api/verify', {withCredentials: true}).subscribe((response: IResponse<IUser>) => {
      if(response.content){
        this.sessionUser = response.content;
      }
    });
  }

  public signin(credentials: ISignin): Observable<IResponse<IUser>>{
    return this.http.post<IResponse<IUser>>('/api/signin', credentials, { withCredentials: true });
  }

  public register(data: IRegister): Observable<IResponse<IUser>>{
    return this.http.post<IResponse<IUser>>('/api/register', data, { withCredentials: true });
  }

  public signout(): Observable<IResponse<void>>{
    return this.http.get<IResponse<void>>('/api/signout');
  }
}
