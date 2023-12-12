import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { EventDef } from '@fullcalendar/core/internal';
import { TareaData } from 'app/interfaces/tarea.interface';
import { TasksService } from 'app/services/tasks-service';
import { take, takeLast } from 'rxjs';
import dayGridMonth from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { EventDetailsDialogComponent } from '../event-details-dialog-component/event-details-dialog-component';

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.scss'],
})
export class TaskCalendarComponent {
  @Input() taskData: any;
  @Input() userId?: number;
  eventsData: any[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [multiMonthPlugin, dayGridMonth],
    initialView: 'dayGridMonth',
    // views: {
    //   multiMonthFourMonth: {
    //     type: 'multiMonth',
    //     duration: { months: 3 },
    //   },
    // },
    eventInteractive: true,
    eventMinHeight: 1000,
    weekends: false,
    events: this.eventsData,
    eventClick: event => {
      const dialogRef = this.dialog
        .open(EventDetailsDialogComponent)
        .componentInstance.eventData(event);

      dialogRef.afterClosed().subscribe();
    },
  };
  datepipe: DatePipe = new DatePipe('en-US');

  constructor(
    private taskService: TasksService,
    private dialog: MatDialog // Inject ModalService
  ) {
    if (this.userId) {
      this.getTareasByUser(this.userId);
    }
  }
  getTareasByUser(pId: number): void {
    const eventList: any[] = [];

    const subscription = this.taskService
      .getTasksByUser(pId)
      .pipe()
      .subscribe({
        next: (result: any[]): void => {
          for (const task of result) {
            eventList.push({
              title: task.name,
              start: this.datepipe.transform(task.startDate, 'YYYY-MM-dd'),
              end: this.datepipe.transform(task.dueDate, 'YYYY-MM-dd'),
              extendedProps: {
                description: task.description,
                status: task.statusstring,
              },
            });
          }
          this.calendarOptions.events = eventList;
        },
        error: (error: Error): void => {
          console.error(error);
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }

  // getTareasList(): void {
  //   const eventList: any[] = [];

  //   const subscription = this.taskService
  //     .getTasksList()
  //     .pipe()
  //     .subscribe({
  //       next: (result: any[]): void => {
  //         for (const task of result) {
  //           eventList.push({
  //             title: task.name,
  //             start: this.datepipe.transform(task.startDate, 'YYYY-MM-dd'),
  //             end: this.datepipe.transform(task.dueDate, 'YYYY-MM-dd'),
  //             extendedProps: {
  //               description: task.description,
  //             },
  //           });
  //         }
  //         this.calendarOptions.events = eventList;
  //       },
  //       error: (error: Error): void => {
  //         console.error(error);
  //       },
  //       complete: () => {
  //         subscription.unsubscribe();
  //       },
  //     });
  // }
}
