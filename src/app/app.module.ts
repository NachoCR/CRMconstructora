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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from '@env/environment';
import { BASE_URL, httpInterceptorProviders, appInitializerProviders } from '@core';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemDataService } from '@shared/in-mem/in-mem-data.service';


import { CatalogoProveedorComponent } from './catalogo-proveedor/catalogo-proveedor.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FilterPipe, ProyectosComponent } from './proyectos/proyectos.component';
import { FilterPipe2, ProveedoresComponent } from './proveedores/proveedores.component';
import { ContactosComponent  } from './contactos/contactos/contactos.component';
import { TareaComponent } from './tareas/tareas.component';
import { OrdenesCompraComponent } from './ordenes-compra/ordenes-compra.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';
import { CrearProveedorComponent } from './crear-proveedor/crear-proveedor.component';
import { EditarProveedorComponent } from './editar-proveedor/editar-proveedor.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { CrearProyectoComponent } from './crear-proyecto/crear-proyecto.component';
import { CrearTareaComponent } from './crear-tarea/crear-tarea.component';
import { EditarTareaComponent } from './editar-tarea/editar-tarea.component';
import { CrearProductoCatalogoComponent } from './crear-producto-catalogo/crear-producto-catalogo.component';
import { EditarProductoCatalogoComponent } from './editar-producto-catalogo/editar-producto-catalogo.component';
import { CrearContactoComponent } from './contactos/crear-contacto/crear-contacto.component';
import { EditarContactoComponent } from './contactos/editar-contacto/editar-contacto.component';
import { EditarProyectoComponent } from './editar-proyecto/editar-proyecto.component';
import { BuscarProyectoComponent } from './buscar-proyecto/buscar-proyecto.component';
import { BuscarProveedorComponent } from './buscar-proveedor/buscar-proveedor.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DetallesContactoComponent } from './contactos/detalles-contacto/detalles-contacto.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProductosComponent } from './productos/productos/productos.component';
import { DetallesProductoComponent } from './productos/detalles-producto/detalles-producto.component';
import { CrearProductoComponent } from './productos/crear-producto/crear-producto.component';
import { EditarProductoComponent } from './productos/editar-producto/editar-producto.component';




// Required for AOT compilation
export function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    FilterPipe2,
    ContactosComponent,
    CrearContactoComponent,
    EditarContactoComponent,
    BuscarProyectoComponent,
    BuscarProveedorComponent,
    UsuariosComponent,
    CrearUsuarioComponent,
    EditarUsuarioComponent,
    CrearProveedorComponent,
    EditarProveedorComponent,
    CrearProductoCatalogoComponent,
    EditarProductoCatalogoComponent,
    ProyectosComponent,
    CrearProyectoComponent,
    EditarProyectoComponent,
    EditarProyectoComponent,
    TareaComponent,
    CrearTareaComponent,
    ProveedoresComponent,
    CrearProveedorComponent,
    EditarProveedorComponent,
    EditarTareaComponent,
    DetallesContactoComponent,
    ProductosComponent,
    DetallesProductoComponent,
    CrearProductoComponent,
    DetallesProductoComponent,
    EditarProductoComponent

  ],

  imports: [
    MatPaginatorModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    MatAutocompleteModule,
    MatSelectModule,
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
export class AppModule {}
