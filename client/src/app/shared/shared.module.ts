import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimestampPipe } from './pipes/timestamp.pipe';



@NgModule({
  declarations: [
    TimestampPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TimestampPipe
  ]
})
export class SharedModule { }
