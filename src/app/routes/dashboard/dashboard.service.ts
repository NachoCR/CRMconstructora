import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProyectoService } from 'app/services/proyecto.service';
import { Observable, map } from 'rxjs';
import { ProductoService } from 'app/services/producto.service';
import { TareaService } from 'app/services/tarea.service';
import { UsuarioService } from 'app/services/usuario.service';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { CatalogoProveedorComponent } from 'app/catalogo-proveedor/catalogo-proveedor.component';
import { catalogoProveedorData } from '../../interfaces/catalogoProveedor.interface';
import { ProveedorData } from '../../interfaces/proveedor.interface';
import { ProyectoData } from 'app/interfaces/proyecto.interface';
import { AuthService, User } from '@core';
import { SolicitudService } from 'app/services/solicitud.service';

export interface ConstruccionItems {
  proveedor: string;
  id: number;
  proyecto: number;
  fecha: string;
  total: string;
  link: string;
}

const ELEMENT_DATA: ConstruccionItems[] = [
  {
    id: 1,
    proveedor: 'EPA',
    proyecto: 2321,
    fecha: '08/18/2023',
    total: '152000',
    link: 'Factura',
  },
  { id: 2, proveedor: 'EPA', proyecto: 11, fecha: '08/18/2023', total: '460200', link: 'Factura' },
  {
    id: 3,
    proveedor: 'Gravilias',
    proyecto: 12,
    fecha: '08/18/2023',
    total: '145600',
    link: 'Factura',
  },
  {
    id: 4,
    proveedor: 'Ferreutil',
    proyecto: 31,
    fecha: '08/18/2023',
    total: '1260000',
    link: 'Factura',
  },
  {
    id: 5,
    proveedor: 'El Lagar',
    proyecto: 42,
    fecha: '08/18/2023',
    total: '487000',
    link: 'Factura',
  },
  {
    id: 6,
    proveedor: 'Gravilias',
    proyecto: 3,
    fecha: '08/18/2023',
    total: '3587000',
    link: 'Factura',
  },
  {
    id: 7,
    proveedor: 'Maderas del Sur',
    proyecto: 1,
    fecha: '08/18/2023',
    total: '110000',
    link: 'Factura',
  },
];

const MESSAGES = [
  {
    img: 'assets/images/avatars/man1.png',
    subject: 'Adrian',
    content: `Casa Santa Ana`,
  },
  {
    img: 'assets/images/avatars/girl2.png',
    subject: 'Lucia',
    content: `Casa Aserri`,
  },
  {
    img: 'assets/images/avatars/girl1.png',
    subject: 'Sofia',
    content: `Encargada Colegio de Señoritas`,
  },
];

@Injectable()
export class DashboardService {

  user?: User;

  ELEMENT_DATA2: catalogoProveedorData[] = [];

  stats = [
    {
      title: 'Cantidad de Proyectos en Progreso',
      amount: 0,
      progress: {
        value: 100,
      },
      color: 'bg-indigo-500',
    },
    {
      title: 'Precio Total del Inventario Actual',
      amount: 0,
      progress: {
        value: 100,
      },
      color: 'bg-blue-500',
    },
    {
      title: 'Cantidad de Tareas',
      amount: '',
      progress: {
        value: 100,
      },
      color: 'bg-green-500',
    },
    {
      title: 'Clientes Registrados',
      amount: 0,
      progress: {
        value: 100,
      },
      color: 'bg-teal-500',
    },
  ];

