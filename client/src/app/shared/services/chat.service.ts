import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { IResponse } from '../interfaces/response-interfacce';
import { Observable } from 'rxjs';
import { IMessage } from '../interfaces/message-interface';
import { HttpClient } from '@angular/common/http';
import { IGroupInfo } from '../interfaces/group-info-interface';
import { IEditGroupProfile } from '../interfaces/edit-group-profile';

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

  sendMessage(msg: string): void{
    this.socket.emit('message', msg);
  }

  getMessage(): void{
    this.socket.on('message', (msg: string) => {
      console.log(msg);
    });
  }


}
