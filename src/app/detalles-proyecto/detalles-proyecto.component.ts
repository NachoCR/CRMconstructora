import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ProyectoService } from 'app/services/proyecto.service';
import { UsuarioService } from 'app/services/usuario.service';
import { table } from 'console';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import Swal from 'sweetalert2';
import { AuthService, LoginService } from '@core';
import { User } from '../core/authentication/interface';
import * as bcrypt from 'bcryptjs'
import { Empleado } from 'app/interfaces/empleado';
import { EmployeeProjectAssignmentService } from 'app/services/employee-project-assignment.service';

@Component({
  selector: 'app-detalles-proyecto',
  templateUrl: './detalles-proyecto.component.html',
  styleUrls: ['./detalles-proyecto.component.scss']
})
export class DetallesProyectoComponent implements OnInit {

  usuario?: UsuarioData;
  user?: User;
  projectId?: string;
  proyecto?: any;
  empleados: Empleado[] = [];

  pageSizeTasks: number = 6;
  pageIndexTasks: number = 0;
  proyectosPaginadosTareas: any[] = [];

  pageSizeEmpleados: number = 6;
  pageIndexEmpleados: number = 0;
  proyectosPaginadosEmpleados: any[] = [];

  constructor(
    public dialog: MatDialog,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private proyectoService: ProyectoService,
    private employeeProjectAssignmentService: EmployeeProjectAssignmentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
    this.getProyecto();
    this.getEmpleados();
    this.aplicarPaginacionTareas();
    this.aplicarPaginacionEmpleados();
  }

  getProyecto(): void {
    let projectIdNumber: number = Number(this.projectId) || 0;
    this.proyectoService.getProyectoDetails(projectIdNumber).subscribe((result: any) => {
      this.proyecto = result;
      this.aplicarPaginacionTareas();
      this.cdr.detectChanges();
    });
  }

  getEmpleados(): void {
    let projectIdNumber: number = Number(this.projectId) || 0;
    this.employeeProjectAssignmentService.getEmployeesByProjectId(projectIdNumber).subscribe((result: any) => {
      this.empleados = result;
      this.aplicarPaginacionEmpleados();
      this.cdr.detectChanges();
    });
  }


  aplicarPaginacionTareas(): void {
    const startIndex = this.pageIndexTasks * this.pageSizeTasks;
    const endIndex = startIndex + this.pageSizeTasks;

    this.proyectosPaginadosTareas = this.proyecto?.tasks.slice(startIndex, endIndex) || [];
  }

  aplicarPaginacionEmpleados(): void {
    const startIndex = this.pageIndexEmpleados * this.pageSizeEmpleados;
    const endIndex = startIndex + this.pageSizeEmpleados;

    this.proyectosPaginadosEmpleados = this.empleados.slice(startIndex, endIndex) || [];
  }

  onPageChangeTareas(event: any): void {
    this.pageSizeTasks = event.pageSize;
    this.pageIndexTasks = event.pageIndex;
    this.aplicarPaginacionTareas();
  }

  onPageChangeEmpleados(event: any): void {
    this.pageSizeEmpleados = event.pageSize;
    this.pageIndexEmpleados = event.pageIndex;
    this.aplicarPaginacionEmpleados();
  }

}
