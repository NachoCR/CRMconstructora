import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSolicitudComponent } from './crear-solicitud.component';

describe('CrearSolicitudComponent', () => {
  let component: CrearSolicitudComponent;
  let fixture: ComponentFixture<CrearSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearSolicitudComponent]
    });
    fixture = TestBed.createComponent(CrearSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
