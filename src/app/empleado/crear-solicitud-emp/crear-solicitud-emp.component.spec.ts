import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSolicitudEmpComponent } from './crear-solicitud-emp.component';

describe('CrearSolicitudEmpComponent', () => {
  let component: CrearSolicitudEmpComponent;
  let fixture: ComponentFixture<CrearSolicitudEmpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearSolicitudEmpComponent]
    });
    fixture = TestBed.createComponent(CrearSolicitudEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
