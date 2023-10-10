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
import { TareasComponent } from 'app/tareas/tareas.component';
import { CrearTareaComponent } from 'app/crear-tarea/crear-tarea.component';
import { EditarTareaComponent } from 'app/editar-tarea/editar-tarea.component';

const routes: Routes = [
  { path: '#', component: DashboardComponent },
  { path: '', component: LandingComponent },
  {
    path: 'usuarios', component: UsuariosComponent
    // children:
    // [
    //   { path: 'crearUsuario', component: CrearUsuarioComponent },
    //   { path: 'eliminarUsuario', component: EliminarUsuarioComponent }
    // ]
  },
  { path: 'crearUsuario', component: CrearUsuarioComponent },
  { path: 'proyectos', component: ProyectosComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'crearProvedor', component: CrearProveedorComponent },
  { path: 'crearProyecto', component: CrearProyectoComponent},
  { path: 'tareas', component: TareasComponent},
  { path: 'crearTarea', component: CrearTareaComponent},
  { path: 'editarTarea', component: EditarTareaComponent},
  { path: 'catalogoProveedor', component: CatalogoProveedorComponent },
  { path: 'ordenesCompra', component: OrdenesCompraComponent }
  ,

  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component }
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
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
export class RoutesRoutingModule { }
