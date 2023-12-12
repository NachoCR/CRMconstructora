import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CrearProyectoComponent } from 'app/crear-proyecto/crear-proyecto.component';
import { ProyectoData } from 'app/interfaces/proyecto.interface';
import { ProyectoService } from 'app/services/proyecto.service';
import { EditarProyectoComponent } from 'app/editar-proyecto/editar-proyecto.component';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { Pipe, PipeTransform } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debug } from 'console';
import { MatPaginator } from '@angular/material/paginator';


@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], filtro: string): any[] {
    if (!items || !filtro) {
      return items;
    }
    return items.filter(item => {
      // Implementa tu lógica de filtrado según tus necesidades
      return (
        item.name.toLowerCase().includes(filtro) || item.description.toLowerCase().includes(filtro)

      );
    });
  }
}

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss'],
})
export class ProyectosComponent {
  proyecto?: ProyectoData;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  proyectosList: any[] = []; // Asegúrate de que usuariosList contenga tus datos
  proyectosPaginados: any[] = []; // Lista que se mostrará en la página actual
  filtro: string = '';
  fechaInicioFilter: Date | null = null;
  proyectosFiltradosPorFechaInicio: any[] = [];
  pickerFechaInicioSeleccionada: boolean = false;

  proyectosFiltrados: any[] = [];

    //Paginacion

    pageSizeOptions: number[] = [6, 10, 25, 100];
    pageSize: number = 6;
    pageIndex: number = 0;
    @ViewChild(MatPaginator) paginator!: MatPaginator; // <-- Agrega el modificador !
  
    //

  aplicarFiltro(filtro: string): void {
    // console.log('filtro:', filtro);
    this.filtro = filtro;
    // console.log('this.filtro:', this.filtro);
    // ... rest of your logic
  }

  filtrarPorFechaInicio(): void {
    
    this.proyectosFiltradosPorFechaInicio = this.proyectosList.filter(project => {
      const fechaInicioProyecto = new Date(project.startDate).toISOString();
      const fechaSeleccionada = this.fechaInicioFilter ? this.fechaInicioFilter.toISOString() : null;

      const fechaInicioCoincide = fechaSeleccionada ? fechaInicioProyecto >= fechaSeleccionada : true;

      return fechaInicioCoincide;
    });

    // Actualiza el estado del picker
    this.pickerFechaInicioSeleccionada = this.fechaInicioFilter !== null;
    // Actualiza la lista que se mostrará en la página actual
    this.proyectosList = this.proyectosFiltradosPorFechaInicio.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );


  this.aplicarPaginacion();
  this.paginator.firstPage();
  this.proyectosList = this.proyectosPaginados;
  this.dataSource.paginator = this.paginator;
  }
  limpiarFiltros(): void {
    // Limpiar filtros
    this.filtro = ''; 
    this.fechaInicioFilter = null;
    this.filtrarPorFechaInicio(); // Aplicar filtrado
    this.getProyectosList();
  }

  constructor(
    public dialog: MatDialog,
    private proyectoService: ProyectoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getProyectosList();
  }

  ngAfterViewInit(): void {
    this.aplicarPaginacion();
  }


  getProyectosList(): void {
    this.proyectoService.getProyectList().subscribe((result: any) => {
      this.proyectosList = result;
      this.aplicarPaginacion(); // Aplicar la paginación aquí
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearProyectoComponent, {
    
      data: { proyecto: this.proyecto },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Mostrar SweetAlert para confirmar los cambios
        Swal.fire({
          title: '¿Quiere registar el proyecto?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            this.proyectoService.addProyecto(result).subscribe({
              next: () => {
                this.getProyectosList();
                Swal.fire('Registrado!', '', 'success');
              },
              error: e => {
                this.getProyectosList();
                // console.log(e);
                Swal.fire('Error al registrar proyecto', '', 'info');
              },
            });
            // Realizar cualquier acción adicional después de guardar
          }
        });
      }
    });
  }

  openDialogEditar(project: any): void {
    // console.log(project);

    const pProyecto = _.cloneDeep(project);
    const dialogRef = this.dialog.open(EditarProyectoComponent, {
      data: pProyecto,
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
            this.proyectoService.updateProyecto(result).subscribe({
              next: () => {
                this.getProyectosList();
                Swal.fire('Cambios guardados!', '', 'success');
              },
              error: e => {
                this.getProyectosList();
                
                // console.log(e);
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

  openEliminar(project: any): void {
    Swal.fire({
      title: 'Eliminar proyecto?',
      text: 'Está seguro que desea eliminar este proyecto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No',
    }).then(result => {
      if (result.value) {
        
        this.proyectoService.deleteProyecto(project);
        let updatedProjects = this.proyectosList.filter(function (u) {
          if (u.projectId != project.projectId) {
            return u;
          }
          return null;
        });
        this.proyectosList = updatedProjects;
        Swal.fire('Eliminado!', 'Proyecto eliminado.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'El proyecto no fue eliminado', 'error');
      }
    });
  }
  checkProjectImage(url?: string): string {
    if (url) {
      return url ?? '';
    }
    return '../../assets/images/inspecciones/inspeccion1.jpg';
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.aplicarPaginacion(); // Llamada a la función que aplica la paginación
  }

  aplicarPaginacion(): void {
  const startIndex = this.pageIndex * this.pageSize;
  const endIndex = startIndex + this.pageSize;

  this.proyectosPaginados = this.proyectosList.slice(startIndex, endIndex);
  }
}
