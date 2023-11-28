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

  // Función de validación personalizada
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
    private clienteService: ClienteService
  ) {
    // this.crearUForm = this.crearUsuarioForm();

    this.editarProyectoForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      endDate: new FormControl(null, [Validators.required, DateValidator.dateNotInPast]),
      statusId: new FormControl(null, [Validators.required]),
      clientId: new FormControl(null),
    });
  }

  clientesList: any[] = []; // Aquí almacenarás la lista de clientes
  filteredClientesList$: Observable<any[]> | undefined;

  get f() {
    return this.editarProyectoForm.controls;
  }

  crear() {
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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.clienteService.getClientList().subscribe(data => {
      this.clientesList = data;
      this.filteredClientesList$ = this.editarProyectoForm.get('clientId')?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filterClientes(value))
      );
    });
    // console.log(this.data);
  }

  private _filterClientes(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.clientesList.filter(cliente => cliente.name.toLowerCase().includes(filterValue));
  }

  handleFileUploadUrl($event: string) {
    console.log($event);
    this.data.imageURL = $event;
  }
}
