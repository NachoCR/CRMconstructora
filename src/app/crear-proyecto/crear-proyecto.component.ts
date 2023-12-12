import { Component, Inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateValidator } from 'app/date-validator';
import { ProyectoData } from 'app/interfaces/proyecto.interface';
import { ClienteService } from 'app/services/cliente.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { UsuarioService } from 'app/services/usuario.service';
import * as moment from 'moment';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';

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
  @ViewChild('FileUpload')
  private FileUpload?: FileUploadComponent;

  // Función de validación personalizada
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
    this.crearProyectoForm.controls['userId'].setValue(this.selectedUser.userId);
  }
  setUserValue(user: any) {
    this.selectedUser = user;
    this.data.assignedUser = user.name;
    this.crearProyectoForm.controls['userId'].setValue(user.userId);
  }

  proyecto?: ProyectoData;

  constructor(
    public dialogRef: MatDialogRef<CrearProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    // this.crearUForm = this.crearUsuarioForm();

    this.crearProyectoForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      endDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      statusId: new FormControl(null, [Validators.required]),
      userId: new FormControl(null),
    });
  }

  userList: any[] = []; // Aquí almacenarás la lista de clientes
  // empleadosList: any[] = []; // Aquí almacenarás la lista de clientes

  filteredUserList$: Observable<any[]> | undefined;
  // filteredEmpleadosList$: Observable<any[]> | undefined;

  get f() {
    return this.crearProyectoForm.controls;
  }
  async saveImageUrl() {
    try {
      const result = await this.FileUpload?.uploadFile();
      if (result) {
        this.handleFileUploadUrl(result);
        return result;
      } else {
        throw new Error('La URL de la imagen es undefined.');
      }
    } catch (error) {
      console.error('Error al cargar la URL:', error);
      throw error;
    }
  }

  async crear() {
    try {
      const url = await this.saveImageUrl();
      setTimeout(() => {
        this.isWorking = false;
        this.crearProyectoForm.enable();
      }, 2000);
      this.handleFileUploadUrl(url);

      this.submitted = true;

      if (this.crearProyectoForm.invalid) {
        return;
      }

      // Resto de tu lógica aquí

      this.isWorking = true;
      this.crearProyectoForm.disable();

      setTimeout(() => {
        this.isWorking = false;
        this.crearProyectoForm.enable();
      }, 1500);
    } catch (error) {
      console.error('Error al crear:', error);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.usuarioService.getUserList().subscribe(data => {
      this.userList = data.filter(x => x.roleId == 2);
      this.filteredUserList$ = this.crearProyectoForm.get('userId')?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterUser(value))
      );
    });
  }

  private _filterUser(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.userList.filter(user => user.name.toLowerCase().includes(filterValue));
  }

  handleFileUploadUrl(url: string) {
    this.data.imageURL = url;
    if (this.proyecto) this.proyecto.imageURL = url;
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}
