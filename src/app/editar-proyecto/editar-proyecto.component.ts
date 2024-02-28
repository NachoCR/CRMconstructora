import { Component, Inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateValidator } from 'app/date-validator';
import { ProyectoData } from 'app/interfaces/proyecto.interface';
import { UsuarioService } from 'app/services/usuario.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { UsuarioData } from 'app/interfaces/usuario.interface';

@Component({
  selector: 'app-editar-proyecto',
  templateUrl: './editar-proyecto.component.html',
  styleUrls: ['./editar-proyecto.component.scss'],
})
export class EditarProyectoComponent {
  public get data(): any {
    return this._data;
  }
  public set data(value: any) {
    this._data = value;
  }

  editarProyectoForm: FormGroup;
  submitted = false;
  isWorking = false;
  userList: any[] = [];
  filteredUserList$: Observable<any[]> | undefined;

  @ViewChild('FileUpload')
  private FileUpload?: FileUploadComponent;

  dateNotInPast(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      return { dateInPast: true };
    }

    return null;
  }

  proyecto?: ProyectoData;

  constructor(
    public dialogRef: MatDialogRef<EditarProyectoComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _data: any,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    // this.crearUForm = this.crearUsuarioForm();

    this.editarProyectoForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null),
      endDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      statusId: new FormControl(null, [Validators.required]),
      clientId: new FormControl(null),
    });
  }
  selectedUser: any;
  selectedClient: any;
  selectedClientName: any;

 
  setUserValue(user: any) {
    this.selectedUser = user;
    this.data.assignedUser = user.name;
    this.data.clientId = user.userId;
    this.data.client.userId = user.userId;
    this.editarProyectoForm.controls['clientId'].setValue(user);
  }

  onClientSelectionChange(selectedClient: any): void {
    this.selectedClient = selectedClient;
    this.editarProyectoForm.get('clientId')?.setValue(selectedClient);
  }

  setEndDate(date: any){
    this.data.endDate = this.editarProyectoForm.controls["endDate"].value;
  }


  get f() {
    return this.editarProyectoForm.controls;
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
        this.editarProyectoForm.enable();
      }, 2000);
      this.handleFileUploadUrl(url);

      this.submitted = true;

      if (this.editarProyectoForm.invalid) {
        return;
      }

      this.isWorking = true;
      this.editarProyectoForm.disable();

      setTimeout(() => {
        this.isWorking = false;
        this.editarProyectoForm.enable();
      }, 1500);
    } catch (error) {
      console.error('Error al Editar:', error);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.usuarioService.getUserList().subscribe(data => {
      this.userList = data.filter(x => x.roleId == 2);

      const initialClientId = this.data.client.userId;
      const initialClient = this.data.client;
      if (initialClient) {
        this.editarProyectoForm.get('clientId')?.setValue(initialClient.name);
        this.selectedUser = initialClient.userId;
        console.log(initialClient);
        console.log(this.data);
      }

      this.filteredUserList$ = this.editarProyectoForm.get('clientId')?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterClientes(value))
      );
    });
  }

  private _filterClientes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.userList.filter(user => user.name.toLowerCase().includes(filterValue));
  }

  handleFileUploadUrl($event: string) {
    this.data.imageURL = $event;
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}
