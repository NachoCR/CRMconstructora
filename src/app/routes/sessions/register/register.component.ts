import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';import { Router } from '@angular/router';
import { UserRegister } from '@core/models/user-register';
;
import { ApiIdentifierService } from '@shared/services/api-identifier.service';
import { ApiUserService } from '@shared/services/api-user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm = this.fb.group({
    identifierID: [''],
    identification: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
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
      //console.log('Data: ', data);
      this.identifiers = data;
    });
  }

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

  onRegister() {
    if (this.registerForm.valid) {
      const identifierID = this.registerForm.get('identifierID')?.value;
      const user: UserRegister = {
        IdentifierId: identifierID ? +identifierID : 0,
        Identification: this.registerForm.get('identification')?.value || "",
        Email: this.registerForm.get('email')?.value || "",
        Password: this.registerForm.get('password')?.value || "",
        RoleId: 1,
      };
  
      this.apiUserService.register(user).subscribe(
        (response) => {
          this.toastr.success('User registered successfully', 'Success');
          //this.registerForm.reset(); // Clear the form
          this.router.navigate(['/login']); 
        },
        (error) => {
          this.toastr.error('Error registering user', 'Error');
          console.error('Error registering user:', error);
        }
      );
    }
  }
  

}