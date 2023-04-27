import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberListComponent } from './add-member-list.component';

describe('AddMemberListComponent', () => {
  let component: AddMemberListComponent;
  let fixture: ComponentFixture<AddMemberListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMemberListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
