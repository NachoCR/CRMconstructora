import { Component, OnInit } from '@angular/core';
import { catalogoProveedorData } from '../../interfaces/catalogoProveedor.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductoService } from 'app/services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrearProductoComponent } from '../crear-producto/crear-producto.component';
import Swal from 'sweetalert2';
import { DetallesProductoComponent } from '../detalles-producto/detalles-producto.component';
import { EditarProductoComponent } from '../editar-producto/editar-producto.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit{

  producto? : catalogoProveedorData;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  productoList: any[] = [];

  displayedColumns: string[] = ['name', 'details', 'price', 'providerId', 'unitId', 'quantity', 'actions'];

  constructor(public dialog: MatDialog, private productoService: ProductoService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getProductoList();
    console.table(this.getProductoList());
  }

  getProductoList(): void {
    this.productoService.getProductoList().subscribe((result: any) => {
      this.productoList = result;
      this.dataSource = new MatTableDataSource(this.productoList);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearProductoComponent, {
      data: { producto: this.producto }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Swal.fire({
          title: '¿Quiere registar el producto?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            this.productoService.addProducto(result).subscribe({
              next: () => {
                this.getProductoList();
                Swal.fire('Registrado!', '', 'success');
              }, error: (e) => {
                this.getProductoList();
                debugger;
                Swal.fire('Error al registrar contacto', '', 'info');
              }
            });
          }

        }
        )
      }
    }
    )
  };

  openDialogEditar(producto: any): void {
    const dialogRef = this.dialog.open(EditarProductoComponent, {
      data: producto
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //Object.assign(producto, result);
        Swal.fire({
          title: '¿Quiere guardar los cambios?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            this.productoService.updateProducto(result).subscribe({
              next: () => {
                this.getProductoList();
                Swal.fire('Guardados!', '', 'success');
              }, error: (e) => {
                this.getProductoList();
                debugger;
                Swal.fire('Error al guardar los cambios', '', 'info');
              }
            });
          }
          else if (swalResult.isDenied) {
            Swal.fire('Cambios no guardados', '', 'info');
          }
        }
        )
      }
    }
    )
  };

  openEliminar(producto: any): void {
    Swal.fire({
      title: 'Eliminar producto?',
      text: 'Está seguro que desea eliminar este contacto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.productoService.deleteProducto(producto);
        this.productoList = this.productoList.filter(u => u.itemId !== producto.itemId);
        this.dataSource.data = this.productoList;
        Swal.fire('Eliminado!', 'Producto eliminado.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'El Producto no fue eliminado', 'error');
      }
    });
  }

  openDetailsDialog(producto: any): void {
    this.productoService.getProductoDetails(producto.itemId).subscribe((productoDetails: any) => {
      const dialogRef = this.dialog.open(DetallesProductoComponent, {
        data: productoDetails
      });
    });
  }

}
