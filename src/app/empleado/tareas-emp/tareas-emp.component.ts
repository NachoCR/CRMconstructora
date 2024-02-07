import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  Pipe,
  PipeTransform,
  ElementRef,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { CrearTareaComponent } from 'app/crear-tarea/crear-tarea.component';
import { EditarTareaComponent } from 'app/editar-tarea/editar-tarea.component';
import { TareaData } from 'app/interfaces/tarea.interface';
import { ProyectoData } from 'app/interfaces/proyecto.interface';
import { TareaService } from 'app/services/tarea.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { debug } from 'console';
import * as _ from 'lodash';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { AuthService, User } from '@core';

@Component({
  selector: 'app-tareas-emp',
  templateUrl: './tareas-emp.component.html',
  styleUrls: ['./tareas-emp.component.scss']
})
export class TareasEmpComponent {

  user?: User;

  tarea?: TareaData;

  items: any[] = []; // Ajusta el tipo según tus datos reales

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  tareasList: any[] = []; // Asegúrate de que tareasList contenga tus datos
  displayedColumns: string[] = [
    'name',
    'description',
    'dateDue',
    'statusId',
    'priorityId',
    'projectId',
    'userId',
    'actions',
  ];
  fechaInicioFilter: Date | null = null;
  proyectosFiltradosPorFechaInicio: any[] = [];
  pickerFechaInicioSeleccionada: boolean = false;

  searchTerm: string = '';
  filteredTasks: any[] = [];
  //Paginacion

  pageSizeOptions: number[] = [10, 20, 100];
  pageSize: number = 10;
  pageIndex: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator; // <-- Agrega el modificador !
  @ViewChild('TareasTable') tareasTable?: ElementRef;

  //
  fileName = 'tareas.xlsx';

  constructor(
    public dialog: MatDialog,
    private tareaService: TareaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.getUser();
  }

  getUser(): void {
    const subscription = this.authService.user().subscribe(user => {
      this.user = user;
    });
  }


  exportTable() {
    this.dataSource.data.map(x => {});

    let data = this.dataSource.data.map(x => ({
      'Nombre': x.name,
      'Descripción': x.description,
      'Fecha Inicial': x.startDate,
      'Fecha Final': x.dateDue,
      'Estado': x.status,
      'Usuario': x.userId,
      'Proyecto': x.projectId,
      'Prioridad': x.priorityId,
    }));
    let ws = XLSX.utils.json_to_sheet(data, <XLSX.Table2SheetOpts>{
      sheet: 'tareas',
    });
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'tareas');
    XLSX.writeFile(wb, 'tareas.xlsx');
  }

  ngOnInit(): void {
    this.aplicarPaginacion();
    this.getTaskList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(): void {
    this.filteredTasks = this.tareasList.filter(
      task =>
        task.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getTaskList(): void {
    const userId = this.user?.id;
    this.tareaService.getTaskList().subscribe((result: any) => {
      this.tareasList = result.filter(
        (tarea: any) => tarea.userId === userId
      );
      this.filteredTasks = this.tareasList;
      this.dataSource = new MatTableDataSource(this.tareasList);
      this.dataSource.paginator = this.paginator;
      this.aplicarPaginacion(); // Aplicar la paginación aquí
    });
  }

  completarTarea(task: any): void {
    const pTask = _.cloneDeep(task);
    Swal.fire({
        title: '¿Está seguro de que desea completar esta tarea?',
        text: 'Una vez completada, no se podrá deshacer esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, completar tarea',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            pTask.statusId = 3;
            this.tareaService.updateTask(pTask).subscribe({
                next: () => {
                    this.getTaskList();
                    Swal.fire('Tarea completada!', '', 'success');
                },
                error: (e) => {
                    this.getTaskList();
                    Swal.fire('Error al completar la tarea', '', 'error');
                },
            });
        }
    });
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.aplicarPaginacion(); // Llamada a la función que aplica la paginación
  }

  aplicarPaginacion(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const paginatedData = this.tareasList.slice(startIndex, endIndex);
    this.filteredTasks = paginatedData;
  }

}
