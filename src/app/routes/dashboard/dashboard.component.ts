import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { SettingsService } from '@core';
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
  displayedColumns: string[] = ['id', 'proveedor', 'proyecto', 'fecha', 'total', 'link'];
  dataSource = this.dashboardSrv.getData();

  messages = this.dashboardSrv.getMessages();

  displayedColumns2: string[] = ['name', 'details', 'price', 'quantity', 'provider'];
  dataSource2?: any;


  usuarioData?: UsuarioData [] = [];
  proyectosData?: ProyectoData [] = [];

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.notifySubscription = this.settings.notify.subscribe(res => {
      console.log(res);
    });
    this.dashboardSrv.getClientes().subscribe(clientes => {
      this.usuarioData = clientes;
      this.cdr.detectChanges();
    });
    this.dashboardSrv.getProductos().subscribe(productos => {
      this.dataSource2 = productos;
      this.cdr.detectChanges();
    });
    this.dashboardSrv.getProyectos().subscribe(proyectos => {
      this.proyectosData = proyectos;
      this.cdr.detectChanges();
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
