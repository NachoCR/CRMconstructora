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

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss'],
})
export class TareaComponent implements OnInit {
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
    private activatedRoute: ActivatedRoute
  ) {}

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
    this.tareaService.getTaskList().subscribe((result: any) => {
      this.tareasList = result;
      this.filteredTasks = this.tareasList;
      this.dataSource = new MatTableDataSource(this.tareasList);
      this.dataSource.paginator = this.paginator;
      this.aplicarPaginacion(); // Aplicar la paginación aquí
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearTareaComponent, {
      data: { tarea: this.tarea },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Mostrar SweetAlert para confirmar los cambios
        Swal.fire({
          title: '¿Quiere registar la tarea?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            this.tareaService.addTask(result).subscribe({
              next: () => {
                this.getTaskList();
                Swal.fire('Registrado!', '', 'success');
              },
              error: e => {
                this.getTaskList();
                Swal.fire('Error al registrar tarea', '', 'info');
              },
            });
            // Realizar cualquier acción adicional después de guardar
          }
        });
      }
    });
  }

  openDialogEditar(Task: any): void {
    const pTask = _.cloneDeep(Task);
    const dialogRef = this.dialog.open(EditarTareaComponent, {
      data: pTask,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Mostrar SweetAlert para confirmar los cambios
        Swal.fire({
          title: '¿Quiere guardar los cambios?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            this.tareaService.updateTask(result).subscribe({
              next: () => {
                this.getTaskList();
                Swal.fire('Cambios guardados!', '', 'success');
              },
              error: e => {
                this.getTaskList();
                Swal.fire('Error al guardar los cambios', '', 'info');
              },
            });
            // Realizar cualquier acción adicional después de guardar
          } else if (swalResult.isDenied) {
            // Usuario eligió no guardar los cambios
            Swal.fire('Cambios no guardados', '', 'info');
          }
        });
      }
    });
  }

  openEliminar(Task: any): void {
    Swal.fire({
      title: 'Eliminar tarea?',
      text: 'Está seguro que desea eliminar esta tarea?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No',
    }).then(result => {
      if (result.value) {
        this.tareaService.deleteTask(Task);
        setTimeout(() => {}, 2000);
        // Agrega un tiempo de espera antes de actualizar la lista
        setTimeout(() => {
          this.getTaskList();
          Swal.fire('Eliminado!', 'Tarea eliminada.', 'success');
        }, 2000);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'La tarea no fue eliminada', 'error');
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
