import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-add-member-list',
  templateUrl: './add-member-list.component.html',
  styleUrls: ['./add-member-list.component.scss']
})
export class AddMemberListComponent {
  sessionUser: IUser;
  @Output() usersEmitter = new EventEmitter<string[]>();
  selectedUsers: string[] = [];

  @Input() maxHeight = 570;
  @Input() members: string[] = [];
  
  constructor(
    private authenticationService: AuthenticationService){
      this.sessionUser = this.authenticationService.sessionUser!;
  }

  userSelected(username: string){
    const index = this.selectedUsers.indexOf(username);
    const isMember = this.members.indexOf(username) >= 0;
    if(index < 0 && username != this.sessionUser.username && !isMember){
      this.selectedUsers = [...this.selectedUsers, username];
      this.usersEmitter.emit(this.selectedUsers);
    }

  }

  remove(username: string): void {
    const index = this.selectedUsers.indexOf(username);
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
      this.usersEmitter.emit(this.selectedUsers);
    }
  }
}
