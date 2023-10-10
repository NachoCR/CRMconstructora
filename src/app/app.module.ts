import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { Router, RouterModule } from '@angular/router';


import { CoreModule } from '@core/core.module';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { FormlyConfigModule } from './formly-config.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { environment } from '@env/environment';
import { BASE_URL, httpInterceptorProviders, appInitializerProviders } from '@core';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemDataService } from '@shared/in-mem/in-mem-data.service';
import { ApiAuthService } from '@core/authentication/api-auth.service';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { CatalogoProveedorComponent } from './catalogo-proveedor/catalogo-proveedor.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { OrdenesCompraComponent } from './ordenes-compra/ordenes-compra.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { CrearProveedorComponent } from './crear-proveedor/crear-proveedor.component';
import { EditarProveedorComponent } from './editar-proveedor/editar-proveedor.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { CrearProyectoComponent } from './crear-proyecto/crear-proyecto.component';
import { TareasComponent } from './tareas/tareas.component';
import { CrearTareaComponent } from './crear-tarea/crear-tarea.component';
import { EditarTareaComponent } from './editar-tarea/editar-tarea.component';
import { CrearProductoCatalogoComponent } from './crear-producto-catalogo/crear-producto-catalogo.component';
import { EditarProductoCatalogoComponent } from './editar-producto-catalogo/editar-producto-catalogo.component';

// Required for AOT compilation
export function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [AppComponent, UsuariosComponent, CrearUsuarioComponent, EditarUsuarioComponent, CrearProveedorComponent, EditarProveedorComponent, CrearProductoCatalogoComponent, EditarProductoCatalogoComponent, CrearProyectoComponent, TareasComponent, CrearTareaComponent, EditarTareaComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    ThemeModule,
    RoutesModule,
    RouterModule,
    SharedModule,
    MatToolbarModule,
    MatDividerModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    FormlyConfigModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // Demo purposes only for GitHub Pages
    HttpClientInMemoryWebApiModule.forRoot(InMemDataService, {
      dataEncapsulation: false,
      passThruUnknownUrl: true,
    }),
  ],
  providers: [
    { provide: BASE_URL, useValue: environment.baseUrl },
    httpInterceptorProviders,
    appInitializerProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
