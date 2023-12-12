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
  selector: 'app-editar-tarea',
  templateUrl: './editar-tarea.component.html',
  styleUrls: ['./editar-tarea.component.scss'],
})
export class EditarTareaComponent {


  selectedProject: any;

  transformData() {
    this.data.assignedProject = this.selectedProject.projectId;
    this.editarTareaForm.controls["projectId"].setValue(this.selectedProject.projectId);
  }
  setProjectValue(proyecto : any) {
    this.selectedProject = proyecto;
    this.data.assignedProject = proyecto.name;
    this.editarTareaForm.controls["projectId"].setValue(proyecto.name);
  }

  selectedUser: any;
  
  transformData2() {
    this.data.assignedUser = this.selectedUser.userId;
    this.editarTareaForm.controls["userId"].setValue(this.selectedUser.userId);
  }
  setUserValue(employee : any) {
    this.selectedUser = employee;
    this.data.assignedUser = employee.name;
    this.editarTareaForm.controls["userId"].setValue(employee.name);
  }

  // public editarUForm: FormGroup;

  editarTareaForm: FormGroup;
  filteredOptions: Observable<string[]> = new Observable<string[]>(); // Inicialización
  submitted = false;
  isWorking = false;

  // Función de validación personalizada
  dateNotInPast(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
  
    // Restar 3 días a la fecha actual
    currentDate.setDate(currentDate.getDate() - 2);
  
    ;
    if (selectedDate < currentDate) {
      return { 'dateInPast': true };
    }
  
    return null;
  }

  tarea?: TareaData;

  constructor(
    public dialogRef: MatDialogRef<EditarTareaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, 
    private proyectoService: ProyectoService, 
    private usuarioService: UsuarioService) {
    // this.editarUForm = this.editarUsuarioForm();

    this.editarTareaForm = new FormGroup(
      {
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      statusId : new FormControl(null, [Validators.required]),
      dateDue: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      priorityId : new FormControl(null, [Validators.required]),
      projectId : new FormControl(null, [Validators.required]),
      userId : new FormControl(null, [Validators.required]),
    }
      )
  }

  proyectosList: any[] = []; // Aquí almacenarás la lista de proyectos
  usuariosList: any[] = []; // Aquí almacenarás la lista de usuarios

  filteredProyectosList$: Observable<any[]> | undefined;
  filteredUserList$: Observable<any[]> | undefined;

  get f() {
    return this.editarTareaForm.controls;
  }

  editar() {
    this.submitted = true;

    if (this.editarTareaForm.invalid) {
      return;
    }

    this.isWorking = true;
    this.editarTareaForm.disable();

    setTimeout(() => {
      this.isWorking = false;
      this.editarTareaForm.enable();
    }, 1500);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    //Servicio de clientes para cargar la lista
    this.proyectoService.getProyectList().subscribe((data) => {
      this.proyectosList = data;
      this.filteredProyectosList$ = this.editarTareaForm.get('projectId')?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterProyectos(value))
      );
    });

    //Servicio de empleados para cargar la lista
     this.usuarioService.getUserList().subscribe((data) => {
       this.usuariosList = data;
       console.log(data)
       this.usuariosList = this.usuariosList.filter(x => x.roleId == 2); 
       this.filteredUserList$ = this.editarTareaForm.get('userId')?.valueChanges.pipe(
         startWith(''),
         debounceTime(300),
         map(value => this._filterUser(value))
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
  private _filterUser(value: string): any[] {
     const filterValue = value.toLowerCase();
    return this.usuariosList.filter(user => user.name.toLowerCase().includes(filterValue));
   }
   cerrarModal() {
    this.dialogRef.close();
  }


}
