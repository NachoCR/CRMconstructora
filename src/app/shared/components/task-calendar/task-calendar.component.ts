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
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.scss'],
})
export class TaskCalendarComponent implements OnInit {
  @Input() taskData: any;
  @Input() userId?: any;
  eventsData: any[] = [];
  calendarOptions: CalendarOptions = {
    locale: esLocale,
    titleFormat: { year: 'numeric', month: 'long' },
    titleRangeSeparator: '-',
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
    eventClick: info => {
      info.jsEvent.preventDefault();
      const data = info.event;
      const dialogRef = this.dialog.open(EventDetailsDialogComponent, {
        width: '100%',
        data: { data },
      });

      dialogRef.afterClosed().subscribe();
    },
  };
  datepipe: DatePipe = new DatePipe('en-US');

  constructor(
    private taskService: TasksService,
    private dialog: MatDialog // Inject ModalService
  ) {}
  ngOnInit(): void {
    if (Number.parseInt(this.userId)) {
      this.getTareasByUser(Number.parseInt(this.userId));
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
              end: this.datepipe.transform(task.dateDue, 'YYYY-MM-dd'),
              extendedProps: {
                description: task.description,
                status: task.status,
              },
              color: this.getEventColor(task.statusId),
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

  getEventColor(status: number) {
    if (status == 1) return '#7851a9';
    if (status == 2) return '#c40233 ';
    if (status == 3) return '#2e8b57';
    return '';
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
