import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(value: Date): string {
    const date: Date = new Date(value);
    const currentDate = new Date();
    if(date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDay() === currentDate.getDay())
      return `${date.getHours()}:${date.getMinutes()}`;
    currentDate.setDate(currentDate.getDate() - 1);
    if(date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDay() === currentDate.getDay())
      return `Yesterday`;
    return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
  }

}
