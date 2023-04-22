import { Injectable } from '@angular/core';
import { ISearchUser } from '../interfaces/search-user-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IResponse } from '../interfaces/response-interfacce';
import { IGroup } from '../interfaces/group-interface';
import { IUserProfile } from '../interfaces/user-profile-interface';
import { IEditUserProfile } from '../interfaces/edit-user-profile-interface';

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

  getUserProfile(data: string): Observable<IResponse<IUserProfile>>{
    return this.http.get<IResponse<IUserProfile>>('/api/get-user-profile', { params: { data: data } });
  }

  editUserProfile(data: IEditUserProfile): Observable<IResponse<IUserProfile>>{
    return this.http.post<IResponse<IUserProfile>>('/api/edit-user-profile', data, { withCredentials: true });
  }
}
