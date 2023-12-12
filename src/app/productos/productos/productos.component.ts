import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { catalogoProveedorData } from '../../interfaces/catalogoProveedor.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductoService } from 'app/services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CrearProductoComponent } from '../crear-producto/crear-producto.component';
import Swal from 'sweetalert2';
import { DetallesProductoComponent } from '../detalles-producto/detalles-producto.component';
import { EditarProductoComponent } from '../editar-producto/editar-producto.component';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx'; 

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



  searchTerm: string = '';
  filteredProductos: any[] = [];
  //Paginacion

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize: number = 5;
  pageIndex: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator; // <-- Agrega el modificador !
  @ViewChild("productosTable") productosTable? : ElementRef;

  //
  fileName= 'tareas.xlsx'; 

  //
  constructor(public dialog: MatDialog, private productoService: ProductoService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.aplicarPaginacion();
    this.getProductoList();
    console.table(this.getProductoList());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getProductoList(): void {
    this.productoService.getProductoList().subscribe((result: any) => {
      this.productoList = result;
      this.filteredProductos = this.productoList;
      this.dataSource = new MatTableDataSource(this.productoList);
      this.dataSource.paginator = this.paginator;
      this.aplicarPaginacion(); // Aplicar la paginación aquí
    });
  }

  exportTable() {
    this.dataSource.data.map(x => {
      console.log(x);
    })
  
    let data = this.dataSource.data.map(x => ({
      "Nombre": x.name,
      "Detalles" : x.details,
      "Precio": x.price,
      "Proveedor": x.provider.name,
      "Cantidad": x.quantity
    }))
    let ws = XLSX.utils.json_to_sheet(data, <XLSX.Table2SheetOpts>{
      sheet: "productos"
    });
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'productos'); 
    XLSX.writeFile(wb, 'productos.xlsx');
  }

  applyFilter(): void {
    this.filteredProductos = this.productoList.filter((producto) =>
      producto.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      producto.details.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    
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
                ;
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
                ;
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
  
  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.aplicarPaginacion(); // Llamada a la función que aplica la paginación
  }

  aplicarPaginacion(): void {
    const startIndex = this.pageIndex * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  const paginatedData = this.productoList.slice(startIndex, endIndex);
  this.filteredProductos = paginatedData;
  console.log(paginatedData)
  }

}
