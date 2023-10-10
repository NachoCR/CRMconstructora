import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioData } from 'app/interfaces/usuario.interface';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent {

  constructor(
    public dialogRef: MatDialogRef<CrearUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

