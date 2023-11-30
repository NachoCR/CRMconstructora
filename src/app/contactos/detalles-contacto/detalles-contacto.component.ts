import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detalles-contacto',
  templateUrl: './detalles-contacto.component.html',
  styleUrls: ['./detalles-contacto.component.scss'],
})
export class DetallesContactoComponent {
  constructor(
    public dialogRef: MatDialogRef<DetallesContactoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
