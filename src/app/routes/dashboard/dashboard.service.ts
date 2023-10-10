import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  stats = [
    {
      title: 'Facturas de esta semana',
      amount: '4.452.000',
      progress: {
        value: 100,
      },
      color: 'bg-indigo-500',
    },
    {
      title: 'Entradas',
      amount: '9.142.200',
      progress: {
        value: 100,
      },
      color: 'bg-blue-500',
    },
    {
      title: 'Salario semanales',
      amount: '1,291,922',
      progress: {
        value: 100,
      },
      color: 'bg-green-500',
    },
    {
      title: 'Gastos Transporte',
      amount: '40.000',
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

  constructor(private http: HttpClient) {}

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
}
