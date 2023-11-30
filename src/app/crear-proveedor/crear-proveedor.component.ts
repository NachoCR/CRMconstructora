import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { PasswordValidators } from 'app/password-validator';
import { ProveedorData } from 'app/interfaces/proveedor.interface';
import { MatTableDataSource } from '@angular/material/table';
import { ProveedorService } from 'app/services/proveedor.service';
// import { matchpassword } from 'app/confirmed.validator';
// import { CustomValidators } from 'app/custom-validator';

@Component({
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.component.html',
  styleUrls: ['./crear-proveedor.component.scss'],
})
export class CrearProveedorComponent {
  // public crearUForm: FormGroup;

  crearProveedorForm: FormGroup;
  submitted = false;
  isWorking = false;

  minLengthValid: boolean = true; // Agrega esta propiedad
  proveedoresList: any[] = []; // Asegúrate de que usuariosList contenga tus datos
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  proveedor?: ProveedorData;
  constructor(
    public dialogRef: MatDialogRef<CrearProveedorComponent>,
    private proveedorService: ProveedorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    // this.crearUForm = this.crearUsuarioForm();

    this.crearProveedorForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required]),
      identifierId: new FormControl(null, [Validators.required]),
      identifier: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.maxLength(8),
        this.phoneNumberValidator(),
      ]),
      address: new FormControl(null, [Validators.required]),
      details: new FormControl(null),
    });
  }

  checkCedulaExists() {
    const cedulaControl = this.crearProveedorForm.get('identifier');

    if (cedulaControl && this.proveedoresList.length > 0) {
      const identifier = cedulaControl.value;

      const cedulaExists = this.proveedoresList.some(
        proveedor => proveedor.identifier === identifier
      );

      if (cedulaExists) {
        cedulaControl.setErrors({ cedulaExists: true });
      } else {
        cedulaControl.setErrors(null);
      }
    }
  }

  checkEmailExists() {
    const emailControl = this.crearProveedorForm.get('email');

    if (emailControl && this.proveedoresList.length > 0) {
      const email = emailControl.value;

      const emailExists = this.proveedoresList.some(proveedor => proveedor.email === email);

      if (emailExists) {
        emailControl.setErrors({ emailExists: true });
      } else {
        emailControl.setErrors(null);
      }
    }
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

  // Función de validación personalizada para el número de teléfono
  // Función de validación personalizada para el número de teléfono
  private phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumber = control.value;
      const phoneNumberPattern = /^\d{8}$/; // Asumiendo un número de teléfono de 8 dígitos

      if (!phoneNumberPattern.test(phoneNumber)) {
        return { invalidPhoneNumber: true };
      }

      return null;
    };
  }

  ngOnInit(): void {
    this.getProveedoresList();
  }

  getProveedoresList(): void {
    this.proveedorService.getProvidersList().subscribe((result: any) => {
      this.proveedoresList = result;
      this.dataSource = new MatTableDataSource(this.proveedoresList);
    });
  }
}
