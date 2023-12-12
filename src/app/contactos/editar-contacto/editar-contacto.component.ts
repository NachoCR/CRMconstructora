import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactosData } from 'app/interfaces/contacto.interface';
import { ProveedorService } from 'app/services/proveedor.service';
import { ContactoService } from 'app/services/contacto.service';

@Component({
  selector: 'app-editar-contacto',
  templateUrl: './editar-contacto.component.html',
  styleUrls: ['./editar-contacto.component.scss']
})
export class EditarContactoComponent implements OnInit  {

  proveedorList: any[] = [];

  phoneError: string = '';
  emailError: string = '';

  contactoForm = this.fb.group({
    contactId: this.data.contactId,
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    secondLastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.maxLength(8), this.phoneNumberValidator()]],
    providerId: ['', [Validators.required]],
    details: ['', [Validators.required, Validators.minLength(10)]]
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

  onInput(controlName: string): void {
    const control = this.contactoForm.get(controlName);
    if (control) {
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  ngOnInit(): void {
    this.getProviderList();
    this.contactoForm.patchValue({
      contactId: this.data.contactId,
      name: this.data.name,
      lastname: this.data.lastname,
      secondLastname: this.data.secondLastname,
      email: this.data.email,
      phone: this.data.phone,
      providerId: this.data.providerId ? this.data.providerId.toString() : null,
      details: this.data.details
    });
    this.contactoForm.get('email')?.valueChanges.subscribe((value) => {
      this.validate({ id: this.data.contactId, email: value, phone: this.contactoForm.get('phone')?.value?.toString() });
    });
    this.contactoForm.get('phone')?.valueChanges.subscribe((value) => {
      this.validate({ id: this.data.contactId, email: this.contactoForm.get('email')?.value, phone: value?.toString() });
    });
  }

  getProviderList(): void {
    this.proveedorService.getProvidersList().subscribe((result: any) => {
      this.proveedorList = result;
    });
  }

  onSave(): void {
    const phoneValue = this.contactoForm.get('phone')?.value?.toString();
    if (this.contactoForm.valid) {
      const updatedContact = { ...this.contactoForm.value, phone: phoneValue };
      this.dialogRef.close(updatedContact);
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

  private phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumber = control.value;
      const phoneNumberPattern = /^\d{8}$/;
      if (!phoneNumberPattern.test(phoneNumber)) {
        return { invalidPhoneNumber: true };
      }
      return null;
    };
  }

}
