import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosEmpComponent } from './proyectos-emp.component';

describe('ProyectosEmpComponent', () => {
  let component: ProyectosEmpComponent;
  let fixture: ComponentFixture<ProyectosEmpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProyectosEmpComponent]
    });
    fixture = TestBed.createComponent(ProyectosEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
