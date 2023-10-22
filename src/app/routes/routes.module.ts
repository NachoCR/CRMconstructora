import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutesRoutingModule } from './routes-routing.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RecoverComponent } from './sessions/recover/recover.component';
import { Error403Component } from './sessions/403.component';
import { Error404Component } from './sessions/404.component';
import { Error500Component } from './sessions/500.component';
import { LandingComponent } from '../landing/landing.component';

const COMPONENTS: any[] = [
  DashboardComponent,
  LoginComponent,
  RecoverComponent,
  Error403Component,
  Error404Component,
  Error500Component,
  LandingComponent
];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, RoutesRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, LandingComponent],
})
export class RoutesModule {}
