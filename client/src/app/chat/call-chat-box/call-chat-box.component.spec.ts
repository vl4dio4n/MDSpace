import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallChatBoxComponent } from './call-chat-box.component';

describe('CallChatBoxComponent', () => {
  let component: CallChatBoxComponent;
  let fixture: ComponentFixture<CallChatBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallChatBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallChatBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
