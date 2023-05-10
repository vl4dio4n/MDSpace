import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { IResponse } from '../interfaces/response-interfacce';
import { Observable } from 'rxjs';
import { IMessage } from '../interfaces/message-interface';
import { HttpClient } from '@angular/common/http';
import { IGroupInfo } from '../interfaces/group-info-interface';
import { IEditGroupProfile } from '../interfaces/edit-group-profile-interface';
import { IUserGroup } from '../interfaces/user-group-interface';
import { ICreateGroup } from '../interfaces/create-group-interface';
import { ICreateThread } from '../interfaces/create-thread-interface';
import { SocketEventsEnum } from '../enums/socket-events-enum';
import { INewMessage } from '../interfaces/new-message-interface';
import { IUserStatus } from '../interfaces/user-status-interface';
import { IUserTyping } from '../interfaces/user-typing-interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private http: HttpClient,
    private socket: Socket) { }

  getMessages(threadId: number): Observable<IResponse<IMessage[]>>{
    return this.http.get<IResponse<IMessage[]>>('/api/get-messages', { params: { threadId: threadId } });
  }

  getGroupInfo(groupId: number): Observable<IResponse<IGroupInfo>>{
    return this.http.get<IResponse<IGroupInfo>>('/api/get-group-info', { params: { groupId: groupId } });
  }

  editGroupProfile(data: IEditGroupProfile): Observable<IResponse<IGroupInfo>>{
    return this.http.post<IResponse<IGroupInfo>>('/api/edit-group-profile', data);
  }

  kickGroupMember(data: IUserGroup): Observable<IResponse<boolean>>{
    return this.http.post<IResponse<boolean>>('/api/kick-group-member', data);
  }

  promoteGroupMember(data: IUserGroup): Observable<IResponse<boolean>>{
    return this.http.post<IResponse<boolean>>('/api/promote-group-member', data);
  }

  demoteGroupMember(data: IUserGroup): Observable<IResponse<boolean>>{
    return this.http.post<IResponse<boolean>>('/api/demote-group-member', data);
  }

  createGroup(data: ICreateGroup): Observable<IResponse<boolean>>{
    return this.http.post<IResponse<boolean>>('/api/create-group', data);
  }

  addUsers(data: string[]): Observable<IResponse<boolean>>{
    return this.http.post<IResponse<boolean>>('/api/add-users', data);
  }

  createThread(data: ICreateThread): Observable<IResponse<boolean>>{
    return this.http.post<IResponse<boolean>>('/api/create-thread', data);
  }

  leaveGroup(data: number): Observable<IResponse<boolean>>{
    return this.http.post<IResponse<boolean>>('/api/leave-group', {groupId: data});
  }

  /********************************************** Socket ********************************************/

  connect(username: string): void{
    this.socket.emit(SocketEventsEnum.SignIn, username)
  }

  disconnect(): void {
    this.socket.emit(SocketEventsEnum.SignOut);
  }

  sendMessage(message: INewMessage): void{
    this.socket.emit(SocketEventsEnum.NewMessage, message);
  }

  newMessageListener(): Observable<IMessage>{
    return this.socket.fromEvent<IMessage>(SocketEventsEnum.NewMessage);
  }

  userStatusListener(): Observable<IUserStatus> {
    return this.socket.fromEvent<IUserStatus>(SocketEventsEnum.UserStatus);
  }

  userTyping(userTyping: IUserTyping): void {
    this.socket.emit(SocketEventsEnum.UserTyping, userTyping);
  }

  userTypingListener(): Observable<IUserTyping> {
    return this.socket.fromEvent<IUserTyping>(SocketEventsEnum.UserTyping)
  }
}
