import { AbstractControl } from '@angular/forms';

export class DateValidator {
  static dateNotInPast(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();

      // Convertir a formato UTC
      const selectedDateUTC = new Date(selectedDate.toUTCString());
      const currentDateUTC = new Date(currentDate.toUTCString());

      if (selectedDateUTC <= currentDateUTC) {
        return { dateInPast: true };
      }
    }
    return null;
  }
}
