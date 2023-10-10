import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TareasData } from 'app/interfaces/tareas.interface';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  styleUrls: ['./crear-tarea.component.scss']
})
export class CrearTareaComponent {
  constructor(
    public dialogRef: MatDialogRef<CrearTareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TareasData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
