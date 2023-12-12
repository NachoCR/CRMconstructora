import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
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
  forceReload: boolean = false;

  @ViewChild('FileUpload')
  private FileUpload?: FileUploadComponent;

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
        Validators.pattern(/^\d{9}$/),
        Validators.minLength(9),
        Validators.maxLength(9),
      ]),
      passport: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{9}$/),
        Validators.minLength(9),
        Validators.maxLength(9),
      ]),
      juridic: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{11}$/),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern(/^\d{8}$/),
      ]),
      address: new FormControl(null, [Validators.required]),
      details: new FormControl(null, [Validators.required]),
    });
    this.crearProveedorForm.get('identifierId')?.valueChanges.subscribe(value => {
      this.actualizarValidaciones(value);
    });
  }

  private actualizarValidaciones(identifierId: string) {
    const identifierControl = this.crearProveedorForm.get('identifier');
    const passportControl = this.crearProveedorForm.get('passport');
    const juridicControl = this.crearProveedorForm.get('juridic');

    identifierControl?.setValidators([]);
    passportControl?.setValidators([]);
    juridicControl?.setValidators([]);

    if (identifierId === '1') {
      identifierControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{9}$/),
        Validators.minLength(9),
        Validators.maxLength(9),
      ]);
    } else if (identifierId === '2') {
      passportControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{9}$/),
        Validators.minLength(9),
        Validators.maxLength(9),
      ]);
    } else if (identifierId === '3') {
      juridicControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{11}$/),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]);
    }

    identifierControl?.updateValueAndValidity();
    passportControl?.updateValueAndValidity();
    juridicControl?.updateValueAndValidity();
  }

  checkCedulaExists() {
    const cedulaControl = this.crearProveedorForm.get('identifier');

    if (cedulaControl && this.proveedoresList.length > 0) {
      const identification = cedulaControl.value;

      const cedulaExists = this.proveedoresList.some(
        proveedor => proveedor.identifier === identification
      );

      if (cedulaExists) {
        cedulaControl.setErrors({ cedulaExists: true });
      } else {
        cedulaControl.setErrors(null);
        cedulaControl.updateValueAndValidity();
      }
    }
  }

  checkPassportExists() {
    const passportControl = this.crearProveedorForm.get('passport');
    if (passportControl && this.proveedoresList.length > 0) {
      const passport = passportControl.value;

      const passportExists = this.proveedoresList.some(
        proveedor => proveedor.identifier === passport
      );

      if (passportExists) {
        passportControl.setErrors({ passportExists: true });
      } else {
        passportControl.setErrors(null);
        passportControl.updateValueAndValidity();
      }
    }
  }

  checkJuridicExists() {
    const juridicControl = this.crearProveedorForm.get('juridic');
    if (juridicControl && this.proveedoresList.length > 0) {
      const juridic = juridicControl.value;

      const juridicExists = this.proveedoresList.some(
        proveedor => proveedor.identifier === juridic
      );

      if (juridicExists) {
        juridicControl.setErrors({ juridicExists: true });
      } else {
        juridicControl.setErrors(null);
        juridicControl.updateValueAndValidity();
      }
    }
  }

  checkEmailExists() {
    const emailControl = this.crearProveedorForm.get('email');

    if (emailControl) {
      // Verificar que el control no sea nulo
      const email = emailControl.value;

      const emailExists = this.proveedoresList.some(proveedor => proveedor.email === email);

      if (emailExists) {
        emailControl.setErrors({ emailExists: true });
      } else {
        // Limpiar el error si el correo no existe (puedes ajustar esto según tus necesidades)
        emailControl.setErrors(null);
        emailControl.updateValueAndValidity();
      }
    }
  }

  onEmailBlur() {
    this.checkEmailExists();
    // this.crearUForm.get('email')?.updateValueAndValidity(); // Actualiza la validación de Angular
  }

  onJuridicaBlur() {
    this.checkJuridicExists();
    // this.crearUForm.get('juridic')?.updateValueAndValidity(); // Actualiza la validación de Angular
  }

  onCedulaBlur() {
    this.checkCedulaExists();
    // this.crearUForm.get('identification')?.updateValueAndValidity(); // Actualiza la validación de Angular
  }
  onPassportBlur() {
    this.checkCedulaExists();
    // this.crearUForm.get('passport')?.updateValueAndValidity(); // Actualiza la validación de Angular
  }

  get f() {
    return this.crearProveedorForm.controls;
  }

  async saveImageUrl() {
    try {
      const result = await this.FileUpload?.uploadFile();
      if (result) {
        this.handleFileUploadUrl(result);
        return result;
      } else {
        throw new Error('La URL de la imagen es undefined.');
      }
    } catch (error) {
      console.error('Error al cargar la URL:', error);
      throw error;
    }
  }

  async crear() {
    try {
      const url = await this.saveImageUrl();
      setTimeout(() => {
        this.isWorking = false;
        this.crearProveedorForm.enable();
      }, 2000);
      this.handleFileUploadUrl(url);

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
    } catch (error) {
      console.error('Error al crear:', error);
    }
  }

  handleFileUploadUrl(url: string) {
    this.data.imageURL = url;
    if (this.proveedor) this.proveedor.imageURL = url;
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

  cerrarModal() {
    this.dialogRef.close();
  }
}
