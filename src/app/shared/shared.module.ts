import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { MaterialModule } from '../material.module';
import { MaterialExtensionsModule } from '../material-extensions.module';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ErrorCodeComponent } from './components/error-code/error-code.component';
import { DisableControlDirective } from './directives/disable-control.directive';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { ToObservablePipe } from './pipes/to-observable.pipe';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TaskCalendarComponent } from './components/task-calendar/task-calendar.component';
import { EventDetailsDialogComponent } from './components/event-details-dialog-component/event-details-dialog-component';
import { LeaveDetailsDialogComponent } from './components/leave-details-dialog-component/leave-details-dialog-component';
import { LeaveCalendarComponent } from './components/leave-calendar/leave-calendar.component';
const MODULES: any[] = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FormsModule,
  DragDropModule,
  MaterialModule,
  MaterialExtensionsModule,
  FormlyModule,
  FormlyMaterialModule,
  NgProgressModule,
  NgProgressRouterModule,
  NgProgressHttpModule,
  NgxPermissionsModule,
  ToastrModule,
  TranslateModule,
  FullCalendarModule,
];
const COMPONENTS: any[] = [
  BreadcrumbComponent,
  PageHeaderComponent,
  ErrorCodeComponent,
  FileUploadComponent,
  TaskCalendarComponent,
  LeaveCalendarComponent,
  EventDetailsDialogComponent,
  LeaveDetailsDialogComponent,
];
const COMPONENTS_DYNAMIC: any[] = [];
const DIRECTIVES: any[] = [DisableControlDirective];
const PIPES: any[] = [SafeUrlPipe, ToObservablePipe];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES, ...COMPONENTS, ...DIRECTIVES, ...PIPES],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC,
    ...DIRECTIVES,
    ...PIPES,
    FileUploadComponent,
    TaskCalendarComponent,
    LeaveCalendarComponent,
  ],
})
export class SharedModule {}
