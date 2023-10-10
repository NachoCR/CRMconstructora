import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProveedorData } from 'app/interfaces/proveedor.interface';

@Component({
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.component.html',
  styleUrls: ['./crear-proveedor.component.scss']
})
export class CrearProveedorComponent {
  constructor(
    public dialogRef: MatDialogRef<CrearProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProveedorData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
