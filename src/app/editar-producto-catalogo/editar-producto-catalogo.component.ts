import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catalogoProveedorData } from 'app/interfaces/catalogoProveedor.interface';

@Component({
  selector: 'app-editar-producto-catalogo',
  templateUrl: './editar-producto-catalogo.component.html',
  styleUrls: ['./editar-producto-catalogo.component.scss'],
})
export class EditarProductoCatalogoComponent {
  constructor(
    public dialogRef: MatDialogRef<EditarProductoCatalogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: catalogoProveedorData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
