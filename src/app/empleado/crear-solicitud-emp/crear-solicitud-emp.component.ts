import { Component, Inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService, User } from '@core';
import { DateValidator } from 'app/date-validator';
import { SolicitudData } from 'app/interfaces/solicitud.interface';
import { SolicitudService } from 'app/services/solicitud.service';
import { UsuarioService } from 'app/services/usuario.service';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-crear-solicitud-emp',
  templateUrl: './crear-solicitud-emp.component.html',
  styleUrls: ['./crear-solicitud-emp.component.scss']
})
export class CrearSolicitudEmpComponent {

  user?: User;

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
    public dialogRef: MatDialogRef<CrearSolicitudEmpComponent>,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.getUser();
    const userId = this.user?.id;
    this.crearSolicitudForm = new FormGroup({
      startDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      endDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      description: new FormControl(null, [Validators.required]),
      userId: new FormControl (userId, [Validators.required]),
      statusId: new FormControl(null, [Validators.required]),
      managerReason: new FormControl(null),
    });
  }

  getUser(): void {
    const subscription = this.authService.user().subscribe(user => {
      this.user = user;
    });
  }

  userList: any[] = []; // Aquí almacenarás la lista de clientes

  filteredUserList$: Observable<any[]> | undefined;

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
    // this.usuarioService.getUserList().subscribe(data => {
    //   this.userList = data.filter(x => x.roleId == 1);

    //   this.filteredUserList$ = this.crearSolicitudForm.get('userId')?.valueChanges.pipe(
    //     startWith(''),
    //     debounceTime(300),
    //     map(value => this._filterUser(value))
    //   );
    // });
    // this.crearProyectoForm.setControl('endDate', new FormControl(null, [Validators.required, DateValidator.dateFactory(new Date (this.crearProyectoForm.get('startDate')?.value))]));
  }

  private _filterUser(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.userList.filter(user => user.name.toLowerCase().includes(filterValue));
  }

  cerrarModal() {
    this.dialogRef.close();
  }

}
