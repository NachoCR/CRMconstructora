import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CrearProyectoComponent } from 'app/crear-proyecto/crear-proyecto.component';
import { ProyectoData } from 'app/interfaces/proyecto.interface';
import { ProyectoService } from 'app/services/proyecto.service';
import { EditarProyectoComponent } from 'editar-proyecto/editar-proyecto.component';
import * as _ from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent {

  proyecto?: ProyectoData;  
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  proyectosList: any[] = []; // Asegúrate de que usuariosList contenga tus datos


  
  constructor(public dialog: MatDialog, private proyectoService: ProyectoService, private router: Router, private activatedRoute: ActivatedRoute) {}



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
      width: '200 px',
      data: {proyecto: this.proyecto}
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
          debugger;
          if (swalResult.isConfirmed) {
            this.proyectoService.addProyecto(result).subscribe({
              next : () => {
                this.getProyectosList();
                Swal.fire('Registrado!', '', 'success');
              }, error:(e)=> {
                this.getProyectosList();
                console.log(e);
                Swal.fire('Error al registrar proyecto', '', 'info');
              }
            });
              // Realizar cualquier acción adicional después de guardar
            }
            
          }
    )}
      }
    );}


    openDialogEditar(project: any): void {
    
      console.log(project);
      const pProyecto = _.cloneDeep(project);
      const dialogRef = this.dialog.open(EditarProyectoComponent, {
        width: '60%',
        data : pProyecto
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
                next : () => {
                  this.getProyectosList();
                  Swal.fire('Cambios guardados!', '', 'success');
                }, error:(e)=> {
                  this.getProyectosList();
                  debugger;
                  console.log(e);
                  Swal.fire('Error al guardar los cambios', '', 'info');
                }
              });
                // Realizar cualquier acción adicional después de guardar
              }
              else if (swalResult.isDenied) {
                // Usuario eligió no guardar los cambios
                Swal.fire('Cambios no guardados', '', 'info');
              }
            }
      )}
        }
      )};


      openEliminar(project: any): void {
    
        Swal.fire({
          title: 'Eliminar proyecto?',
          text: 'Está seguro que desea eliminar este proyecto?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, continuar',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.value) {
            debugger;
            this.proyectoService.deleteProyecto(project);
            let updatedProjects = this.proyectosList.filter(function(u) {
              if (u.projectId != project.projectId) {
              return u;
              }
              return null;
            })
            this.proyectosList = updatedProjects;
            this.router.navigate([this.router.url]);
            Swal.fire('Eliminado!', 'Proyecto eliminado.', 'success');
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelado', 'El proyecto no fue eliminado', 'error');
          }
        });
    
      }




}
