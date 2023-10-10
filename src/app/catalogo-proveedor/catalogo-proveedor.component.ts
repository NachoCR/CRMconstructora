import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrearProductoCatalogoComponent } from 'app/crear-producto-catalogo/crear-producto-catalogo.component';
import { CrearProveedorComponent } from 'app/crear-proveedor/crear-proveedor.component';
import { EditarProductoCatalogoComponent } from 'app/editar-producto-catalogo/editar-producto-catalogo.component';
import { EditarProveedorComponent } from 'app/editar-proveedor/editar-proveedor.component';
import { catalogoProveedorData } from 'app/interfaces/catalogoProveedor.interface';
import { ProveedorData } from 'app/interfaces/proveedor.interface';

@Component({
  selector: 'app-catalogo-proveedor',
  templateUrl: './catalogo-proveedor.component.html',
  styleUrls: ['./catalogo-proveedor.component.scss']
})
export class CatalogoProveedorComponent {
  catalogo?: catalogoProveedorData;  

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearProductoCatalogoComponent, {
      width: '500 px',
      data: {catalogo: this.catalogo}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.catalogo = result;
    });
  }

  openDialogEditar(): void {
    const dialogRef = this.dialog.open(EditarProductoCatalogoComponent, {
      width: '500 px',
      data: {catalogo: this.catalogo}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.catalogo = result;
    });
  }
}
