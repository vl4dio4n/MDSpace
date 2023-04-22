import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SidenavEnum } from 'src/app/shared/enums/sidenav-enum';
import { IEditUserProfile } from 'src/app/shared/interfaces/edit-user-profile-interface';
import { IError } from 'src/app/shared/interfaces/error-interface';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { IUserProfile } from 'src/app/shared/interfaces/user-profile-interface';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnChanges{
  @Input() sidenavType!: SidenavEnum;
  @Input() username!: string;
  @Output() profileUpdated = new EventEmitter<boolean>();

  user!: IUserProfile;
  sidenavEnum = SidenavEnum;

  hidePassword = true;
  hideNewPassword = true;
  error: IError | undefined;
  editUserProfileForm?: FormGroup;

  constructor(private searchService: SearchService){}

  ngOnChanges(changes: SimpleChanges): void {
    this.searchService.getUserProfile(this.username).subscribe((response: IResponse<IUserProfile>) => {
      if(response.content){
        this.user = response.content;
        this.editUserProfileForm = new FormGroup({
          username: new FormControl(this.user.username),
          email: new FormControl(this.user.email, [Validators.required, Validators.email]),
          password: new FormControl('', [Validators.required]),
          newPassword: new FormControl(''),
          description: new FormControl(this.user.description)
        });
      }
    });
  }

  onSubmit(): void {
    const data = this.editUserProfileForm!.value as IEditUserProfile;
    this.searchService.editUserProfile(data).subscribe((response: IResponse<IUserProfile>) => {
      if(response.content){
        this.user = response.content;
        this.sidenavType = SidenavEnum.UserProfile;
        this.profileUpdated.emit(true);
      }
      this.error = response.error;
    });
  }
}