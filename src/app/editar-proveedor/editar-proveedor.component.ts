import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProveedorData } from 'app/interfaces/proveedor.interface';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styleUrls: ['./editar-proveedor.component.scss']
})
export class EditarProveedorComponent {
  constructor(
    public dialogRef: MatDialogRef<EditarProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProveedorData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
