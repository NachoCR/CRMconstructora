import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { PasswordValidators } from 'app/password-validator';
import { UsuarioService } from 'app/services/usuario.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {

  //@Input user?: UsuarioData
  editarUsuarioForm: FormGroup;
  isPasswordEdited = false;
  submitted = false;
  isWorking = false;
  editData: any;

  usuario?: UsuarioData;
  usuariosList: any[] = []; // Asegúrate de que usuariosList contenga tus datos
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  cedulaOriginal: any;
  correoOriginal: any;

  constructor(

    public dialogRef: MatDialogRef<EditarUsuarioComponent>,private usuarioService: UsuarioService, 

    @Inject(MAT_DIALOG_DATA) public data: any) { 

       this.cedulaOriginal = data.identification;
       this.correoOriginal = data.email;


      this.editarUsuarioForm = new FormGroup(
        {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8)
          ])
        ),
        name : new FormControl(null, [Validators.required]),
        lastname : new FormControl(null, [Validators.required]),
        secondLastname : new FormControl(null, [Validators.required]),
        identifierId : new FormControl(null, [Validators.required]),
        identification : new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
        phone : new FormControl(null, [Validators.required, Validators.maxLength(8), this.phoneNumberValidator()]),
        roleId : new FormControl(null, [Validators.required]),
        employeeId : new FormControl(null),
        position : new FormControl(null),
        assignedProject : new FormControl(null),
      }
        )

    }

    checkCedulaExists() {
      
      const cedulaControl = this.editarUsuarioForm.get('identification');
      debugger;
      if (cedulaControl && this.usuariosList.length > 0) {
        const identification = cedulaControl.value;
  
        const cedulaExists = this.usuariosList.some(usuario => usuario.identification === identification);
        if(this.cedulaOriginal != identification){
          if (cedulaExists) {
            cedulaControl.setErrors({ 'cedulaExists': true });
          } else {
            cedulaControl.setErrors(null);
          }
        }
      }
    }
  
    checkEmailExists() {
      const emailControl = this.editarUsuarioForm.get('email');
      debugger;
      if (emailControl && this.usuariosList.length > 0) {
        const email = emailControl.value;
  
        const emailExists = this.usuariosList.some(usuario => usuario.email === email);
  
        if(this.correoOriginal != email){
          if (emailExists) {
            emailControl.setErrors({ '': true });
          } else {
            emailControl.setErrors(null);
          }

        // if (emailExists) {
        //   emailControl.setErrors({ 'emailExists': true });
        // } else {
        //   emailControl.setErrors(null);
        // }
      }
    }
  }

  


    get f() {
      return this.editarUsuarioForm.controls;
    }
  
    get passwordValid() {
      return this.editarUsuarioForm.controls["password"].errors === null;
    }
  
    get requiredValid() {
      return !this.editarUsuarioForm.controls["password"].hasError("required");
    }
  
    get minLengthValid() {
      return !this.editarUsuarioForm.controls["password"].hasError("minlength");
    }
  
    get requiresDigitValid() {
      return !this.editarUsuarioForm.controls["password"].hasError("requiresDigit");
    }
  
    get requiresUppercaseValid() {
      return !this.editarUsuarioForm.controls["password"].hasError("requiresUppercase");
    }
  
    get requiresLowercaseValid() {
      return !this.editarUsuarioForm.controls["password"].hasError("requiresLowercase");
    }
  
    get requiresSpecialCharsValid() {
      return !this.editarUsuarioForm.controls["password"].hasError("requiresSpecialChars");
    }
  
  
    editar() {
      this.submitted = true;
  
      if (this.editarUsuarioForm.invalid) {
        return;
      }
  
      this.isWorking = true;
      this.editarUsuarioForm.disable();
  
      setTimeout(() => {
        this.isWorking = false;
        this.editarUsuarioForm.enable();
      }, 1500);
    }



  onNoClick(): void {
    this.dialogRef.close();
  }

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

  ngOnInit(): void {
    this.getUsuariosList();
      }
    
    
      getUsuariosList(): void {
        this.usuarioService.getUserList().subscribe((result: any) => {
          this.usuariosList = result;
          this.dataSource = new MatTableDataSource(this.usuariosList);
        });
      }


  passwordChange(): void {
    this.isPasswordEdited = true;
    const confirmPasswordControl = this.editarUsuarioForm.get('confirmPassword');

    if (confirmPasswordControl) {
      // Agregar el validador personalizado
      confirmPasswordControl.setValidators([Validators.required]);
      // Actualizar la validación
      confirmPasswordControl.updateValueAndValidity();
    }  
  }
}
