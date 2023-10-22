import { Component, OnInit , Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { ActivatedRoute, Route, Router, NavigationEnd } from "@angular/router";
import { ContactosData } from 'app/interfaces/contacto.interface';
import { ContactoService } from 'app/services/contacto.service';
import { CrearContactoComponent } from 'app/contactos/crear-contacto/crear-contacto.component';
import Swal from 'sweetalert2';
import { EditarContactoComponent } from 'app/contactos/editar-contacto/editar-contacto.component';
import * as _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss']
})
export class ContactosComponent implements OnInit {

  contacto?: ContactosData;  

  // usuariosList: UsuarioData[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  contactoList: any[] = []; // Asegúrate de que usuariosList contenga tus datos

  displayedColumns: string[] = ['name', 'email', 'phone', 'details', 'providerId', 'actions'];



  constructor(public dialog: MatDialog, private contactoService: ContactoService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
this.getContactoList();
  }


  getContactoList(): void {
    this.contactoService.getContactoList().subscribe((result: any) => {
      this.contactoList = result;
      this.dataSource = new MatTableDataSource(this.contactoList);
    });
  }

  openDialog(): void {
    
    
    const dialogRef = this.dialog.open(CrearContactoComponent, {
      width: '50%',
      data: {contacto: this.contacto}
    });
    dialogRef.afterClosed().subscribe(result => {

    //   console.log('The dialog was closed');
    //   console.log(this.usuario);
    //   this.usuarioService.addUsuario(result);
    //   this.getUsuariosList();
    // });

    if (result) {
      // Mostrar SweetAlert para confirmar los cambios
      Swal.fire({
        title: '¿Quiere registar al contacto?',
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `No guardar`,
      }).then(swalResult => {
        if (swalResult.isConfirmed) {
          this.contactoService.addContacto(result).subscribe({
            next : () => {
              this.getContactoList();
              Swal.fire('Registrado!', '', 'success');
            }, error:(e)=> {
              this.getContactoList();
              debugger;
              console.log(e);
              Swal.fire('Error al registrar contacto', '', 'info');
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
    const dialogRef = this.dialog.open(EditarContactoComponent, {
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
            this.contactoService.updateContacto(result).subscribe({
              next : () => {
                this.getContactoList();
                Swal.fire('Guardados!', '', 'success');
              }, error:(e)=> {
                this.getContactoList();
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


  openEliminar(contacto: any): void {
    
    Swal.fire({
      title: 'Eliminar contacto?',
      text: 'Está seguro que desea eliminar este contacto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.contactoService.deleteContacto(contacto.contacto);
        let updatedContacts = this.contactoList.filter(function(u) {
          if (u.contactId != contacto.contacto.contactId) {
          return u;
          }
          return null;
        })
        this.contactoList = updatedContacts;
        this.router.navigate([this.router.url]);
        Swal.fire('Eliminado!', 'Contacto eliminado.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'El Contacto no fue eliminado', 'error');
      }
    });

  }}




