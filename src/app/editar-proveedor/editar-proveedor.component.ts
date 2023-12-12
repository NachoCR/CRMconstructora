import { Component, Inject, ViewChild } from '@angular/core';
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
import { delay, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';

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
  tipoOriginal: any;
  identifierId: any;
  identifier: any;
  forceReload: boolean = false;
  identifierType: string = '';
  identifierLength?: number;

  @ViewChild('FileUpload')
  private FileUpload?: FileUploadComponent;

  constructor(
    public dialogRef: MatDialogRef<EditarProveedorComponent>,
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    // this.crearUForm = this.crearUsuarioForm();

    this.cedulaOriginal = data.identifier;
    this.tipoOriginal = data.identifierId;
    this.correoOriginal = data.email;

    this.editarProveedorForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required]),
      identifierId: new FormControl(null, [Validators.required]),
      identifier: new FormControl(null, []),

      phone: new FormControl(null, [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern(/^\d{8}$/),
      ]),
      address: new FormControl(null, [Validators.required]),
      details: new FormControl(null, [Validators.required]),
    });
    this.editarProveedorForm.get('identifierId')?.valueChanges.subscribe(value => {
      this.actualizarValidaciones(value);
    });
  }

  private actualizarValidaciones(identifierId: number) {
    if (identifierId == 1) {
      this.setIdentifierValues('Cédula', 9, 9);
    } else if (identifierId == 2) {
      this.setIdentifierValues('Pasaporte', 9, 9);
    } else if (identifierId == 3) {
      this.setIdentifierValues('Cédula Jurídica', 11, 11);
    }
  }

  setIdentifierValues(
    identifierType: string,
    identifierMinLength: number,
    identifierMaxLength: number
  ) {
    const identifierControl = this.editarProveedorForm.get('identifier');
    identifierControl?.setValidators([]);
    let pattern: any;

    if (identifierMaxLength == 9) {
      pattern = /^\d{9}$/;
    }
    if (identifierMaxLength == 11) {
      pattern = /^\d{11}$/;
    }

    identifierControl?.setValidators([
      Validators.required,
      Validators.pattern(pattern),
      Validators.minLength(identifierMinLength),
      Validators.maxLength(identifierMaxLength),
    ]);
    this.identifierType = identifierType;
    this.identifierLength = identifierMaxLength;

    identifierControl?.updateValueAndValidity();
  }

  test(value: any) {
    const identifierControl = this.editarProveedorForm.get('identification');
    identifierControl?.setValue(value);
  }

  checkIdentifierExists() {
    const identifierControl = this.editarProveedorForm.get('identifier');

    if (identifierControl && this.proveedoresList.length > 0) {
      const identification = identifierControl.value;

      const identifierExists = this.proveedoresList.some(
        proveedor => proveedor.identifier === identification
      );

      if (this.cedulaOriginal != identifierControl) {
        if (identifierExists) {
          identifierControl.setErrors({ identifierExists: true });
        } else {
          identifierControl.setErrors(null);
          identifierControl.updateValueAndValidity();
        }
      }
    }
  }

  private onIdentifierIdChange() {
    const identifierId = this.editarProveedorForm.get('identifierId')?.value;
    this.actualizarValidaciones(identifierId);
  }

  checkEmailExists() {
    const emailControl = this.editarProveedorForm.get('email');

    if (emailControl && this.proveedoresList.length > 0) {
      const email = emailControl.value;

      const emailExists = this.proveedoresList.some(proveedor => proveedor.email === email);

      if (this.correoOriginal != email) {
        if (emailExists) {
          emailControl.setErrors({ emailExists: true });
        } else {
          emailControl.setErrors(null);
          emailControl.updateValueAndValidity();
        }
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
  onEmailBlur() {
    this.checkEmailExists();
    // this.crearUForm.get('email')?.updateValueAndValidity(); // Actualiza la validación de Angular
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
      this.handleFileUploadUrl(url);
      setTimeout(() => {}, 2000);
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

  ngOnInit() {
    this.getProveedoresList();
  }

  getProveedoresList(): void {
    this.proveedorService.getProvidersList().subscribe((result: any) => {
      this.proveedoresList = result;
      this.dataSource = new MatTableDataSource(this.proveedoresList);
      this.identifierId = result.identifierId.value;
    });
  }

  forceIdentifierValidation(): void {
    const identifierControl = this.editarProveedorForm.get('identifier');
    if (identifierControl) {
      identifierControl.markAsTouched();
      identifierControl.updateValueAndValidity();
    }
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}
