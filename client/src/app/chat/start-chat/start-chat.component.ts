import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-start-chat',
  templateUrl: './start-chat.component.html',
  styleUrls: ['./start-chat.component.scss']
})
export class StartChatComponent {
  constructor(
    public dialogRef: MatDialogRef<StartChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {username: string}
  ) { }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
