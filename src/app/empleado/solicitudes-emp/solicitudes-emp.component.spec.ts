import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesEmpComponent } from './solicitudes-emp.component';

describe('SolicitudesEmpComponent', () => {
  let component: SolicitudesEmpComponent;
  let fixture: ComponentFixture<SolicitudesEmpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesEmpComponent]
    });
    fixture = TestBed.createComponent(SolicitudesEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
