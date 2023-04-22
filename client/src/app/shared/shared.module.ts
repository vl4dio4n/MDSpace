import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimestampPipe } from './pipes/timestamp.pipe';
import { HoursMinutesPipe } from './pipes/hours-minutes.pipe';



@NgModule({
  declarations: [
    TimestampPipe,
    HoursMinutesPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TimestampPipe,
    HoursMinutesPipe
  ]
})
export class SharedModule { }
