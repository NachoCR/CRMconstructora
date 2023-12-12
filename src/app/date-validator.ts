import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { start } from 'repl';

export class DateValidator {
  static dateNotInPast(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const currentDate = moment();

      // Convertir a formato UTC
      let dateDiff = currentDate.diff(selectedDate, 'days');

      if (dateDiff >= 3) {
        return { dateInPast: true };
      }
    }
    return null;
  }

  static dateFactory(startDate: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const start = moment(startDate); // Convertir la fecha de inicio a moment

      if (control.value) {
        const selectedDate = moment(new Date(control.value));

        // Use el form control para obtener el valor de startDate
        const dateDiff = selectedDate.diff(start, 'days'); // Diferencia en días

        if (dateDiff < 0) {
          // Si la fecha seleccionada es antes de la fecha de inicio
          return { dateInPast: true };
        }
      }

      return null;
    };
  }
}
