import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CrearProveedorComponent } from 'app/crear-proveedor/crear-proveedor.component';
import { EditarProveedorComponent } from 'app/editar-proveedor/editar-proveedor.component';
import { ProveedorData } from 'app/interfaces/proveedor.interface';
import { ProveedorService } from 'app/services/proveedor.service';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss'],
})
export class ProveedoresComponent {
  proveedor?: ProveedorData;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  proveedoresList: any[] = []; // Asegúrate de que usuariosList contenga tus datos

  constructor(
    public dialog: MatDialog,
    private proveedorService: ProveedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProveedoresList();
  }

  getProveedoresList(): void {
    this.proveedorService.getProvidersList().subscribe((result: any) => {
      this.proveedoresList = result;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearProveedorComponent, {
      width: '50%',
      data: { proveedor: this.proveedor },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Mostrar SweetAlert para confirmar los cambios
        Swal.fire({
          title: '¿Quiere registar el proveedor?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            this.proveedorService.addProveedor(result).subscribe({
              next: () => {
                this.getProveedoresList();
                Swal.fire('Registrado!', '', 'success');
              },
              error: e => {
                this.getProveedoresList();
                console.log(e);
                Swal.fire('Error al registrar proveedor', '', 'info');
              },
            });
            // Realizar cualquier acción adicional después de guardar
          }
        });
      }
    });
  }

  openDialogEditar(provider: any): void {
    console.log(provider);
    const pProveedor = _.cloneDeep(provider);
    const dialogRef = this.dialog.open(EditarProveedorComponent, {
      width: '50%',
      data: pProveedor,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Mostrar SweetAlert para confirmar los cambios
        Swal.fire({
          title: '¿Quiere guardar los cambios?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            this.proveedorService.updateProveedor(result).subscribe({
              next: () => {
                this.getProveedoresList();
                Swal.fire('Cambios guardados!', '', 'success');
              },
              error: e => {
                this.getProveedoresList();
                debugger;
                console.log(e);
                Swal.fire('Error al guardar los cambios', '', 'info');
              },
            });
            // Realizar cualquier acción adicional después de guardar
          } else if (swalResult.isDenied) {
            // Usuario eligió no guardar los cambios
            Swal.fire('Cambios no guardados', '', 'info');
          }
        });
      }
    });
  }

  openEliminar(provider: any): void {
    Swal.fire({
      title: 'Eliminar proyecto?',
      text: 'Está seguro que desea eliminar este proveedor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No',
    }).then(result => {
      if (result.value) {
        debugger;
        this.proveedorService.deleteProveedor(provider);
        let updatedProviders = this.proveedoresList.filter(function (u) {
          if (u.providerId != provider.providerId) {
            return u;
          }
          return null;
        });
        this.proveedoresList = updatedProviders;
        Swal.fire('Eliminado!', 'Proveedor eliminado.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'El proveedor no fue eliminado', 'error');
      }
    });
  }
}
