import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from '../shared/material/material.module';
import { SearchUserComponent } from './search-user/search-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { SharedModule } from '../shared/shared.module';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GroupProfileComponent } from './group-profile/group-profile.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { AddMemberListComponent } from './add-member-list/add-member-list.component';
import { AddMemberComponent } from './add-member/add-member.component';

@NgModule({
  declarations: [
    HomeComponent,
    SearchUserComponent,
    ContactsListComponent,
    ChatBoxComponent,
    UserProfileComponent,
    GroupProfileComponent,
    CreateGroupComponent,
    AddMemberListComponent,
    AddMemberComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ChatModule { }
