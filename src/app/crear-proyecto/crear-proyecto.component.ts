  import { Component, Inject } from '@angular/core';
  import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
  import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
  import { DateValidator } from 'app/date-validator';
  import { ProyectoData } from 'app/interfaces/proyecto.interface';
  import { ClienteService } from 'app/services/cliente.service';
  import { MatSelectModule } from '@angular/material/select';
  import { MatInputModule } from '@angular/material/input';
  import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { UsuarioService } from 'app/services/usuario.service';





  @Component({
    selector: 'app-crear-proyecto',
    templateUrl: './crear-proyecto.component.html',
    styleUrls: ['./crear-proyecto.component.scss'],
  })
  export class CrearProyectoComponent {
    // public crearUForm: FormGroup;

    crearProyectoForm: FormGroup;
    filteredOptions: Observable<string[]> = new Observable<string[]>(); // Inicialización
    submitted = false;
    isWorking = false;

    // Función de validación personalizada
    dateNotInPast(control: AbstractControl): { [key: string]: boolean } | null {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
    
      // Restar 3 días a la fecha actual
      currentDate.setDate(currentDate.getDate() - 2);
    
      
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
    // empleadosList: any[] = []; // Aquí almacenarás la lista de clientes

    filteredClientesList$: Observable<any[]> | undefined;
    // filteredEmpleadosList$: Observable<any[]> | undefined;

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

      //Servicio de clientes para cargar la lista
      this.clienteService.getClientList().subscribe((data) => {
        
        this.clientesList = data;
        this.filteredClientesList$ = this.crearProyectoForm.get('clientId')?.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map(value => this._filterClientes(value))
        );
      });

      //Servicio de empleados para cargar la lista
      // this.usuarioService.getUserList().subscribe((data) => {
      //   this.empleadosList = data;
      //   this.filteredEmpleadosList$ = this.crearProyectoForm.get('employeeId')?.valueChanges.pipe(
      //     startWith(''),
      //     debounceTime(300),
      //     map(value => this._filterEmpleados(value))
      //   );
      // });

      console.log(this.data);
    }
    
    
    //Filtro clientes
    private _filterClientes(value: string): any[] {
      const filterValue = value.toLowerCase();
      
      return this.clientesList.filter(cliente => cliente.name.toLowerCase().includes(filterValue));
    }

    //Filtro empleados
    // private _filterEmpleados(value: string): any[] {
    //   const filterValue = value.toLowerCase();
    //   return this.empleadosList.filter(user => user.name.toLowerCase().includes(filterValue));
    // }


  }

