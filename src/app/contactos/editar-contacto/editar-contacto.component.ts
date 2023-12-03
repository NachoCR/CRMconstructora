import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CrearContactoComponent } from '../crear-contacto/crear-contacto.component';
import { ContactosData } from 'app/interfaces/contacto.interface';
import { ProveedorService } from 'app/services/proveedor.service';
import { ContactoService } from 'app/services/contacto.service';

@Component({
  selector: 'app-editar-contacto',
  templateUrl: './editar-contacto.component.html',
  styleUrls: ['./editar-contacto.component.scss'],
})
export class EditarContactoComponent {
  proveedorList: any[] = [];

  phoneError: string = '';
  emailError: string = '';

  contactoForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    secondLastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    providerId: ['', [Validators.required]],
    details: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor(
    public dialogRef: MatDialogRef<EditarContactoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactosData,
    private proveedorService: ProveedorService,
    private contactoService: ContactoService,
    private fb: FormBuilder
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    //console.table(this.data);
    this.getProviderList();

    // this.contactoForm.get('email')?.valueChanges.subscribe((value) => {
    //   this.validate({ id: this.data.contactId, email: value, phone: this.contactoForm.get('phone')?.value });
    // });

    // this.contactoForm.get('phone')?.valueChanges.subscribe((value) => {
    //   this.validate({ id: this.data.contactId, email: this.contactoForm.get('email')?.value, phone: value});
    // });

    this.contactoForm.valueChanges.subscribe(value => {
      //console.log('Formulario cambiado:', value);
      this.validate({
        id: this.data.contactId,
        email: value.email,
        phone: value.phone,
      });
    });
  }

  getProviderList(): void {
    this.proveedorService.getProvidersList().subscribe((result: any) => {
      //console.log(result);
      this.proveedorList = result;
    });
  }

  onSave(): void {
    if (this.contactoForm.valid) {
      this.dialogRef.close(this.contactoForm.value);
    }
  }

  validate(input: any): void {
    this.contactoService.validate(input).subscribe(
      response => {
        this.emailError = '';
        this.phoneError = '';
      },
      error => {
        this.emailError = '';
        this.phoneError = '';

        if (error.status === 400 && error.error && error.error.errors) {
          const errorResponse = error.error;
          console.log(errorResponse);
          for (const key in errorResponse.errors) {
            if (errorResponse.errors.hasOwnProperty(key)) {
              console.table(key);
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
}
