import { AbstractControl } from '@angular/forms';

export class DateValidator {
  static dateNotInPast(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();

      if (selectedDate <= currentDate) { // Cambiar '<' a '<=' para incluir la fecha actual
        return { dateInPast: true };
      }
    }
    return null;
  }
}