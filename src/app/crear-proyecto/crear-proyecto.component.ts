import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateValidator } from 'app/date-validator';
import { ProyectoData } from 'app/interfaces/proyecto.interface';
import { ClienteService } from 'app/services/cliente.service';

@Component({
  selector: 'app-crear-proyecto',
  templateUrl: './crear-proyecto.component.html',
  styleUrls: ['./crear-proyecto.component.scss']
})
export class CrearProyectoComponent {
  // public crearUForm: FormGroup;

  crearProyectoForm: FormGroup;
  submitted = false;
  isWorking = false;

  // Función de validación personalizada
 dateNotInPast(control: AbstractControl): { [key: string]: boolean } | null {
  const selectedDate = new Date(control.value);
  const currentDate = new Date();

  if (selectedDate < currentDate) {
    return { 'dateInPast': true };
  }

  return null;
}

  proyecto?: ProyectoData;
  constructor(
    public dialogRef: MatDialogRef<CrearProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private clienteService: ClienteService) {
    // this.crearUForm = this.crearUsuarioForm();

    this.crearProyectoForm = new FormGroup(
      {
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      endDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      statusId : new FormControl(null, [Validators.required]),
      clientId : new FormControl(null),
    
    }
      )
  }

  clientesList: any[] = []; // Aquí almacenarás la lista de clientes

  get f() {
    return this.crearProyectoForm.controls;
  }

  
  

  crear() {
    this.submitted = true;

    if (this.crearProyectoForm.invalid) {
      return;
    }

    this.isWorking = true;
    this.crearProyectoForm.disable();

    setTimeout(() => {
      this.isWorking = false;
      this.crearProyectoForm.enable();
    }, 1500);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    debugger;
    this.clienteService.getClientList().subscribe((data) => {
      this.clientesList = data;
    });
    console.log(this.data)
  }

}

