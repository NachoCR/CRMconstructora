import { Component, OnInit , Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { Router } from "@angular/router";
import { CrearUsuarioComponent } from 'app/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from 'app/editar-usuario/editar-usuario.component';
import { UsuarioData } from 'app/interfaces/usuario.interface';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent  {

  usuario?: UsuarioData;  

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: '500px',
      data: {usuario: this.usuario}
    });



    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.usuario = result;
    });
  }

  openDialogEditar(): void {
    const dialogRef = this.dialog.open(EditarUsuarioComponent, {
      width: '500px',
      data: {usuario: this.usuario}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.usuario = result;
    });
  }

  }



