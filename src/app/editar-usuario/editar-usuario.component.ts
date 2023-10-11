import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { UsuarioService } from 'app/services/usuario.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {

  //@Input user?: UsuarioData

  usuario?: UsuarioData;

  constructor(

    public dialogRef: MatDialogRef<EditarUsuarioComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) { }




  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    console.log(this.data);
  }
}
