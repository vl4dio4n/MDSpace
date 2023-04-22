import { Injectable } from '@angular/core';
import { ISearchUser } from '../interfaces/search-user-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IResponse } from '../interfaces/response-interfacce';
import { IGroup } from '../interfaces/group-interface';
import { IUser } from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  searchUser(data: string): Observable<IResponse<ISearchUser[]>>{
    return this.http.get<IResponse<ISearchUser[]>>('/api/search-user', { params: { data: data } });
  }

  getContacts(): Observable<IResponse<IGroup[]>>{
    return this.http.get<IResponse<IGroup[]>>('/api/get-contacts');
  }

  getUserProfile(data: string): Observable<IResponse<IUser>>{
    return this.http.get<IResponse<IUser>>('/api/get-user-profile', { params: { data: data } });
  }
}
