import { Component, Input, OnInit } from '@angular/core';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { IUser } from 'src/app/shared/interfaces/user-interface';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() username!: string;
  user?: IUser;

  constructor(private searchService: SearchService){}

  ngOnInit(): void {
    this.searchService.getUserProfile(this.username).subscribe((response: IResponse<IUser>) => {
      if(response.content){
        this.user = response.content;
      }
    });
  }
}
