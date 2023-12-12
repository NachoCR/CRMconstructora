import { Component, OnInit, Inject, ViewChild, Pipe, PipeTransform } from '@angular/core';
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
import { TareaService } from 'app/services/tarea.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { debug } from 'console';
import * as _ from 'lodash';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss'],
})
export class TareaComponent implements OnInit {
  tarea?: TareaData;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  items: any[] = []; // Ajusta el tipo según tus datos reales
  pageSize: number = 5; // Número de elementos por página
  p: number = 1; // Página actual

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

  searchTerm: string = '';
  filteredTasks: any[] = [];

  constructor(
    public dialog: MatDialog,
    private tareaService: TareaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getTaskList();
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
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearTareaComponent, {
      width: '80%',
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
          debugger;
          if (swalResult.isConfirmed) {
            this.tareaService.addTask(result).subscribe({
              next: () => {
                this.getTaskList();
                Swal.fire('Registrado!', '', 'success');
              },
              error: e => {
                this.getTaskList();
                debugger;
                console.log(e);
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
    console.log(Task);
    const pTask = _.cloneDeep(Task);
    const dialogRef = this.dialog.open(EditarTareaComponent, {
      width: '80%',
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
                debugger;
                console.log(e);
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
        let updatedTask = this.tareasList.filter(function (u) {
          if (u.taskId != Task.taskId) {
            return u;
          }
          return null;
        });
        this.tareasList = updatedTask;

        Swal.fire('Eliminada!', 'Tarea eliminada.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'La tarea no fue eliminada', 'error');
      }
    });
  }
}
