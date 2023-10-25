import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RecoverService } from 'app/services/recover.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss'],
})
export class RecoverComponent {
  isLoading = false;
  RecoverForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
    },
  );

  constructor(private fb: FormBuilder, private recoverService: RecoverService) {}

  matchValidator(source: string, target: string) {
    return (control: AbstractControl) => {
      const sourceControl = control.get(source)!;
      const targetControl = control.get(target)!;
      if (targetControl.errors && !targetControl.errors.mismatch) {
        return null;
      }
      if (sourceControl.value !== targetControl.value) {
        targetControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        targetControl.setErrors(null);
        return null;
      }
    };
  }

  recoverPassword(){

    let email = this.RecoverForm.get('email')?.value;
    this.isLoading = true;
    this.recoverService.recoverPassword(email).subscribe({
      next : () => {
        Swal.fire('Correo enviado correctamente!', '', 'success');
        this.isLoading = false;
      }, error:(e)=> {    
        Swal.fire('Ocurrio un problema al enviar el correo', '', 'error');
        this.isLoading = false;
      }
    });

  }

}
