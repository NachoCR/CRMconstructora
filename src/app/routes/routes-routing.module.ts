import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';
import { LandingComponent } from '../landing/landing.component';
import { UsuariosComponent } from 'app/usuarios/usuarios.component';
import { authGuard } from '@core/authentication';
import { ProyectosComponent } from 'app/proyectos/proyectos.component';
import { ProveedoresComponent } from 'app/proveedores/proveedores.component';
import { CatalogoProveedorComponent } from 'app/catalogo-proveedor/catalogo-proveedor.component';
import { OrdenesCompraComponent } from 'app/ordenes-compra/ordenes-compra.component';
import { CrearUsuarioComponent } from 'app/crear-usuario/crear-usuario.component';
import { CrearProveedorComponent } from 'app/crear-proveedor/crear-proveedor.component';
import { CrearProyectoComponent } from 'app/crear-proyecto/crear-proyecto.component';
import { TareaComponent } from 'app/tareas/tareas.component';
import { CrearTareaComponent } from 'app/crear-tarea/crear-tarea.component';
import { EditarTareaComponent } from 'app/editar-tarea/editar-tarea.component';
import { ContactosComponent } from 'app/contactos/contactos/contactos.component';
import { RecoverComponent } from './sessions/recover/recover.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { ProductosComponent } from 'app/productos/productos/productos.component';
import { TaskCalendarComponent } from '@shared/components/task-calendar/task-calendar.component';
import { CalendarioComponent } from 'app/calendario/calendario.component';
import { SolicitudesComponent } from 'app/solicitudes/solicitudes/solicitudes.component';
import { DetallesContactoComponent } from 'app/contactos/detalles-contacto/detalles-contacto.component';
import { DetallesProyectoComponent } from 'app/detalles-proyecto/detalles-proyecto.component';

const routes: Routes = [
  { path: '#', component: DashboardComponent },
  { path: '', component: LandingComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'proyectos', component: ProyectosComponent },
  { path: 'solicitudes', component: SolicitudesComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'tareas', component: TareaComponent },
  { path: 'catalogoProveedor', component: CatalogoProveedorComponent },
  { path: 'ordenesCompra', component: OrdenesCompraComponent },
  { path: 'contactos', component: ContactosComponent },
  { path: 'uploadImage', component: FileUploadComponent },
  {path: 'calendar' , component: TaskCalendarComponent},
  { path: 'productos', component: ProductosComponent },

  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'proyectos', component: ProyectosComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'tareas', component: TareaComponent },
      { path: 'catalogoProveedor', component: CatalogoProveedorComponent },
      { path: 'ordenesCompra', component: OrdenesCompraComponent },
      { path: 'contactos', component: ContactosComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'solicitudes', component: SolicitudesComponent },
      { path: 'calendario', component: CalendarioComponent },
      { path: 'detalles-proyecto/:projectId', component: DetallesProyectoComponent },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'recover', component: RecoverComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
    }),
  ],
  exports: [RouterModule],
})
export class RoutesRoutingModule {}
