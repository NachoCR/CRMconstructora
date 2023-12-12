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
import { CrearSolicitudComponent } from '../crear-solicitud/crear-solicitud.component';
import { EditarSolicitudComponent } from '../editar-solicitud/editar-solicitud.component';
import { UsuarioService } from 'app/services/usuario.service';
import { DetallesSolicitudComponent } from '../detalles-solicitud/detalles-solicitud.component';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent {
  solicitud?: SolicitudData;
  @ViewChild("SolicitudesTable") solicitudesTable? : ElementRef;

  // usuariosList: UsuarioData[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  solicitudesList: any[] = []; 
  fileName= 'Solicitudes.xlsx';  

  displayedColumns: string[] = [
  
    'startDate',
    'endDate',
    'description',
    'userId',
    'statusId',
    'managerReason',
    'actions'
  ];

  constructor(
    public dialog: MatDialog,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    this.getSolicitudesList();

    
  }


  getSolicitudesList(): void {
    this.solicitudService.getSolicitudList().subscribe((result: any) => {
      this.solicitudesList = result;
      console.log(result)
      this.dataSource = new MatTableDataSource(this.solicitudesList);
    });
  }



  exportTable() {
    this.dataSource.data.map(x => {
      console.log(x);
    })
  
    let data = this.dataSource.data.map(x => ({
      "Fecha Inicio": x.startDate,
      "Fecha Final": x.endDate,
      "Descripción" : x.description,
      "Usuario": x.userDTO.name,
      "Estado" : x.statusId,
      "Razón" : x.managerReason, 
    }))
    let ws = XLSX.utils.json_to_sheet(data, <XLSX.Table2SheetOpts>{
      sheet: "solicitudes"
    });
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'solicitudes'); 
    XLSX.writeFile(wb, 'solicitudes.xlsx');
  }


  
  openDialog(): void {
    const dialogRef = this.dialog.open(CrearSolicitudComponent, {
    
      data: { solicitud: this.solicitud },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Mostrar SweetAlert para confirmar los cambios
        Swal.fire({
          title: '¿Quiere guardar la solicitud?',
          showDenyButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
        }).then(swalResult => {
          if (swalResult.isConfirmed) {
            console.log(result);
            this.solicitudService.addSolicitud(result).subscribe({
              next: () => {
                this.getSolicitudesList();
                Swal.fire('Registrado!', '', 'success');
              },
              error: e => {
                this.getSolicitudesList();

                console.log(e);
                Swal.fire('Error al registrar solicitud', '', 'info');
              },
            });
            // Realizar cualquier acción adicional después de guardar
          }
        });
      }
    });
  }

  openDialogEditar(solicitud: any): void {
    const pSolicitud = _.cloneDeep(solicitud);
    console.log(pSolicitud)
    const dialogRef = this.dialog.open(EditarSolicitudComponent, {
      
      data: pSolicitud,
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
            this.solicitudService.updateSolicitud(result).subscribe({
              next: () => {
                this.getSolicitudesList();
                Swal.fire('Cambios guardados!', '', 'success');
              },
              error: e => {
                this.getSolicitudesList();

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
        setTimeout(() => {}, 2000);
        this.getSolicitudesList();

        // let updatedUsers = this.usuariosList.filter(function(u) {
        //   if (u.userId != user.userId) {
        //   return u;
        //   }
        //   return null;
        // })
        // this.usuariosList = updatedUsers;
        //this.router.navigate([this.router.url]);
        Swal.fire('Eliminado!', 'Solicitud eliminada.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'La solicitud no fue eliminada', 'error');
      }
    });
  }

  openDetailsDialog(solicitud: any): void {
    this.solicitudService.getSolicitudDetails(solicitud.leaveId).subscribe((solicitudDetails: any) => {
      //console.table(contactDetails);
      this.dialog.open(DetallesSolicitudComponent, {

        data: solicitudDetails
      });
    });
  }
}