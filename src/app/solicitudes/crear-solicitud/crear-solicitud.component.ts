import { Component, Inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DateValidator } from 'app/date-validator';
import { SolicitudData } from 'app/interfaces/solicitud.interface';
import { SolicitudService } from 'app/services/solicitud.service';
import { UsuarioService } from 'app/services/usuario.service';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.scss'],
})
export class CrearSolicitudComponent {
  selectedProject: any;

  filteredOptions: Observable<string[]> = new Observable<string[]>(); // Inicialización

  crearSolicitudForm: FormGroup;
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

  transformData2() {
    this.data.assignedUser = this.selectedUser.userId;
    this.crearSolicitudForm.controls['userId'].setValue(this.selectedUser.userId);
  }
  setUserValue(user: any) {
    this.selectedUser = user;
    this.data.assignedUser = user.name;
    this.crearSolicitudForm.controls['userId'].setValue(user.userId);
  }

  constructor(
    public dialogRef: MatDialogRef<CrearSolicitudComponent>,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.crearSolicitudForm = new FormGroup({
      startDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      endDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      description: new FormControl(null, [Validators.required]),
      userId: new FormControl(null, [Validators.required]),
      statusId: new FormControl(null, [Validators.required]),
      managerReason: new FormControl(null),
    });
  }

  userList: any[] = []; // Aquí almacenarás la lista de clientes
  // empleadosList: any[] = []; // Aquí almacenarás la lista de clientes

  filteredUserList$: Observable<any[]> | undefined;
  // filteredEmpleadosList$: Observable<any[]> | undefined;

  get f() {
    return this.crearSolicitudForm.controls;
  }

  crear() {
    this.submitted = true;

    if (this.crearSolicitudForm.invalid) {
      return;
    }

    this.isWorking = true;
    this.crearSolicitudForm.disable();

    setTimeout(() => {
      this.isWorking = false;
      this.crearSolicitudForm.enable();
    }, 1500);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    //Servicio de clientes para cargar la lista
    this.usuarioService.getUserList().subscribe(data => {
      this.userList = data.filter(x => x.roleId == 2);

      this.filteredUserList$ = this.crearSolicitudForm.get('userId')?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterUser(value))
      );
    });
    // this.crearProyectoForm.setControl('endDate', new FormControl(null, [Validators.required, DateValidator.dateFactory(new Date (this.crearProyectoForm.get('startDate')?.value))]));
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
    this.dialogRef.close();
  }
}