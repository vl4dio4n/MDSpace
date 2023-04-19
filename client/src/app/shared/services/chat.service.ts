import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { IResponse } from '../interfaces/response-interfacce';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private socket: Socket) { }

  sendMessage(msg: string): void{
    this.socket.emit('message', msg);
  }

  getMessage(): void{
    this.socket.on('message', (msg: string) => {
      console.log(msg);
    });
  }
}
