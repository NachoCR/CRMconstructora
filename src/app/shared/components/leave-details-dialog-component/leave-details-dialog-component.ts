import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-details-dialog',
  templateUrl: './leave-details-dialog-component.html',
})
export class LeaveDetailsDialogComponent implements OnInit {
  eventData: any;
  color: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LeaveDetailsDialogComponent>
  ) {}
  ngOnInit(): void {
    this.eventData = this.data.data;
  }
}
