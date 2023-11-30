import { Component } from '@angular/core';
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
        // Agrega más propiedades según sea necesario
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
  filtro: string = '';

  aplicarFiltro(filtro: string): void {
    console.log('filtro:', filtro);
    this.filtro = filtro;
    console.log('this.filtro:', this.filtro);
    // ... rest of your logic
  }

  constructor(
    public dialog: MatDialog,
    private proyectoService: ProyectoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProyectosList();
  }

  getProyectosList(): void {
    this.proyectoService.getProyectList().subscribe((result: any) => {
      this.proyectosList = result;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CrearProyectoComponent, {
      width: '60%',
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
                console.log(e);
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
    console.log(project);
    const pProyecto = _.cloneDeep(project);
    const dialogRef = this.dialog.open(EditarProyectoComponent, {
      width: '60%',
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
}
