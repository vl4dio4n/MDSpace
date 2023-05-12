import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { ISearchUser } from 'src/app/shared/interfaces/search-user-interface';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnChanges{
  searchControl = new FormControl('');
  searchResults: ISearchUser[] = [];
  message = "";
  @Output() hasInput = new EventEmitter<boolean>();
  @Output() userSelected = new EventEmitter<string>();
  @Input() maxHeight = 570;
  @Input() clearSearch = false;

  constructor(private searchService: SearchService){
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(value => {
      if(value != null && value != ""){
        this.hasInput.emit(true);
        this.searchService.searchUser(value).subscribe((response: IResponse<ISearchUser[]>) => {
          if(response.content){
            this.searchResults = response.content;
            if(response.content.length == 0){
              this.message = "No results found..."
            } else {
              this.message = "";
            }
          }
        });
      } else {
        this.hasInput.emit(false);
        this.searchResults = [];
        this.message = "";
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['clearSearch']?.previousValue != changes['clearSearch']?.currentValue){
      this.searchControl.reset();
    }
  }

  onUserSelected(username: string) {
    this.userSelected.emit(username);
  }
}
