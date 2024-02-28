import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
  ValidationErrors,
} from '@angular/forms';
import { UsuarioData } from 'app/interfaces/usuario.interface';
import { PasswordValidators } from 'app/password-validator';
import { UsuarioService } from 'app/services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { ProyectoService } from 'app/services/proyecto.service';
// import { matchpassword } from 'app/confirmed.validator';
// import { CustomValidators } from 'app/custom-validator';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss'],
})
export class CrearUsuarioComponent implements OnInit {
  selectedProject: any;

  transformData() {
    this.data.assignedProject = this.selectedProject.projectId;
    this.crearUForm.controls['assignedProject'].setValue(this.selectedProject.projectId);
  }
  setProjectValue(proyecto: any) {
    this.selectedProject = proyecto;
    this.data.assignedProject = proyecto.name;
    this.crearUForm.controls['assignedProject'].setValue(proyecto.name);
  }

  @ViewChild('passwordInput') passwordInput: ElementRef | undefined;
  @ViewChild('confirmPasswordInput') confirmPasswordInput: ElementRef | undefined; // public crearUForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  filteredOptions: Observable<string[]> = new Observable<string[]>(); // Inicialización

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
    private fb: FormBuilder,
    private proyectoService: ProyectoService
  ) {
    // this.crearUForm = this.crearUsuarioForm();

    this.crearUForm = new FormGroup(
      {
        email: new FormControl(null, [
          Validators.required,
          Validators.email,
          this.emailValidator,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/),
        ]),
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
        name: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
        lastname: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
        secondLastname: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
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
      },
      {
        validators: PasswordValidators.MatchValidator,
      }
    );
    this.crearUForm.get('identifierId')?.valueChanges.subscribe(value => {
      this.actualizarValidaciones(value);
    });
  }

  proyectosList: any[] = []; // Aquí almacenarás la lista de clientes

  filteredProyectosList$: Observable<any[]> | undefined;

  private actualizarValidaciones(identifierId: string) {
    const identificationControl = this.crearUForm.get('identification');
    const passportControl = this.crearUForm.get('passport');
    const juridicControl = this.crearUForm.get('juridic');

    identificationControl?.setValidators([]);
    passportControl?.setValidators([]);
    juridicControl?.setValidators([]);

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
        cedulaControl.updateValueAndValidity();
      }
    }
  }

  checkPassportExists() {
    const passportControl = this.crearUForm.get('passport');
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
    const juridicControl = this.crearUForm.get('juridic');
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

  checkEmailExists() {
    const emailControl = this.crearUForm.get('email');

    if (emailControl) {
      // Verificar que el control no sea nulo
      const email = emailControl.value;

      const emailExists = this.usuariosList.some(usuario => usuario.email === email);

      if (emailExists) {
        emailControl.setErrors({ emailExists: true });
      } else {
        // Limpiar el error si el correo no existe (puedes ajustar esto según tus necesidades)
        emailControl.setErrors(null);
        emailControl.updateValueAndValidity();
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
    this.checkCedulaExists();
    // this.crearUForm.get('passport')?.updateValueAndValidity(); // Actualiza la validación de Angular
  }

  // Añade una variable al componente para rastrear si la contraseña está visible

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    if (this.passwordInput) {
      const inputElement: HTMLInputElement = this.passwordInput.nativeElement;

      // Cambia el tipo del input entre 'password' y 'text'
      inputElement.type = this.showPassword ? 'password' : 'text';

      // Invierte el estado
      this.showPassword = !this.showPassword;
    }
  }

  toggleConfirmPasswordVisibility(): void {
    if (this.confirmPasswordInput) {
      const inputElement: HTMLInputElement = this.confirmPasswordInput.nativeElement;

      // Cambia el tipo del input entre 'password' y 'text'
      inputElement.type = this.showConfirmPassword ? 'password' : 'text';

      // Invierte el estado
      this.showConfirmPassword = !this.showConfirmPassword;
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

  checkPhoneLenght(phone: any) {}

  crear() {
    this.submitted = true;

    if (this.crearUForm.invalid) {
      return;
    }

    let selectedProjectId = this.proyectosList.find(
      x => x.name == this.crearUForm.controls['assignedProject'].value
    ).projectId;

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
    //Servicio de clientes para cargar la lista
    this.proyectoService.getProyectList().subscribe(data => {
      this.proyectosList = data;

      this.filteredProyectosList$ = this.crearUForm.get('assignedProject')?.valueChanges.pipe(
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

  cerrarModal() {
    this.dialogRef.close();
  }
}
