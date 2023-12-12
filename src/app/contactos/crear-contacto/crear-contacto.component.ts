import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactosData } from 'app/interfaces/contacto.interface';
import { ProveedorService } from '../../services/proveedor.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ContactoService } from '../../services/contacto.service';

@Component({
  selector: 'app-crear-contacto',
  templateUrl: './crear-contacto.component.html',
  styleUrls: ['./crear-contacto.component.scss']
})
export class CrearContactoComponent implements OnInit {

  proveedorList: any[] = [];
  phoneError: string = '';
  emailError: string = '';
  crearContacto: FormGroup;
  submitted = false;
  isWorking = false;



  constructor(
    public dialogRef: MatDialogRef<CrearContactoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactosData,
    private proveedorService: ProveedorService,
    private contactoService: ContactoService,
    private fb: FormBuilder
  ) {

    // this.crearContacto = new FormGroup(
    //   {
    //   name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    //   lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    //   secondLastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    //   email: ['', [Validators.required, Validators.email]],
    //   phone: new FormControl(null, [
    //     Validators.required,
    //     Validators.maxLength(8),
    //     Validators.minLength(8),
    //     Validators.pattern(/^\d{8}$/),
    //   ]),
    //   providerId: ['', [Validators.required]],
    //   details: ['', [Validators.required, Validators.minLength(10)]],
    // });

    this.crearContacto = new FormGroup(
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

    // Agrega una función de validación personalizada
    emailValidator(control: AbstractControl): ValidationErrors | null {
      const email = control.value as string;
      if (email && email.indexOf('@') === -1) {
        return { invalidEmail: true };
      }
      return null;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  cerrarModal() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getProviderList();
    // this.crearContacto.get('email')?.valueChanges.subscribe(value => {
    //   this.validate({ email: value, phone: this.crearContacto.get('phone')?.value });
    // });
    // this.crearContacto.get('phone')?.valueChanges.subscribe(value => {
    //   this.validate({ email: this.crearContacto.get('email')?.value, phone: value });
    // });
  }

  onInput(controlName: string): void {
    const control = this.contactoForm.get(controlName);
    if (control) {
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  getProviderList(): void {
    this.proveedorService.getProvidersList().subscribe((result: any) => {
      this.proveedorList = result;
    });
  }

  onSave(): void {
    if (this.crearContacto.valid) {
      this.dialogRef.close(this.crearContacto.value);
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
    )
  }


  get f() {
    return this.crearContacto.controls;
  }



  checkPhoneLenght(phone: any) {
    console.log(phone);
  }

}
