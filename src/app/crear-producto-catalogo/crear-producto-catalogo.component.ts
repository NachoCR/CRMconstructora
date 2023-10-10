import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catalogoProveedorData } from 'app/interfaces/catalogoProveedor.interface';
import { ProveedorData } from 'app/interfaces/proveedor.interface';

@Component({
  selector: 'app-crear-producto-catalogo',
  templateUrl: './crear-producto-catalogo.component.html',
  styleUrls: ['./crear-producto-catalogo.component.scss']
})
export class CrearProductoCatalogoComponent {
  constructor(
    public dialogRef: MatDialogRef<CrearProductoCatalogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: catalogoProveedorData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
