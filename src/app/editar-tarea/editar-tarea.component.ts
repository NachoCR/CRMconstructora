import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TareasData } from 'app/interfaces/tareas.interface';

@Component({
  selector: 'app-editar-tarea',
  templateUrl: './editar-tarea.component.html',
  styleUrls: ['./editar-tarea.component.scss'],
})
export class EditarTareaComponent {
  constructor(
    public dialogRef: MatDialogRef<EditarTareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TareasData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
