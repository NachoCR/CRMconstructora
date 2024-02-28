import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
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
    private cdr: ChangeDetectorRef,

    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private proyectoService: ProyectoService
  ) {
    this.cedulaOriginal = data.identification;
    this.correoOriginal = data.email;

    this.editarUsuarioForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      lastname: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      secondLastname: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      identifierId: new FormControl(null, [Validators.required]),
      identification: new FormControl(null, [
        
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
  identifierType : string = "";
  identifierLength? : number;

  private actualizarValidaciones(identifierId: number) {
    if (identifierId == 1) {
      this.setIdentifierValues("Cédula", 9,9);
    } else if (identifierId == 2) {
      this.setIdentifierValues("Pasaporte", 9,9);
    } else if (identifierId == 3) {
      this.setIdentifierValues("Cédula Jurídica", 11,11);
    }
  
  }


  setIdentifierValues(identifierType : string, identifierMinLength : number, identifierMaxLength : number){
    const identificationControl = this.editarUsuarioForm.get('identification');
    identificationControl?.setValidators([]);
    let pattern : any;

    if(identifierMaxLength == 9){
      pattern = /^\d{9}$/
    }
    if(identifierMaxLength == 11){
      pattern = /^\d{11}$/
    }

    identificationControl?.setValidators([
      Validators.required,
      Validators.pattern(pattern),
      Validators.minLength(identifierMinLength),
      Validators.maxLength(identifierMaxLength),
    ]);
    this.identifierType = identifierType;
    this.identifierLength = identifierMaxLength;


    identificationControl?.updateValueAndValidity();
  }

  test(value: any){
    const identificationControl = this.editarUsuarioForm.get('identification');
    identificationControl?.setValue(value)
  }

  // Agrega una función de validación personalizada
  emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value as string;
    if (email && email.indexOf('@') === -1) {
      return { invalidEmail: true };
    }
    return null;
  }


  checkIdentificationExists() {
    const identificationControl = this.editarUsuarioForm.get('identification');
    
    if (identificationControl && this.usuariosList.length > 0) {
      const identification = identificationControl.value;

      const identificationExists = this.usuariosList.some(
        usuario => usuario.identification === identification
      );
      if (this.cedulaOriginal != identification) {
        if (identificationExists) {
          identificationControl.setErrors({ identificationExists: true });
        } else {
          identificationControl.setErrors(null);
          identificationControl.updateValueAndValidity();
        }
      }
    }
  }

  checkEmailExists() {
    const emailControl = this.editarUsuarioForm.get('email');
    
    if (emailControl && this.usuariosList.length > 0) {
      const email = emailControl.value;

      const emailExists = this.usuariosList.some(usuario => usuario.email === email);

      if (this.correoOriginal != email) {
        if (emailExists) {
          emailControl.setErrors({ emailExists: true });
        } else {
          emailControl.setErrors(null);
          emailControl.updateValueAndValidity();
        }
      }
    }
  }



  onEmailBlur() {
    this.checkEmailExists();
    // this.crearUForm.get('email')?.updateValueAndValidity(); // Actualiza la validación de Angular
  }

  onIdentificationBlur() {
    this.checkIdentificationExists();
    // this.crearUForm.get('identification')?.updateValueAndValidity(); // Actualiza la validación de Angular
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
  cerrarModal() {
    this.dialogRef.close();
  }
}

