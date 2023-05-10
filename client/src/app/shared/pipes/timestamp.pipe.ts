import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(value: Date, type: 'contacts-list' | 'chat-box' = "contacts-list"): string {
    const date: Date = new Date(value);
    const currentDate = new Date();

    if(date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDate() === currentDate.getDate() && type == 'contacts-list')
      return `${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;;
    if(date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDate() === currentDate.getDate() && type == 'chat-box')
      return `TODAY`;
    currentDate.setDate(currentDate.getDate() - 1);
    if(date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDate() === currentDate.getDate())
      return `Yesterday`;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

}
