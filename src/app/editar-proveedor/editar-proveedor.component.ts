import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProveedorData } from 'app/interfaces/proveedor.interface';
import { ProveedorService } from 'app/services/proveedor.service';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styleUrls: ['./editar-proveedor.component.scss'],
})
export class EditarProveedorComponent {
  // public crearUForm: FormGroup;

  editarProveedorForm: FormGroup;
  submitted = false;
  isWorking = false;

  minLengthValid: boolean = true; // Agrega esta propiedad
  proveedoresList: any[] = []; // Asegúrate de que usuariosList contenga tus datos
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  proveedor?: ProveedorData;
  correoOriginal: any;
  cedulaOriginal: any;

  constructor(
    public dialogRef: MatDialogRef<EditarProveedorComponent>,
    private proveedorService: ProveedorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    // this.crearUForm = this.crearUsuarioForm();

    this.cedulaOriginal = data.identifier;
    this.correoOriginal = data.email;

    this.editarProveedorForm = new FormGroup({
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
    const cedulaControl = this.editarProveedorForm.get('identifier');
    debugger;
    if (cedulaControl && this.proveedoresList.length > 0) {
      const identifier = cedulaControl.value;

      const cedulaExists = this.proveedoresList.some(
        proveedor => proveedor.identifier === identifier
      );
      if (this.cedulaOriginal != identifier) {
        if (cedulaExists) {
          cedulaControl.setErrors({ cedulaExists: true });
        } else {
          cedulaControl.setErrors(null);
        }
      }
    }
  }

  checkEmailExists() {
    const emailControl = this.editarProveedorForm.get('email');
    debugger;
    if (emailControl && this.proveedoresList.length > 0) {
      const email = emailControl.value;

      const emailExists = this.proveedoresList.some(proveedor => proveedor.email === email);

      if (this.correoOriginal != email) {
        if (emailExists) {
          emailControl.setErrors({ emailExists: true });
        } else {
          emailControl.setErrors(null);
        }

        // if (emailExists) {
        //   emailControl.setErrors({ 'emailExists': true });
        // } else {
        //   emailControl.setErrors(null);
        // }
      }
    }
  }

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
    debugger;
    this.getProveedoresList();
  }

  getProveedoresList(): void {
    this.proveedorService.getProvidersList().subscribe((result: any) => {
      this.proveedoresList = result;
      this.dataSource = new MatTableDataSource(this.proveedoresList);
    });
  }
}
