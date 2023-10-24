import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';import { Router } from '@angular/router';
import { UserRegister } from '@core/models/user-register';
import { ApiUserService } from 'app/services/api-user.service';
import { ApiIdentifierService } from 'app/services/api-identifier.service';
import { ToastrService } from 'ngx-toastr';
import * as bcrypt from 'bcryptjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm = this.fb.group({
    identifierID: ['1', [Validators.required]],
    identification: ['402560159', [Validators.required]],
    name: ['Anthony', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    lastname: ['Fajardo', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    secondLastname: ['Villachica', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    email: ['antho@gmail.com', [Validators.required, Validators.email]],
    password: ['a123', [Validators.required, this.customPasswordValidator]],
    confirmPassword: ['a123', [Validators.required]],
  });

  identifiers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private apiIdentifierService: ApiIdentifierService,
    private apiUserService: ApiUserService,
    private toastr: ToastrService,
    private router: Router 
  ) {}

  ngOnInit() {
    this.apiIdentifierService.getIdentifiers().subscribe((data) => {
      this.identifiers = data;
    });
    this.registerForm.setValidators(this.matchValidator('password', 'confirmPassword'));

  }

  customPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
      return { 'passwordPattern': true };
    }
    return null;
  }

  matchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl) => {
      const sourceControl = control.get(source);
      const targetControl = control.get(target);
  
      if (sourceControl && targetControl && sourceControl.value !== targetControl.value) {
        targetControl?.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        targetControl?.setErrors(null);
        return null;
      }
    };
  }  

  async onRegister() {
    if (this.registerForm.valid) {
      const identifierID = this.registerForm.get('identifierID')?.value;
      const plainPassword = this.registerForm.get('password')?.value ?? '';

      const salt = bcrypt.genSaltSync(10);
      const pass = bcrypt.hashSync(plainPassword, salt);

      const user: UserRegister = {
        IdentifierId: identifierID ? +identifierID : 0,
        Identification: this.registerForm.get('identification')?.value || "",
        Name: this.registerForm.get('name')?.value || "",
        Lastname: this.registerForm.get('lastname')?.value || "",
        SecondLastname: this.registerForm.get('secondLastname')?.value || "",
        Email: this.registerForm.get('email')?.value || "",
        Password: pass,
        RoleId: 3,
      };
  
      this.apiUserService.register(user).subscribe(
        (response) => {
          this.toastr.success('El usuario se ha registrado correctamente', 'Success');
          // this.registerForm.reset(); 
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error.status === 400 && error.error && error.error.errors) {
            const errorResponse = error.error;
            for (const key in errorResponse.errors) {
              if (errorResponse.errors.hasOwnProperty(key)) {
                const errorMessage = errorResponse.errors[key].errors[0].errorMessage;
                this.toastr.error(errorMessage, 'Error');
              }
            }
          } else {
            this.toastr.error('Error con el registro del usuario', 'Error');
            //console.error('Error con el registro del usuario:', error);
          }
        }
      );     
    }
  }

  cancelForm() {
    this.registerForm.reset();
  }

}