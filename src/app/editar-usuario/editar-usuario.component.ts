import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { PasswordValidators } from 'app/password-validator';
import { ProyectoService } from 'app/services/proyecto.service';
import { UsuarioService } from 'app/services/usuario.service';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
})
export class EditarUsuarioComponent implements OnInit {
  selectedProject: any;

  transformData() {
    this.data.assignedProject = this.selectedProject.projectId;
    this.editarUsuarioForm.controls['assignedProject'].setValue(this.selectedProject.projectId);
  }
  setProjectValue(proyecto: any) {
    this.selectedProject = proyecto;
    this.data.assignedProject = proyecto.name;
    this.editarUsuarioForm.controls['assignedProject'].setValue(proyecto.name);
  }

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  filteredOptions: Observable<string[]> = new Observable<string[]>(); // Inicialización

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
    public dialogRef: MatDialogRef<EditarUsuarioComponent>,
    private usuarioService: UsuarioService,

    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private proyectoService: ProyectoService
  ) {
    this.cedulaOriginal = data.identification;
    this.correoOriginal = data.email;

    this.editarUsuarioForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required]),
      lastname: new FormControl(null, [Validators.required]),
      secondLastname: new FormControl(null, [Validators.required]),
      identifierId: new FormControl(null, [Validators.required]),
      identification: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{9}$/),
        Validators.minLength(9),
        Validators.maxLength(9),
      ]),
      passport: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{9}$/),
        Validators.minLength(9),
        Validators.maxLength(9),
      ]),
      juridic: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{11}$/),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8),
        Validators.pattern(/^\d{8}$/),
      ]),
      roleId: new FormControl(null, [Validators.required]),
      employeeId: new FormControl(null),
      position: new FormControl(null),
      assignedProject: new FormControl(null),
    });
    this.editarUsuarioForm.get('identifierId')?.valueChanges.subscribe(value => {
      this.actualizarValidaciones(value);
    });
  }

  proyectosList: any[] = [];
  filteredProyectosList$: Observable<any[]> | undefined;

  private actualizarValidaciones(identifierId: string) {
    const identificationControl = this.editarUsuarioForm.get('identification');
    const passportControl = this.editarUsuarioForm.get('passport');
    const juridicControl = this.editarUsuarioForm.get('juridic');

    identificationControl?.setValidators([]);
    passportControl?.setValidators([]);
    juridicControl?.setValidators([]);

    console.log(identifierId);
    if (identifierId === '1') {
      identificationControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{9}$/),
        Validators.minLength(9),
        Validators.maxLength(9),
      ]);
    } else if (identifierId === '2') {
      passportControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{9}$/),
        Validators.minLength(9),
        Validators.maxLength(9),
      ]);
    } else if (identifierId === '3') {
      juridicControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{11}$/),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]);
    }

    identificationControl?.updateValueAndValidity();
    passportControl?.updateValueAndValidity();
    juridicControl?.updateValueAndValidity();
  }

  // Agrega una función de validación personalizada
  emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value as string;
    if (email && email.indexOf('@') === -1) {
      return { invalidEmail: true };
    }
    return null;
  }

  checkCedulaExists() {
    const cedulaControl = this.editarUsuarioForm.get('identification');
    debugger;
    if (cedulaControl && this.usuariosList.length > 0) {
      const identification = cedulaControl.value;

      const cedulaExists = this.usuariosList.some(
        usuario => usuario.identification === identification
      );
      if (this.cedulaOriginal === identification) {
        if (cedulaExists) {
          cedulaControl.setErrors({ cedulaExists: true });
        } else {
          cedulaControl.setErrors(null);
          cedulaControl.updateValueAndValidity();
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

      if (this.correoOriginal === email) {
        if (emailExists) {
          emailControl.setErrors({ emailExists: true });
        } else {
          emailControl.setErrors(null);
          emailControl.updateValueAndValidity();
        }
      }
    }
  }

  checkPassportExists() {
    const passportControl = this.editarUsuarioForm.get('passport');
    if (passportControl && this.usuariosList.length > 0) {
      const passport = passportControl.value;

      const passportExists = this.usuariosList.some(usuario => usuario.identification === passport);

      if (passportExists) {
        passportControl.setErrors({ passportExists: true });
      } else {
        passportControl.setErrors(null);
        passportControl.updateValueAndValidity();
      }
    }
  }

  checkJuridicExists() {
    const juridicControl = this.editarUsuarioForm.get('juridic');
    if (juridicControl && this.usuariosList.length > 0) {
      const juridic = juridicControl.value;

      const juridicExists = this.usuariosList.some(usuario => usuario.identification === juridic);

      if (juridicExists) {
        juridicControl.setErrors({ juridicExists: true });
      } else {
        juridicControl.setErrors(null);
        juridicControl.updateValueAndValidity();
      }
    }
  }

  onEmailBlur() {
    this.checkEmailExists();
    // this.crearUForm.get('email')?.updateValueAndValidity(); // Actualiza la validación de Angular
  }

  onJuridicaBlur() {
    this.checkJuridicExists();
    // this.crearUForm.get('juridic')?.updateValueAndValidity(); // Actualiza la validación de Angular
  }

  onCedulaBlur() {
    this.checkCedulaExists();
    // this.crearUForm.get('identification')?.updateValueAndValidity(); // Actualiza la validación de Angular
  }
  onPassportBlur() {
    debugger;
    this.checkCedulaExists();
    // this.crearUForm.get('passport')?.updateValueAndValidity(); // Actualiza la validación de Angular
  }

  get f() {
    return this.editarUsuarioForm.controls;
  }

  get passwordValid() {
    return this.editarUsuarioForm.controls['password'].errors === null;
  }

  get requiredValid() {
    return !this.editarUsuarioForm.controls['password'].hasError('required');
  }

  get minLengthValid() {
    return !this.editarUsuarioForm.controls['password'].hasError('minlength');
  }

  get requiresDigitValid() {
    return !this.editarUsuarioForm.controls['password'].hasError('requiresDigit');
  }

  get requiresUppercaseValid() {
    return !this.editarUsuarioForm.controls['password'].hasError('requiresUppercase');
  }

  get requiresLowercaseValid() {
    return !this.editarUsuarioForm.controls['password'].hasError('requiresLowercase');
  }

  get requiresSpecialCharsValid() {
    return !this.editarUsuarioForm.controls['password'].hasError('requiresSpecialChars');
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

    //Servicio de clientes para cargar la lista
    this.proyectoService.getProyectList().subscribe(data => {
      this.proyectosList = data;

      this.filteredProyectosList$ = this.editarUsuarioForm
        .get('assignedProject')
        ?.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map(value => this._filterProyectos(value))
        );
    });
  }

  //Filtro proyectos
  private _filterProyectos(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.proyectosList.filter(proyecto => proyecto.name.toLowerCase().includes(filterValue));
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
