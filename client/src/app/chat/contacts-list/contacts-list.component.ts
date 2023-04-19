import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { IResponse } from 'src/app/shared/interfaces/response-interfacce';
import { SearchService } from 'src/app/shared/services/search.service';
import { IGroup } from 'src/app/shared/interfaces/group-interface';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit{
  constructor(private searchService: SearchService){}

  ngOnInit(): void {
    // this.searchService.getContacts().subscribe((response: IResponse<IGroup[]>) => {

    // });
  }
}
