import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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

  constructor(

    public dialogRef: MatDialogRef<EditarUsuarioComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) { 

      this.editarUsuarioForm = new FormGroup(
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
          Validators.minLength(8)
        ]),
        name : new FormControl(null, [Validators.required]),
        lastname : new FormControl(null, [Validators.required]),
        secondLastname : new FormControl(null, [Validators.required]),
        identifierId : new FormControl(null, [Validators.required]),
        identification : new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
        roleId : new FormControl(null, [Validators.required]),
        employeeId : new FormControl(null),
        position : new FormControl(null),
        assignedProject : new FormControl(null),
        
        

        
      },
        {
          validators: PasswordValidators.MatchValidator
        }
        )

      
        // if (this.data && this.data.user) {
        //   const userData = this.data.user;
        //   this.editarUsuarioForm.setValue({
        //     name: userData.name,
        //     lastname: userData.lastname,
        //     secondLastname: userData.secondLastname,
        //     identification: userData.identification,
        //     email: userData.email,
        //     password: userData.password,
        //     roleId: userData.roleId,
        //     employeeId: userData.employeeId,
        //     position: userData.position,
        //     assignedProject: userData.assignedProject
        //   });
        // }

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

  ngOnInit(): void {
    // this.editarUsuarioForm.get("roleId")?.disable();
    console.log(this.data);
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