  charts = [
    {
      chart: {
        height: 350,
        type: 'area',
        toolbar: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          name: 'UV',
          data: [31, 40, 28, 51, 42, 109, 100],
        },
        {
          name: 'Download',
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      xaxis: {
        type: 'datetime',
        categories: [
          '2019-11-24T00:00:00',
          '2019-11-24T01:30:00',
          '2019-11-24T02:30:00',
          '2019-11-24T03:30:00',
          '2019-11-24T04:30:00',
          '2019-11-24T05:30:00',
          '2019-11-24T06:30:00',
        ],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
    },
    {
      chart: {
        height: 350,
        type: 'radar',
      },
      series: [
        {
          name: 'Weekly Revenue',
          data: [20, 100, 40, 30, 50, 80, 33],
        },
      ],
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      plotOptions: {
        radar: {
          size: 140,
          polygons: {
            strokeColor: '#e9e9e9',
            fill: {
              colors: ['#f8f8f8', '#fff'],
            },
          },
        },
      },
      colors: ['#FF4560'],
      markers: {
        size: 4,
        colors: ['#fff'],
        strokeColor: '#FF4560',
        strokeWidth: 2,
      },
      tooltip: {
        y: {
          formatter: (val: number) => val,
        },
      },
      yaxis: {
        tickAmount: 7,
        labels: {
          formatter: (val: number, i: number) => {
            if (i % 2 === 0) {
              return val;
            } else {
              return '';
            }
          },
        },
      },
    },
  ];

  getCantProyectos(): Observable<number> {
    if (this.user && this.user.roles && this.user.roles.includes('Empleado')) {
      const userId = this.user.id;
      return this.proyectosService.getProyectList().pipe(
        map(proyectosList => {
          const proyectosFiltrados = proyectosList.filter(proyecto =>
            proyecto.statusId === 2 && proyecto.tasks.some((tarea: { userId: number }) => tarea.userId === userId)
          );
          return proyectosFiltrados.length;
        })
      );
    } else {
      return this.proyectosService.getProyectList().pipe(
        map(proyectosList => proyectosList.filter(proyecto => proyecto.statusId === 2).length)
      );
    }
  }

  getParticipacionProyectos(): Observable<number> {
    const userId = this.user?.id;

    return this.proyectosService.getProyectList().pipe(
      map(proyectosList => {
        const proyectosFiltrados = proyectosList.filter(proyecto =>
          proyecto.tasks.some((tarea: { userId: number }) => tarea.userId === userId)
        );
        return proyectosFiltrados.length;
      })
    );
  }

  getCantClientes(): Observable<number> {
    return this.usuarioService.getUserList().pipe(
      map(usuarioList => usuarioList.filter(usuario => usuario.roleId === 2).length)
    );
  }

  getCantSolicitudes(): Observable<number> {
    const userId = this.user?.id;
    return this.solicitudService.getSolicitudList().pipe(
      map(solicitudesList => solicitudesList.filter(solicitud => solicitud.userId === userId).length)
    );
  }

  getTareasCant(): Observable<string> {
    if (this.user && this.user.roles && this.user.roles.includes('Empleado')) {
      return this.tareasService.getTaskList().pipe(
        map(tareasList => {
          const userId = this.user?.id;
          const tareasUsuario = tareasList.filter(tarea => tarea.userId === userId);

          const tareasNuevas = tareasUsuario.filter(tarea => tarea.statusId === 1).length;
          const tareasAprobadas = tareasUsuario.filter(tarea => tarea.statusId === 2).length;
          const tareasDenegadas = tareasUsuario.filter(tarea => tarea.statusId === 3).length;

          const tareas = `Nuevo: ${tareasNuevas} | En progreso: ${tareasAprobadas} | Completado: ${tareasDenegadas}`;
          return tareas;
        })
      );
    } else {
      return this.tareasService.getTaskList().pipe(
        map(tareasList => {
          const tareasNuevas = tareasList.filter(tarea => tarea.statusId === 1).length;
          const tareasAprobadas = tareasList.filter(tarea => tarea.statusId === 2).length;
          const tareasDenegadas = tareasList.filter(tarea => tarea.statusId === 3).length;

          const tareas = `Nuevo: ${tareasNuevas} | En progreso: ${tareasAprobadas} | Completado: ${tareasDenegadas}`;
          return tareas;
        })
      );
    }
  }

  getPrecioTotalInventario(): Observable<number> {
    return this.productosService.getProductoList().pipe(
      map(productosList => {
        const precios = productosList.map(producto => producto.price || 0);
        const precioTotal = precios.reduce((total, precio) => total + precio, 0);
        return precioTotal;
      })
    );
  }

  getClientes(): Observable<UsuarioData[]> {
    return this.usuarioService.getUserList().pipe(
      map(usuarioList => usuarioList.filter(usuario => usuario.roleId === 2).slice(0, 3))
    );
  }

  getProductos(): Observable<CatalogoProveedorComponent[]> {
    return this.productosService.getProductoList().pipe(
      map(productoList => productoList.slice(0, 7))
    );
  }

  getProyectos(): Observable<ProyectoData[]> {
    if (this.user && this.user.roles && this.user.roles.includes('Empleado')) {
      const userId = this.user.id;
      return this.proyectosService.getProyectList().pipe(
        map(proyectosList => proyectosList.filter(
          proyecto => proyecto.tasks.some((tarea: { userId: number }) => tarea.userId === userId)).slice(0, 3)
        )
      );
    } else {
      return this.proyectoService.getProyectList().pipe(
        map(proyectoList => proyectoList.slice(0, 3))
      );
    }
  }

  getTareas(): Observable<ProyectoData[]> {
    const userId = this.user?.id;
    return this.tareasService.getTaskList().pipe(
      map(tareasList => tareasList.filter(
        tarea => tarea.userId === userId).slice(0, 3)
      )
    );
  }

  getSolicitudes(): Observable<ProyectoData[]> {
    const userId = this.user?.id;
    return this.solicitudService.getSolicitudList().pipe(
      map(solicitudesList => solicitudesList.filter(
        solicitud => solicitud.userId === userId).slice(0, 3)
      )
    );
  }

  constructor(
    private http: HttpClient,
    private proyectosService: ProyectoService,
    private productosService: ProductoService,
    private tareasService: TareaService,
    private usuarioService: UsuarioService,
    private proyectoService: ProyectoService,
    private solicitudService: SolicitudService,
    private authService: AuthService
  ) {
    this.getUser();

    if (this.user && this.user.roles && this.user.roles.includes('Empleado')) {
      this.getCantProyectos().subscribe(cantidadProyectos => {
        this.stats[0].amount = cantidadProyectos;
      });
      this.getParticipacionProyectos().subscribe(participacion => {
        this.stats[1].title = "Participación en Proyectos";
        this.stats[1].amount = participacion;
      });
      this.getCantSolicitudes().subscribe(solitudes => {
        this.stats[3].title = "Cantidad de Solicitudes";
        this.stats[3].amount = solitudes;
      });
    } else{
      this.getCantProyectos().subscribe(cantidadProyectos => {
        this.stats[0].amount = cantidadProyectos;
      });
      this.getPrecioTotalInventario().subscribe(precioTotal => {
        this.stats[1].amount = precioTotal;
      });
      this.getCantClientes().subscribe(clientes => {
        this.stats[3].amount = clientes;
      });
    }
    this.getTareasCant().subscribe(tareas => {
      this.stats[2].amount = tareas;
    });
  }

  getData() {
    return ELEMENT_DATA;
  }

  getMessages() {
    return MESSAGES;
  }

  getCharts() {
    return this.charts;
  }

  getStats() {
    return this.stats;
  }

  getUser(): void {
    const subscription = this.authService.user().subscribe(user => {
      this.user = user;
    });
  }
}
