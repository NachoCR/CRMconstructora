import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudData } from 'app/interfaces/solicitud.interface';
import { SolicitudService } from 'app/services/solicitud.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { debug } from 'console';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { DetallesSolicitudComponent } from 'app/solicitudes/detalles-solicitud/detalles-solicitud.component';
import { AuthService, User } from '@core';
import { CrearSolicitudEmpComponent } from '../crear-solicitud-emp/crear-solicitud-emp.component';

@Component({
  selector: 'app-solicitudes-emp',
  templateUrl: './solicitudes-emp.component.html',
  styleUrls: ['./solicitudes-emp.component.scss']
})
export class SolicitudesEmpComponent {

  user?: User;

  solicitud?: SolicitudData;
  @ViewChild('SolicitudesTable') solicitudesTable?: ElementRef;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  solicitudesList: any[] = [];
  fileName = 'Solicitudes.xlsx';

  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'description',
    'userId',
    'statusId',
    'managerReason',
    'actions',
  ];

  constructor(
    public dialog: MatDialog,
    private solicitudService: SolicitudService,
    private authService: AuthService,
  ) {
    this.getUser();
  }

  ngOnInit(): void {
    this.getSolicitudesList();
  }

  getUser(): void {
    const subscription = this.authService.user().subscribe(user => {
      this.user = user;
    });
  }

  getSolicitudesList(): void {
    const userId = this.user?.id;

    this.solicitudService.getSolicitudList().subscribe((result: any) => {
      this.solicitudesList = result.filter(
        (solicitud: any) => solicitud.userId === userId
      );
      this.dataSource = new MatTableDataSource(this.solicitudesList);
    });
  }

  exportTable() {
    this.dataSource.data.map(x => {});

    let data = this.dataSource.data.map(x => ({
      'Fecha Inicio': x.startDate,
      'Fecha Final': x.endDate,
      'Descripción': x.description,
      'Usuario': x.userDTO.name,
      'Estado': x.statusId,
      'Razón': x.managerReason,
    }));
    let ws = XLSX.utils.json_to_sheet(data, <XLSX.Table2SheetOpts>{
      sheet: 'solicitudes',
    });
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'solicitudes');
    XLSX.writeFile(wb, 'solicitudes.xlsx');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearSolicitudEmpComponent, {
      width: '60%',
      data: { solicitud: this.solicitud },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const userId = this.user?.id;
        result.userId = userId;
        Swal.fire({
          title: '¿Quiere guardar la solicitud?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            this.solicitudService.addSolicitud(result).subscribe({
              next: () => {
                this.getSolicitudesList();
                Swal.fire('Registrado!', '', 'success');
              },
              error: e => {
                this.getSolicitudesList();

                Swal.fire('Error al registrar solicitud', '', 'info');
              },
            });
          }
        });
      }
    });
  }

  openEliminar(solicitud: any): void {
    Swal.fire({
      title: 'Eliminar solicitud?',
      text: 'Está seguro que desea eliminar esta solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, continuar',
      cancelButtonText: 'No',
    }).then(result => {
      if (result.value) {
        this.solicitudService.deleteSolicitud(solicitud);
        setTimeout(() => {}, 4000);
        // Agrega un tiempo de espera antes de actualizar la lista
        setTimeout(() => {
          this.getSolicitudesList();
          Swal.fire('Eliminado!', 'Solicitud eliminada.', 'success');
        }, 2000);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'La solicitud no fue eliminada', 'error');
      }
    });
  }

  openDetailsDialog(solicitud: any): void {
    this.solicitudService
      .getSolicitudDetails(solicitud.leaveId)
      .subscribe((solicitudDetails: any) => {
        this.dialog.open(DetallesSolicitudComponent, {
          data: solicitudDetails,
        });
      });
  }

}
