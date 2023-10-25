import { Component, OnInit , Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { ActivatedRoute, Route, Router, NavigationEnd } from "@angular/router";
import { CrearUsuarioComponent } from 'app/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from 'app/editar-usuario/editar-usuario.component';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { UsuarioService } from 'app/services/usuario.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { debug } from 'console';
import * as _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuario?: UsuarioData;  

  // usuariosList: UsuarioData[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  usuariosList: any[] = []; // Asegúrate de que usuariosList contenga tus datos

  displayedColumns: string[] = ['name', 'email', 'identification', 'phone', 'password', 'roleId', 'actions'];



  constructor(public dialog: MatDialog, private usuarioService: UsuarioService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
this.getUsuariosList();
  }


  getUsuariosList(): void {
    this.usuarioService.getUserList().subscribe((result: any) => {
      this.usuariosList = result;
      this.dataSource = new MatTableDataSource(this.usuariosList);
    });
  }

  openDialog(): void {
    
    
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: '60%', 
      data: {usuario: this.usuario}
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
        debugger;
        if (swalResult.isConfirmed) {
          this.usuarioService.addUsuario(result).subscribe({
            next : () => {
              this.getUsuariosList();
              Swal.fire('Registrado!', '', 'success');
            }, error:(e)=> {
              this.getUsuariosList();
              debugger;
              console.log(e);
              Swal.fire('Error al registrar usuario', '', 'info');
            }
          });
            // Realizar cualquier acción adicional después de guardar
          }
          
        }
  )}
    }
  )};
  

  openDialogEditar(user: any): void {
    
    console.log(user);
    const pUser = _.cloneDeep(user);
    const dialogRef = this.dialog.open(EditarUsuarioComponent, {
      width: '60%',
      data : pUser
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
              next : () => {
                this.getUsuariosList();
                Swal.fire('Cambios guardados!', '', 'success');
              }, error:(e)=> {
                this.getUsuariosList();
                debugger;
                console.log(e);
                Swal.fire('Error al guardar los cambios', '', 'info');
              }
            });
              // Realizar cualquier acción adicional después de guardar
            }
            else if (swalResult.isDenied) {
              // Usuario eligió no guardar los cambios
              Swal.fire('Cambios no guardados', '', 'info');
            }
          }
    )}
      }
    )};


  openEliminar(user: any): void {
    
    Swal.fire({
      title: 'Eliminar usuario?',
      text: 'Está seguro que desea eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        debugger;
        this.usuarioService.deleteUsuario(user);
        setTimeout(()=> {}, 2000);
        this.getUsuariosList();

        // let updatedUsers = this.usuariosList.filter(function(u) {
        //   if (u.userId != user.userId) {
        //   return u;
        //   }
        //   return null;
        // })
        // this.usuariosList = updatedUsers;
        //this.router.navigate([this.router.url]);
        Swal.fire('Eliminado!', 'Usuario eliminado.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'El usuario no fue eliminado', 'error');
      }
    });

  }

}



