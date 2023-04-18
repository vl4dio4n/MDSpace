import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { IResponse } from '../interfaces/response-interfacce';
import { IUser } from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if(this.authenticationService.sessionUser){
          return true;
        } else {
          this.router.navigate(['/signin']);
          return false;
        }
  }
  
}
