import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SolicitudData } from 'app/interfaces/solicitud.interface';
import { SolicitudService } from 'app/services/solicitud.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.scss']
})
export class CrearSolicitudComponent {
  selectedProject: any;

  filteredOptions: Observable<string[]> = new Observable<string[]>(); // Inicialización

  crearSolicitudForm: FormGroup;
  submitted = false;
  isWorking = false;
  usuariosList: any[] = []; // Asegúrate de que usuariosList contenga tus datos
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  solicitud?: SolicitudData;
  proyectosList: any[] = []; // Aquí almacenarás la lista de clientes
  filteredProyectosList$: Observable<any[]> | undefined;

  
  constructor(
    public dialogRef: MatDialogRef<CrearSolicitudComponent>,
    private solicitudService: SolicitudService,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) 
  
  {

    this.crearSolicitudForm = new FormGroup(
      {

        startDate: new FormControl(null, [Validators.required]),
        endDate: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required]),
        userId: new FormControl(null, [Validators.required]),
        statusId: new FormControl(null),
        managerReason: new FormControl(null),

      }
    );
  }






    
  }


