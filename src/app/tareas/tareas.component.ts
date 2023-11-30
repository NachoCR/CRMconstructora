import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrearTareaComponent } from 'app/crear-tarea/crear-tarea.component';
import { EditarTareaComponent } from 'app/editar-tarea/editar-tarea.component';
import { TareasData } from 'app/interfaces/tareas.interface';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss'],
})
export class TareasComponent {
  tarea?: TareasData;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearTareaComponent, {
      width: '500px',
      data: { tarea: this.tarea },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.tarea = result;
    });
  }

  openDialogEditar(): void {
    const dialogRef = this.dialog.open(EditarTareaComponent, {
      width: '500px',
      data: { tarea: this.tarea },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.tarea = result;
    });
  }
}
