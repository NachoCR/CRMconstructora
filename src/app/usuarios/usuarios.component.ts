import { Component, OnInit, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { CrearUsuarioComponent } from 'app/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from 'app/editar-usuario/editar-usuario.component';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { UsuarioService } from 'app/services/usuario.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { debug } from 'console';
import * as _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  usuario?: UsuarioData;
  @ViewChild('UsuariosTable') usuariosTable?: ElementRef;

  // usuariosList: UsuarioData[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  usuariosList: any[] = []; // Asegúrate de que usuariosList contenga tus datos
  /*name of the excel-file which will be downloaded. */
  fileName = 'Usuarios.xlsx';

  searchTerm: string = '';
  filteredUsers: any[] = [];

  //Paginacion

  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize: number = 5;
  pageIndex: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator; // <-- Agrega el modificador !

  //

  displayedColumns: string[] = [
    'name',
    'email',
    'identification',
    'phone',
    'password',
    'roleId',
    'actions',
  ];

  constructor(
    public dialog: MatDialog,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.aplicarPaginacion();
    this.getUsuariosList();
    // Llamada inicial para aplicar la paginación
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getUsuariosList(): void {
    this.usuarioService.getUserList().subscribe((result: any) => {
      this.usuariosList = result;
      this.filteredUsers = this.usuariosList;
      this.dataSource = new MatTableDataSource(this.usuariosList);
      this.dataSource.paginator = this.paginator;
      this.aplicarPaginacion(); // Aplicar la paginación aquí
    });
  }

  applyFilter(): void {
    this.filteredUsers = this.usuariosList.filter(
      user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.identification.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  exportTable() {
    this.dataSource.data.map(x => {});

    let data = this.dataSource.data.map(x => ({
      'User Id': x.userId,
      'Tipo Identificacion': x.identifierType,
      'Nombre': x.name,
      'Primer Apellido': x.lastname,
      'Segundo Apellido': x.secondLastname,
      'Teléfono': x.phone,
      'Identificación': x.identification,
      'Correo': x.email,
      'Rol': x.roleId,
      'Posición': x.position,
    }));
    let ws = XLSX.utils.json_to_sheet(data, <XLSX.Table2SheetOpts>{
      sheet: 'usuarios',
    });
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'usuarios');
    XLSX.writeFile(wb, 'usuarios.xlsx');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      data: { usuario: this.usuario },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Mostrar SweetAlert para confirmar los cambios
        Swal.fire({
          title: '¿Quiere registar al usuario?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            this.usuarioService.addUsuario(result).subscribe({
              next: () => {
                this.getUsuariosList();
                Swal.fire('Registrado!', '', 'success');
              },
              error: e => {
                this.getUsuariosList();

                Swal.fire('Error al registrar usuario', '', 'info');
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
    const dialogRef = this.dialog.open(EditarUsuarioComponent, {
      data: pUser,
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
            this.usuarioService.updateUsuario(result).subscribe({
              next: () => {
                this.getUsuariosList();
                Swal.fire('Cambios guardados!', '', 'success');
              },
              error: e => {
                this.getUsuariosList();

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

  openEliminar(user: any): void {
    Swal.fire({
      title: 'Eliminar usuario?',
      text: 'Está seguro que desea eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No',
    }).then(result => {
      if (result.value) {
        this.usuarioService.deleteUsuario(user);
        setTimeout(() => {}, 2000);
        // Agrega un tiempo de espera antes de actualizar la lista
        setTimeout(() => {
          this.getUsuariosList();
          Swal.fire('Eliminado!', 'Usuario eliminado.', 'success');
        }, 2000);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'El usuario no fue eliminado', 'error');
      }
    });
  }

  ocultarContrasena(password: string) {
    let hiddenPassword = '';

    for (let index = 0; index < password.length; index++) {
      hiddenPassword += '*';
    }

    return hiddenPassword.slice(0, 10);
  }

  rolesMap = new Map<number, string>([
    [2, 'Cliente'],
    [1, 'Empleado'],
    [3, 'Administrador'],
    // Agrega más pares ID de rol - Nombre de rol según tus necesidades
  ]);

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.aplicarPaginacion(); // Llamada a la función que aplica la paginación
  }

  aplicarPaginacion(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const paginatedData = this.usuariosList.slice(startIndex, endIndex);
    this.filteredUsers = paginatedData;
  }
}
