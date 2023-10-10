import { Component, OnInit , Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { ActivatedRoute, Route, Router, NavigationEnd } from "@angular/router";
import { CrearUsuarioComponent } from 'app/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from 'app/editar-usuario/editar-usuario.component';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { UsuarioService } from 'app/services/usuario.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuario?: UsuarioData;  

  usuariosList: UsuarioData[] = [];

  constructor(public dialog: MatDialog, private usuarioService: UsuarioService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.usuarioService.getUserList().subscribe((result: any) => {
      this.usuariosList = result;
    });

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: '500px',
      data: {usuario: this.usuario}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.usuarioService.addUsuario(result);
      this.router.navigate([this.router.url]);
    });
  }

  openDialogEditar(user: any): void {
    console.log(user);
    const dialogRef = this.dialog.open(EditarUsuarioComponent, {
      width: '500px',
      data : user
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      return this.usuarioService.updateUsuario(result.user);
    });
  }

  openEliminar(user: any): void {
  this.usuarioService.deleteUsuario(user.user);
  this.router.navigate([this.router.url]);
  }


  }



