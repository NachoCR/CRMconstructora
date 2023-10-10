import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrearProveedorComponent } from 'app/crear-proveedor/crear-proveedor.component';
import { EditarProveedorComponent } from 'app/editar-proveedor/editar-proveedor.component';
import { ProveedorData } from 'app/interfaces/proveedor.interface';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent {

  proveedor?: ProveedorData;  

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearProveedorComponent, {
      width: '500 px',
      data: {proveedor: this.proveedor}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.proveedor = result;
    });
  }

  openDialogEditar(): void {
    const dialogRef = this.dialog.open(EditarProveedorComponent, {
      width: '500 px',
      data: {proveedor: this.proveedor}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.proveedor = result;
    });
  }

}
