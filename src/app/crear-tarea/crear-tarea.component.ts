import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateValidator } from 'app/date-validator';
import { TareaData } from 'app/interfaces/tarea.interface';
import { ClienteService } from 'app/services/cliente.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { UsuarioService } from 'app/services/usuario.service';
import { ProyectoService } from 'app/services/proyecto.service';


@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.component.html',
  styleUrls: ['./crear-tarea.component.scss'],
})
export class CrearTareaComponent {
  // public crearUForm: FormGroup;

  crearTareaForm: FormGroup;
  filteredOptions: Observable<string[]> = new Observable<string[]>(); // Inicialización
  submitted = false;
  isWorking = false;

  // Función de validación personalizada
  dateNotInPast(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
  
    // Restar 3 días a la fecha actual
    currentDate.setDate(currentDate.getDate() - 2);
  
    debugger;
    if (selectedDate < currentDate) {
      return { 'dateInPast': true };
    }
  
    return null;
  }

  tarea?: TareaData;

  constructor(
    public dialogRef: MatDialogRef<CrearTareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private proyectoService: ProyectoService, private usuarioService: UsuarioService) {
    // this.crearUForm = this.crearUsuarioForm();

    this.crearTareaForm = new FormGroup(
      {
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      statusId : new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      priorityId : new FormControl(null, [Validators.required]),
      projectId : new FormControl(null, [Validators.required]),
      employeeId : new FormControl(null, [Validators.required]),
    }
      )
  }

  proyectosList: any[] = []; // Aquí almacenarás la lista de clientes
  empleadosList: any[] = []; // Aquí almacenarás la lista de clientes

  filteredProyectosList$: Observable<any[]> | undefined;
  filteredEmpleadosList$: Observable<any[]> | undefined;

  get f() {
    return this.crearTareaForm.controls;
  }

  crear() {
    this.submitted = true;

    if (this.crearTareaForm.invalid) {
      return;
    }

    this.isWorking = true;
    this.crearTareaForm.disable();

    setTimeout(() => {
      this.isWorking = false;
      this.crearTareaForm.enable();
    }, 1500);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    //Servicio de clientes para cargar la lista
    this.proyectoService.getProyectList().subscribe((data) => {
      this.proyectosList = data;
      this.filteredProyectosList$ = this.crearTareaForm.get('projectId')?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterProyectos(value))
      );
    });

    //Servicio de empleados para cargar la lista
     this.usuarioService.getUserList().subscribe((data) => {
       this.empleadosList = data;
       this.filteredEmpleadosList$ = this.crearTareaForm.get('employeeId')?.valueChanges.pipe(
         startWith(''),
         debounceTime(300),
         map(value => this._filterEmpleados(value))
       );
     });

    console.log(this.data);
  }
  
  
  //Filtro clientes
  private _filterProyectos(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.proyectosList.filter(proyecto => proyecto.name.toLowerCase().includes(filterValue));
  }

  //Filtro empleados
  private _filterEmpleados(value: string): any[] {
     const filterValue = value.toLowerCase();
    return this.empleadosList.filter(user => user.name.toLowerCase().includes(filterValue));
   }


}

