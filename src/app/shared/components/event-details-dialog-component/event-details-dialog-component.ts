import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog-component.html',
})
export class EventDetailsDialogComponent implements OnInit {
  eventData: any;
  color: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EventDetailsDialogComponent>
  ) {}
  ngOnInit(): void {
    this.eventData = this.data.data;
  }
}
