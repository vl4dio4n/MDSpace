import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from '../shared/material/material.module';
import { SearchUserComponent } from './search-user/search-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactsListComponent } from './contacts-list/contacts-list.component';

@NgModule({
  declarations: [
    HomeComponent,
    SearchUserComponent,
    ContactsListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ChatModule { }
