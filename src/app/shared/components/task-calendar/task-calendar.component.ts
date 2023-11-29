import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { EventDef } from '@fullcalendar/core/internal';
import { TareasData } from 'app/interfaces/tareas.interface';
import { TasksService } from 'app/services/tasks-service';
import { take } from 'rxjs';
// import dayGridMonth from '@fullcalendar/daygrid';
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

  eventsData: any[] = [];
  calendarOptions: CalendarOptions = {
    plugins: [multiMonthPlugin],
    initialView: 'multiMonthFourMonth',
    views: {
      multiMonthFourMonth: {
        type: 'multiMonth',
        duration: { months: 3 },
      },
    },
    eventInteractive: true,
    eventMinHeight: 1000,
    weekends: false,
    events: this.eventsData,
    // eventClick: event => {
    //   const dialogRef = this.dialog
    //     .open(EventDetailsDialogComponent)
    //     .componentInstance.eventData(event);

    //   dialogRef.afterClosed().subscribe();
    // },
  };
  datepipe: DatePipe = new DatePipe('en-US');

  // @Output() imagePostedURLEvent = new EventEmitter<string>();

  constructor(
    private taskService: TasksService,
    private dialog: MatDialog // Inject ModalService
  ) {
    this.getTareasList();
  }

  getTareasList() {
    this.taskService
      .getTasksList()
      .pipe()
      .subscribe(result => {
        const eventList = result.map(taskData => {
          return {
            title: taskData.name,
            start: this.datepipe.transform(taskData.startDate, 'YYYY-MM-dd')?.toString(),
            end: this.datepipe.transform(taskData.dateDue, 'YYYY-MM-dd')?.toString(),
            extendedProps: {
              description: taskData.description,
            },
          };
        });
        this.calendarOptions.events = eventList;

        console.log(eventList);
      });
  }
}
