import { Component, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CrearProyectoComponent } from 'app/crear-proyecto/crear-proyecto.component';
import { ProyectoData } from 'app/interfaces/proyecto.interface';
import { ProyectoService } from 'app/services/proyecto.service';
import { EditarProyectoComponent } from 'app/editar-proyecto/editar-proyecto.component';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService, User } from '@core';

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
  selector: 'app-proyectos-emp',
  templateUrl: './proyectos-emp.component.html',
  styleUrls: ['./proyectos-emp.component.scss']
})
export class ProyectosEmpComponent {

  user?: User;

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

  //

  aplicarFiltro(filtro: string): void {
    this.filtro = filtro;
  }

  filtrarPorFechaInicio(): void {

    this.proyectosFiltradosPorFechaInicio = this.proyectosList.filter(project => {
      const fechaInicioProyecto = new Date(project.startDate).toISOString();
      const fechaSeleccionada = this.fechaInicioFilter
        ? this.fechaInicioFilter.toISOString()
        : null;

      const fechaInicioCoincide = fechaSeleccionada
        ? fechaInicioProyecto >= fechaSeleccionada
        : true;

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
    private authService: AuthService
  ) {
    this.getUser();
  }

  ngOnInit(): void {
    this.getProyectosList();
  }

  ngAfterViewInit(): void {
    this.aplicarPaginacion();
  }

  getUser(): void {
    const subscription = this.authService.user().subscribe(user => {
      this.user = user;
    });
  }

  getProyectosList(): void {
    const userId = this.user?.id;
    this.proyectoService.getProyectList().subscribe((result: any) => {
      this.proyectosList = result.filter(
        (proyecto: any) => proyecto.tasks.some((tarea: { userId: number }) => tarea.userId === userId)
      );
      this.aplicarPaginacion();
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
