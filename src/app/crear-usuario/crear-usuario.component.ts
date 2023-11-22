import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { PasswordValidators } from 'app/password-validator';
import { UsuarioService } from 'app/services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
// import { matchpassword } from 'app/confirmed.validator';
// import { CustomValidators } from 'app/custom-validator';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss'],
})
export class CrearUsuarioComponent implements OnInit {
  // public crearUForm: FormGroup;

  crearUForm: FormGroup;
  submitted = false;
  isWorking = false;
  usuariosList: any[] = []; // Asegúrate de que usuariosList contenga tus datos
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  usuario?: UsuarioData;
  constructor(
    public dialogRef: MatDialogRef<CrearUsuarioComponent>,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    // this.crearUForm = this.crearUsuarioForm();

    this.crearUForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            PasswordValidators.patternValidator(new RegExp('(?=.*[0-9])'), {
              requiresDigit: true,
            }),
            PasswordValidators.patternValidator(new RegExp('(?=.*[A-Z])'), {
              requiresUppercase: true,
            }),
            PasswordValidators.patternValidator(new RegExp('(?=.*[a-z])'), {
              requiresLowercase: true,
            }),
            PasswordValidators.patternValidator(new RegExp('(?=.*[$@^!%*?&])'), {
              requiresSpecialChars: true,
            }),
          ])
        ),
        confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
        name: new FormControl(null, [Validators.required]),
        lastname: new FormControl(null, [Validators.required]),
        secondLastname: new FormControl(null, [Validators.required]),
        identifierId: new FormControl(null, [Validators.required]),
        identification: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ]),
        phone: new FormControl(null, [
          Validators.required,
          Validators.maxLength(8),
          this.phoneNumberValidator(),
        ]),
        roleId: new FormControl(null, [Validators.required]),
        employeeId: new FormControl(null),
        position: new FormControl(null),
        assignedProject: new FormControl(null),
      },
      {
        validators: PasswordValidators.MatchValidator,
      }
    );
  }

  checkCedulaExists() {
    const cedulaControl = this.crearUForm.get('identification');
    if (cedulaControl && this.usuariosList.length > 0) {
      const identification = cedulaControl.value;

      const cedulaExists = this.usuariosList.some(
        usuario => usuario.identification === identification
      );

      if (cedulaExists) {
        cedulaControl.setErrors({ cedulaExists: true });
      } else {
        cedulaControl.setErrors(null);
      }
    }
  }

  checkEmailExists() {
    const emailControl = this.crearUForm.get('email');
    if (emailControl && this.usuariosList.length > 0) {
      const email = emailControl.value;

      const emailExists = this.usuariosList.some(usuario => usuario.email === email);

      if (emailExists) {
        emailControl.setErrors({ emailExists: true });
      } else {
        emailControl.setErrors(null);
      }
    }
  }

  get f() {
    return this.crearUForm.controls;
  }

  get passwordValid() {
    return this.crearUForm.controls['password'].errors === null;
  }

  get requiredValid() {
    return !this.crearUForm.controls['password'].hasError('required');
  }

  get minLengthValid() {
    return !this.crearUForm.controls['password'].hasError('minlength');
  }

  get requiresDigitValid() {
    return !this.crearUForm.controls['password'].hasError('requiresDigit');
  }

  get requiresUppercaseValid() {
    return !this.crearUForm.controls['password'].hasError('requiresUppercase');
  }

  get requiresLowercaseValid() {
    return !this.crearUForm.controls['password'].hasError('requiresLowercase');
  }

  get requiresSpecialCharsValid() {
    return !this.crearUForm.controls['password'].hasError('requiresSpecialChars');
  }

  // Función de validación personalizada para el número de teléfono
  // Función de validación personalizada para el número de teléfono
  private phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumber = control.value;
      const phoneNumberPattern = /^\d{8}$/; // Asumiendo un número de teléfono de 8 dígitos

      if (!phoneNumberPattern.test(phoneNumber)) {
        return { invalidPhoneNumber: true };
      }

      return null;
    };
  }

  crear() {
    this.submitted = true;

    if (this.crearUForm.invalid) {
      return;
    }

    this.isWorking = true;
    this.crearUForm.disable();

    setTimeout(() => {
      this.isWorking = false;
      this.crearUForm.enable();
    }, 1500);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getUsuariosList();
  }

  getUsuariosList(): void {
    this.usuarioService.getUserList().subscribe((result: any) => {
      this.usuariosList = result;
      this.dataSource = new MatTableDataSource(this.usuariosList);
    });
  }
}
