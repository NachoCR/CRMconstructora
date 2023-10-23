import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProveedorData } from 'app/interfaces/proveedor.interface';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styleUrls: ['./editar-proveedor.component.scss']
})
export class EditarProveedorComponent {
  // public crearUForm: FormGroup;

  editarProveedorForm: FormGroup;
  submitted = false;
  isWorking = false;

  minLengthValid: boolean = true; // Agrega esta propiedad
  
  proveedor?: ProveedorData;
  constructor(
    public dialogRef: MatDialogRef<EditarProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    // this.crearUForm = this.crearUsuarioForm();

    this.editarProveedorForm = new FormGroup(
      {
      email: new FormControl(null, [Validators.required, Validators.email]),
      name : new FormControl(null, [Validators.required]),
      identifierId : new FormControl(null, [Validators.required]),
      identifier : new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
      phone : new FormControl(null, [Validators.required]),
      address : new FormControl(null, [Validators.required]),
      details : new FormControl(null)
    }
  );
  }


  get f() {
    return this.editarProveedorForm.controls;
  }



  crear() {
    this.submitted = true;

    if (this.editarProveedorForm.invalid) {
      return;
    }

    this.isWorking = true;
    this.editarProveedorForm.disable();

    setTimeout(() => {
      this.isWorking = false;
      this.editarProveedorForm.enable();
    }, 1500);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    console.log(this.data);
  }
}
