import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog-component.html',
})
export class EventDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public eventData: any, // Inject event data
    public dialogRef: MatDialogRef<EventDetailsDialogComponent>
  ) {}
}
