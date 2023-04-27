import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICreateGroup } from 'src/app/shared/interfaces/create-group-interface';
import { IError } from 'src/app/shared/interfaces/error-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent {
  sessionUser: IUser;

  error: IError | undefined;

  createGroupForm = new FormGroup({
    groupId: new FormControl(0),
    groupName: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });

  members: string[] = [];

  @Output() groupCreated = new EventEmitter<boolean>();

  constructor(
    private chatService: ChatService,
    private authenticationService: AuthenticationService){
      this.sessionUser = this.authenticationService.sessionUser!;
  }

  getMembers(members: string[]){
    this.members = members;
    console.log(this.members);
  }

  onSubmit(){
    const newGroup: ICreateGroup = {
      groupName: this.createGroupForm.value.groupName!,
      description: this.createGroupForm.value.description!,
      members: this.members
    }
    this.chatService.createGroup(newGroup).subscribe((response: IResponse<boolean>) => {
      if(response.error){
        this.error == response.error;
      } else {
        this.groupCreated.emit(true);
      }
    })
  }
  
}
