import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { EventDef } from '@fullcalendar/core/internal';
import { TareaData } from 'app/interfaces/tarea.interface';
import { SolicitudService } from 'app/services/solicitud.service';
import { take, takeLast } from 'rxjs';
import dayGridMonth from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import esLocale from '@fullcalendar/core/locales/es';
import { LeaveDetailsDialogComponent } from '../leave-details-dialog-component/leave-details-dialog-component';

@Component({
  selector: 'app-leave-calendar',
  templateUrl: './leave-calendar.component.html',
  styleUrls: ['./leave-calendar.component.scss'],
})
export class LeaveCalendarComponent implements OnInit {
  @Input() leaveData: any;
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
      const dialogRef = this.dialog.open(LeaveDetailsDialogComponent, {
        width: '100%',
        data: { data },
      });

      dialogRef.afterClosed().subscribe();
    },
  };
  datepipe: DatePipe = new DatePipe('en-US');

  constructor(
    private leavesServices: SolicitudService,
    private dialog: MatDialog // Inject ModalService
  ) {}
  ngOnInit(): void {
    this.getLeaves();
  }

  getLeaves(): void {
    const eventList: any[] = [];

    const subscription = this.leavesServices
      .getSolicitudList()
      .pipe()
      .subscribe({
        next: (result: any[]): void => {
          for (const leave of result) {
            eventList.push({
              title: 'Salida de: ' + leave.userDTO.name,
              start: this.datepipe.transform(leave.startDate, 'YYYY-MM-dd'),
              end: this.datepipe.transform(leave.endDate, 'YYYY-MM-dd'),
              extendedProps: {
                description: leave.description,
                status: this.getStatusString(leave.statusId),
                reason: leave.managerReason,
              },
              color: this.getEventColor(leave.statusId),
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
    if (status == 5) return '#c40233 ';
    if (status == 4) return '#2e8b57';
    return '';
  }

  getStatusString(status: number) {
    if (status == 1) return 'Nuevo';
    if (status == 5) return 'Denegado ';
    if (status == 4) return 'Aprobado';
    return '';
  }

  // getTareasList(): void {
  //   const eventList: any[] = [];

  //   const subscription = this.LeaveService
  //     .getLeavesList()
  //     .pipe()
  //     .subscribe({
  //       next: (result: any[]): void => {
  //         for (const Leave of result) {
  //           eventList.push({
  //             title: Leave.name,
  //             start: this.datepipe.transform(Leave.startDate, 'YYYY-MM-dd'),
  //             end: this.datepipe.transform(Leave.dueDate, 'YYYY-MM-dd'),
  //             extendedProps: {
  //               description: Leave.description,
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
