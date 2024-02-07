import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { AuthService, SettingsService, User } from '@core';
import { Subscription } from 'rxjs';

import { DashboardService } from './dashboard.service';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { CatalogoProveedorComponent } from 'app/catalogo-proveedor/catalogo-proveedor.component';
import { ProyectoData } from '../../interfaces/proyecto.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  user?: User;

  displayedColumns: string[] = ['id', 'proveedor', 'proyecto', 'fecha', 'total', 'link'];
  dataSource = this.dashboardSrv.getData();

  messages = this.dashboardSrv.getMessages();

  displayedColumns2: string[] = ['name', 'details', 'price', 'quantity', 'provider'];
  displayedColumns3: string[] = ['name', 'description', 'startDate', 'dateDue', 'status'];
  dataSource2?: any;


  usuarioData?: UsuarioData [] = [];
  proyectosData?: ProyectoData [] = [];
  solicitudesData?: any [] = [];

  productosData?: CatalogoProveedorComponent [] = [];

  charts = this.dashboardSrv.getCharts();
  chart1: any;
  chart2: any;

  stats = this.dashboardSrv.getStats();

  notifySubscription!: Subscription;

  constructor(
    private ngZone: NgZone,
    private dashboardSrv: DashboardService,
    private settings: SettingsService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getUser();

    this.notifySubscription = this.settings.notify.subscribe(res => {
      console.log(res);
    });
    if (this.user && this.user.roles && this.user.roles.includes('Empleado')) {
      this.dashboardSrv.getSolicitudes().subscribe(solicitudes => {
        this.solicitudesData = solicitudes;
        this.cdr.detectChanges();
      });
      this.dashboardSrv.getTareas().subscribe(tareas => {
        this.dataSource2 = tareas;
        this.cdr.detectChanges();
      });
    } else {
      this.dashboardSrv.getClientes().subscribe(clientes => {
        this.usuarioData = clientes;
        this.cdr.detectChanges();
      });
      this.dashboardSrv.getProductos().subscribe(productos => {
        this.dataSource2 = productos;
        this.cdr.detectChanges();
      });
    }
    this.dashboardSrv.getProyectos().subscribe(proyectos => {
      this.proyectosData = proyectos;
      this.cdr.detectChanges();
    });
  }

  getUser(): void {
    const subscription = this.authService.user().subscribe(user => {
      this.user = user;
    });
  }

  ngAfterViewInit() {
    // this.ngZone.runOutsideAngular(() => this.initChart());
  }

  ngOnDestroy() {
    // if (this.chart1) {
    //   this.chart1?.destroy();
    // }
    // if (this.chart2) {
    //   this.chart2?.destroy();
    // }

    // this.notifySubscription.unsubscribe();
  }

  // initChart() {
  //   this.chart1 = new ApexCharts(document.querySelector('#chart1'), this.charts[0]);
  //   this.chart1?.render();
  //   this.chart2 = new ApexCharts(document.querySelector('#chart2'), this.charts[1]);
  //   this.chart2?.render();
  // }
}
