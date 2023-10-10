import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProyectoData } from 'app/interfaces/proyecto.interface';

@Component({
  selector: 'app-crear-proyecto',
  templateUrl: './crear-proyecto.component.html',
  styleUrls: ['./crear-proyecto.component.scss']
})
export class CrearProyectoComponent {
  constructor(
    public dialogRef: MatDialogRef<CrearProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProyectoData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
