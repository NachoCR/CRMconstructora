import { AbstractControl } from '@angular/forms';

export class DateValidator {
  static dateNotInPast(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();

      if (selectedDate < currentDate) {
        return { dateInPast: true };
      }
    }
    return null;
  }
}