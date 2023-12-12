import { Component, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CrearProveedorComponent } from 'app/crear-proveedor/crear-proveedor.component';
import { EditarProveedorComponent } from 'app/editar-proveedor/editar-proveedor.component';
import { ProveedorData } from 'app/interfaces/proveedor.interface';
import { ProveedorService } from 'app/services/proveedor.service';
import * as _ from 'lodash';

import Swal from 'sweetalert2';

@Pipe({
  name: 'filter2',
})
export class FilterPipe2 implements PipeTransform {
  transform(items2: any[], filtro2: string): any[] {
    if (!items2 || !filtro2) {
      return items2;
    }

    return items2.filter(itemProv => {
      // Implementa tu lógica de filtrado según tus necesidades
      return itemProv.name.toLowerCase().includes(filtro2);
      // Agrega más propiedades según sea necesario
    });
  }
}

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss'],
})
export class ProveedoresComponent {
  proveedor?: ProveedorData;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  proveedoresList: any[] = []; // Asegúrate de que usuariosList contenga tus datos
  filtroNew: string = '';
  proveedoresPaginados: any[] = []; // Lista que se mostrará en la página actual
  proveedoresFiltrados: any[] = [];

  //Paginacion

  pageSizeOptions: number[] = [6, 10, 25, 100];
  pageSize: number = 6;
  pageIndex: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator; // <-- Agrega el modificador !

  //

  aplicarFiltroProv(filtro2: string): void {
    this.filtroNew = filtro2;
  }
  constructor(
    public dialog: MatDialog,
    private proveedorService: ProveedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProveedoresList();
  }

  ngAfterViewInit(): void {
    this.aplicarPaginacion();
  }

  getProveedoresList(): void {
    this.proveedorService.getProvidersList().subscribe((result: any) => {
      this.proveedoresList = result;
      this.aplicarPaginacion(); // Aplicar la paginación aquí
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

  checkProveedorImage(url?: string): string {
    if (url) {
      return url ?? '';
    }
    return '../../assets/images/epaLoog.webp';
  }

  openEliminar(provider: any): void {
    Swal.fire({
      title: 'Eliminar proveedor?',
      text: 'Está seguro que desea eliminar este proveedor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No',
    }).then(result => {
      if (result.value) {
        this.proveedorService.deleteProveedor(provider);
        setTimeout(() => {}, 2000);
        // Agrega un tiempo de espera antes de actualizar la lista
        setTimeout(() => {
          this.getProveedoresList();
          Swal.fire('Eliminado!', 'Proveedor eliminado.', 'success');
        }, 2000);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'El proveedor no fue eliminado', 'error');
      }
    });
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.aplicarPaginacion(); // Llamada a la función que aplica la paginación
  }

  aplicarPaginacion(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.proveedoresPaginados = this.proveedoresList.slice(startIndex, endIndex);
  }
}
