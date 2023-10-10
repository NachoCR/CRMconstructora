import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrearProyectoComponent } from 'app/crear-proyecto/crear-proyecto.component';
import { ProyectoData } from 'app/interfaces/proyecto.interface';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent {

  proyecto?: ProyectoData;  

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearProyectoComponent, {
      width: '200 px',
      data: {proyecto: this.proyecto}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.proyecto = result;
    });
  }


  openDialogEditar(): void {
    const dialogRef = this.dialog.open(CrearProyectoComponent, {
      width: '150 px',
      data: {proyecto: this.proyecto}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.proyecto = result;
    });
  }

}
