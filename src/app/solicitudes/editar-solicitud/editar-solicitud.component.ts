import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DateValidator } from 'app/date-validator';
import { SolicitudData } from 'app/interfaces/solicitud.interface';
import { SolicitudService } from 'app/services/solicitud.service';
import { UsuarioService } from 'app/services/usuario.service';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-editar-solicitud',
  templateUrl: './editar-solicitud.component.html',
  styleUrls: ['./editar-solicitud.component.scss']
})
export class EditarSolicitudComponent {
  selectedProject: any;

  filteredOptions: Observable<string[]> = new Observable<string[]>(); // Inicialización

  editarSolicitudForm: FormGroup;
  submitted = false;
  isWorking = false;
  usuariosList: any[] = []; // Asegúrate de que usuariosList contenga tus datos
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  solicitud?: SolicitudData;
  solicitudesList: any[] = []; // Aquí almacenarás la lista de clientes
  filteredSolicitudesList$: Observable<any[]> | undefined;

  dateNotInPast(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    // Restar 3 días a la fecha actual
    currentDate.setDate(currentDate.getDate() - 2);

    if (selectedDate < currentDate) {
      return { dateInPast: true };
    }

    return null;
  }
  selectedUser: any;
  selectedEmployee: any;

  transformData2() {
    this.data.assignedUser = this.selectedUser.userId;
    this.editarSolicitudForm.controls["userId"].setValue(this.selectedUser.userId);
  }
  setUserValue(user : any) {
    
    this.selectedUser = user;
    console.log(user)
    this.data.assignedUser = user?.name; // Usar el operador de opción ? para manejar valores nulos
    this.editarSolicitudForm.controls["userId"].setValue(user?.userId); // Usar el operador de opción ?
  
  }


  onEmployeeSelectionChange(selectedEmployee: any): void {
    this.selectedEmployee = selectedEmployee;

    // Asegúrate de establecer el valor correcto en el formulario
    this.editarSolicitudForm.get('userId')?.setValue(selectedEmployee);

    // También puedes hacer otras acciones necesarias aquí
  }
  
  constructor(
    public dialogRef: MatDialogRef<EditarSolicitudComponent>,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) 
  
  {

    this.editarSolicitudForm = new FormGroup(
      {

        startDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
        endDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
        description: new FormControl(null, [Validators.required]),
        userId: new FormControl(null, [Validators.required]),
        statusId: new FormControl(null, [Validators.required]),
        managerReason: new FormControl(null),

      }
    );
  }

  userList: any[] = []; // Aquí almacenarás la lista de clientes
  // empleadosList: any[] = []; // Aquí almacenarás la lista de clientes

  filteredUserList$: Observable<any[]> | undefined;
  // filteredEmpleadosList$: Observable<any[]> | undefined;


  get f() {
    return this.editarSolicitudForm.controls;
  }

  crear() {
    this.submitted = true;
    

    if (this.editarSolicitudForm.invalid) {
      return;
    }

    this.isWorking = true;
    this.editarSolicitudForm.disable();

    setTimeout(() => {
      this.isWorking = false;
      this.editarSolicitudForm.enable();
    }, 1500);


  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    //Servicio de clientes para cargar la lista
    this.usuarioService.getUserList().subscribe((data) => {
      this.userList = data.filter(x => x.roleId == 2); 
      const initialClientId = this.editarSolicitudForm.get('userId')?.value;
      const initialClient = this.userList.find(user => user.userId === initialClientId);
      if (initialClient) {
        this.editarSolicitudForm.get('userId')?.setValue(initialClient.name);
        this.selectedUser = initialClient.userId; // Mantén el clientId separado
      }
      console.log(data)
      this.filteredUserList$ = this.editarSolicitudForm.get('userId')?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterUser(value))
      );
    });
    // this.crearProyectoForm.setControl('endDate', new FormControl(null, [Validators.required, DateValidator.dateFactory(new Date (this.crearProyectoForm.get('startDate')?.value))]));
    console.log(this.data);
  }

  //Filtro clientes
  private _filterUser(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.userList.filter(user => user.name.toLowerCase().includes(filterValue));
  }

  //Filtro empleados
  // private _filterEmpleados(value: string): any[] {
  //   const filterValue = value.toLowerCase();
  //   return this.empleadosList.filter(user => user.name.toLowerCase().includes(filterValue));
  // }

  cerrarModal() {
    this.selectedUser
    this.dialogRef.close();
  }

    
  }
