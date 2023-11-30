import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';

import { TareasComponent } from 'app/tareas/tareas.component';
import { ProyectosComponent } from 'app/proyectos/proyectos.component';
import { UsuariosComponent } from 'app/usuarios/usuarios.component';
import { ProveedoresComponent } from 'app/proveedores/proveedores.component';

const COMPONENTS: any[] = [
  DashboardComponent,
  TareasComponent,
  ProyectosComponent,
  UsuariosComponent,
  ProveedoresComponent,
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, RoutesRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
})
export class RoutesModule {}
