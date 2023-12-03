import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProyectoComponent } from './editar-proyecto.component';

describe('EditarProyectoComponent', () => {
  let component: EditarProyectoComponent;
  let fixture: ComponentFixture<EditarProyectoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarProyectoComponent],
    });
    fixture = TestBed.createComponent(EditarProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
