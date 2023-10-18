import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { PasswordValidators } from 'app/password-validator';
// import { matchpassword } from 'app/confirmed.validator';
// import { CustomValidators } from 'app/custom-validator';


@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit {

  // public crearUForm: FormGroup;

  crearUForm: FormGroup;
  submitted = false;
  isWorking = false;

  usuario?: UsuarioData;
  constructor(
    public dialogRef: MatDialogRef<CrearUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    // this.crearUForm = this.crearUsuarioForm();

    this.crearUForm = new FormGroup(
      {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          PasswordValidators.patternValidator(new RegExp("(?=.*[0-9])"), {
            requiresDigit: true
          }),
          PasswordValidators.patternValidator(new RegExp("(?=.*[A-Z])"), {
            requiresUppercase: true
          }),
          PasswordValidators.patternValidator(new RegExp("(?=.*[a-z])"), {
            requiresLowercase: true
          }),
          PasswordValidators.patternValidator(new RegExp("(?=.*[$@^!%*?&])"), {
            requiresSpecialChars: true
          })
        ])
      ),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ])
    }
      )
  }






  get f() {
    return this.crearUForm.controls;
  }

  get passwordValid() {
    return this.crearUForm.controls["password"].errors === null;
  }

  get requiredValid() {
    return !this.crearUForm.controls["password"].hasError("required");
  }

  get minLengthValid() {
    return !this.crearUForm.controls["password"].hasError("minlength");
  }

  get requiresDigitValid() {
    return !this.crearUForm.controls["password"].hasError("requiresDigit");
  }

  get requiresUppercaseValid() {
    return !this.crearUForm.controls["password"].hasError("requiresUppercase");
  }

  get requiresLowercaseValid() {
    return !this.crearUForm.controls["password"].hasError("requiresLowercase");
  }

  get requiresSpecialCharsValid() {
    return !this.crearUForm.controls["password"].hasError("requiresSpecialChars");
  }


  onSubmit() {
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

    console.log(this.data);
  }

  crear() {
    console.log(this.crearUForm.value);
  }

}


