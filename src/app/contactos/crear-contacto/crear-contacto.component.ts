import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactosData } from 'app/interfaces/contacto.interface';
import { ProveedorService } from '../../services/proveedor.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactoService } from '../../services/contacto.service';

@Component({
  selector: 'app-crear-contacto',
  templateUrl: './crear-contacto.component.html',
  styleUrls: ['./crear-contacto.component.scss'],
})
export class CrearContactoComponent implements OnInit {
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
    public dialogRef: MatDialogRef<CrearContactoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContactosData,
    private proveedorService: ProveedorService,
    private contactoService: ContactoService,
    private fb: FormBuilder
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getProviderList();
    this.contactoForm.get('email')?.valueChanges.subscribe(value => {
      this.validate({ email: value, phone: this.contactoForm.get('phone')?.value });
    });
    this.contactoForm.get('phone')?.valueChanges.subscribe(value => {
      this.validate({ email: this.contactoForm.get('email')?.value, phone: value });
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
          for (const key in errorResponse.errors) {
            if (errorResponse.errors.hasOwnProperty(key)) {
              //console.table(key);
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
