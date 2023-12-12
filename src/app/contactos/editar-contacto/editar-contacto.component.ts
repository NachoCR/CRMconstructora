import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactosData } from 'app/interfaces/contacto.interface';
import { ProveedorService } from 'app/services/proveedor.service';
import { ContactoService } from 'app/services/contacto.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-editar-contacto',
  templateUrl: './editar-contacto.component.html',
  styleUrls: ['./editar-contacto.component.scss']
})
export class EditarContactoComponent implements OnInit  {

  proveedorList: any[] = [];
  contactoList: any[] = [];
  phoneError: string = '';
  emailError: string = '';
  editarContacto: FormGroup;
  submitted = false;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  correoOriginal: any;



  constructor(
    public dialogRef: MatDialogRef<EditarContactoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactosData,
    private proveedorService: ProveedorService,
    private contactoService: ContactoService,
    private fb: FormBuilder
  ) {
    this.editarContacto = new FormGroup(
      {
        name: new FormControl(null, [Validators.required]),
        lastname: new FormControl(null, [Validators.required]),
        secondLastname: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [
          Validators.required,
          Validators.email,
          this.emailValidator,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
        ]),
        
        phone: new FormControl(null, [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(8),
          Validators.pattern(/^\d{8}$/),
        ]),
        providerId: new FormControl(null, [Validators.required]),
        details: new FormControl(null, [Validators.required, Validators.minLength(10)])
      },

    );



  }
  
  emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value as string;
    if (email && email.indexOf('@') === -1) {
      return { invalidEmail: true };
    }
    return null;
  }

  onEmailBlur() {
    this.checkEmailExists();
    // this.crearUForm.get('email')?.updateValueAndValidity(); // Actualiza la validación de Angular
  }

  checkEmailExists() {
    debugger
    const emailControl = this.editarContacto.get('email');
    
    if (emailControl && this.contactoList.length > 0) {
      const email = emailControl.value;

      const emailExists = this.contactoList.some(contacto => contacto.email === email);

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

  onNoClick(): void {
    this.dialogRef.close();
  }
  cerrarModal() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.getProviderList();
    this.getContactosList();

  }

  getProviderList(): void {
    this.proveedorService.getProvidersList().subscribe((result: any) => {
      this.proveedorList = result;
    });
  }

  getContactosList(): void {
    this.contactoService.getContactoList().subscribe((result: any) => {
      this.contactoList = result;
      this.dataSource = new MatTableDataSource(this.contactoList);
      console.log(result)
    });
  }

  onSave(): void {
    if (this.editarContacto.valid) {
      var contacto = this.editarContacto.value;
      contacto.contactId = this.data.contactId;
      debugger
      this.dialogRef.close(contacto);
    }
  }

  validate(input: any): void {
    this.contactoService.validate(input).subscribe(
      (response) => {
        this.emailError = '';
        this.phoneError = '';
      },
      (error) => {
        this.emailError = '';
        this.phoneError = '';
        if (error.status === 400 && error.error && error.error.errors) {
          const errorResponse = error.error;
          for (const key in errorResponse.errors) {
            if (errorResponse.errors.hasOwnProperty(key)) {
              const errorMessage = errorResponse.errors[key].errors[0].errorMessage;
              if (key === 'Email') {
                this.emailError = errorMessage;
              } else if (key === 'Phone') {
                this.phoneError = errorMessage;
              }
            }
          }
        }
      }
    );
  }
  
 
  get f() {
    return this.editarContacto.controls;
  }



  checkPhoneLenght(phone: any) {
    console.log(phone);
  }

}
