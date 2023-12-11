import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catalogoProveedorData } from 'app/interfaces/catalogoProveedor.interface';
import { ProductoService } from 'app/services/producto.service';
import { ProveedorService } from 'app/services/proveedor.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss']
})
export class CrearProductoComponent {

  proveedorList: any[] = [];
  unitList: any[] = [];

  validadorNoCeroNiNegativo(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valor = control.value;
      if (valor !== null && (isNaN(valor) || valor <= 0)) {
        return { 'noCeroNiNegativo': true };
      }
      return null;
    };
  }

  productoForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    details: ['', [Validators.required, Validators.minLength(5)]],
    price: [1, [Validators.required, this.validadorNoCeroNiNegativo()]],
    providerId: ['', [Validators.required]],
    unitId: ['', [Validators.required]],
    quantity: [0, [Validators.required]],
  });

  constructor(
    public dialogRef: MatDialogRef<CrearProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: catalogoProveedorData,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getProviderList();
    this.getUnitList();
  }

  onInput(controlName: string): void {
    const control = this.productoForm.get(controlName);
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

  getUnitList(): void {
    this.productoService.getUnidadList().subscribe((result: any) => {
      this.unitList = result;
      console.table(this.unitList)
    });
  }

  onSave(): void {
    if (this.productoForm.valid) {
      this.dialogRef.close(this.productoForm.value);
    }
  }

}
