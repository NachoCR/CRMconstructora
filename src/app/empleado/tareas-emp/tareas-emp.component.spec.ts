import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasEmpComponent } from './tareas-emp.component';

describe('TareasEmpComponent', () => {
  let component: TareasEmpComponent;
  let fixture: ComponentFixture<TareasEmpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TareasEmpComponent]
    });
    fixture = TestBed.createComponent(TareasEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
