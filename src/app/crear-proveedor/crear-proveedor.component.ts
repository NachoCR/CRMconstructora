import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { PasswordValidators } from 'app/password-validator';
import { ProveedorData } from 'app/interfaces/proveedor.interface';
// import { matchpassword } from 'app/confirmed.validator';
// import { CustomValidators } from 'app/custom-validator';

@Component({
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.component.html',
  styleUrls: ['./crear-proveedor.component.scss']
})
export class CrearProveedorComponent {

  // public crearUForm: FormGroup;

  crearProveedorForm: FormGroup;
  submitted = false;
  isWorking = false;

  minLengthValid: boolean = true; // Agrega esta propiedad
  
  proveedor?: ProveedorData;
  constructor(
    public dialogRef: MatDialogRef<CrearProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    // this.crearUForm = this.crearUsuarioForm();

    this.crearProveedorForm = new FormGroup(
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
    return this.crearProveedorForm.controls;
  }



  crear() {
    this.submitted = true;

    if (this.crearProveedorForm.invalid) {
      return;
    }

    this.isWorking = true;
    this.crearProveedorForm.disable();

    setTimeout(() => {
      this.isWorking = false;
      this.crearProveedorForm.enable();
    }, 1500);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    console.log(this.data);
  }

}


