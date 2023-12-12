import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detalles-solicitud',
  templateUrl: './detalles-solicitud.component.html',
  styleUrls: ['./detalles-solicitud.component.scss']
})
export class DetallesSolicitudComponent {
  constructor(
    public dialogRef: MatDialogRef<DetallesSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  cerrarModal() {
    this.dialogRef.close();
  }
}
