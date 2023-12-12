import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { ContactosData } from 'app/interfaces/contacto.interface';
import { ContactoService } from 'app/services/contacto.service';
import { CrearContactoComponent } from 'app/contactos/crear-contacto/crear-contacto.component';
import Swal from 'sweetalert2';
import { EditarContactoComponent } from 'app/contactos/editar-contacto/editar-contacto.component';
import * as _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { DetallesContactoComponent } from '../detalles-contacto/detalles-contacto.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss'],
})
export class ContactosComponent implements OnInit {
  contacto?: ContactosData;

  // usuariosList: UsuarioData[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  contactoList: any[] = []; // Asegúrate de que usuariosList contenga tus datos
  searchTerm: string = '';
  filteredContacts: any[] = [];

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize: number = 5;
  pageIndex: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator; // <-- Agrega el modificador !

  displayedColumns: string[] = ['name', 'email', 'phone', 'details', 'providerId', 'actions'];

  constructor(
    public dialog: MatDialog,
    private contactoService: ContactoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.aplicarPaginacion();
    this.getContactoList();
    // Llamada inicial para aplicar la paginación
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getContactoList(): void {
    this.contactoService.getContactoList().subscribe((result: any) => {
      this.contactoList = result;
      this.filteredContacts = this.contactoList;
      this.dataSource = new MatTableDataSource(this.contactoList);
      this.dataSource.paginator = this.paginator;
      this.aplicarPaginacion(); // Aplicar la paginación aquí
    });
  }

  applyFilter(): void {
    this.filteredContacts = this.contactoList.filter(contact =>
      contact.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearContactoComponent, {
      // width: '50%',
      data: { contacto: this.contacto },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Swal.fire({
          title: '¿Quiere registar al contacto?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            this.contactoService.addContacto(result).subscribe({
              next: () => {
                this.getContactoList();
                Swal.fire('Registrado!', '', 'success');
              },
              error: e => {
                this.getContactoList();

                Swal.fire('Error al registrar contacto', '', 'info');
              },
            });
            // Realizar cualquier acción adicional después de guardar
          }
        });
      }
    });
  }

  openDialogEditar(user: any): void {
    const pUser = _.cloneDeep(user);
    const dialogRef = this.dialog.open(EditarContactoComponent, {
      data: pUser,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //Object.assign(user, result);
        Swal.fire({
          title: '¿Quiere guardar los cambios?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            this.contactoService.updateContacto(result).subscribe({
              next: () => {
                this.getContactoList();
                Swal.fire('Guardados!', '', 'success');
              },
              error: e => {
                this.getContactoList();
                Swal.fire('Error al guardar los cambios', '', 'info');
              },
            });
          } else if (swalResult.isDenied) {
            Swal.fire('Cambios no guardados', '', 'info');
          }
        });
      }
    });
  }

  openEliminar(contacto: any): void {
    //console.table(contacto);
    Swal.fire({
      title: 'Eliminar contacto?',
      text: 'Está seguro que desea eliminar este contacto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No',
    }).then(result => {
      if (result.value) {
        this.contactoService.deleteContacto(contacto);
        setTimeout(() => {}, 2000);
        // Agrega un tiempo de espera antes de actualizar la lista
        setTimeout(() => {
          this.getContactoList();
          Swal.fire('Eliminado!', 'Contacto eliminado.', 'success');
        }, 2000);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'El Contacto no fue eliminado', 'error');
      }
    });
  }

  openDetailsDialog(contacto: any): void {
    this.contactoService.getContactDetails(contacto.contactId).subscribe((contactDetails: any) => {
      //console.table(contactDetails);
      const dialogRef = this.dialog.open(DetallesContactoComponent, {
        data: contactDetails,
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
    const paginatedData = this.contactoList.slice(startIndex, endIndex);
    this.filteredContacts = paginatedData;
  }
}
