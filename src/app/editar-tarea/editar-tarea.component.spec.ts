import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTareaComponent } from './editar-tarea.component';

describe('EditarTareaComponent', () => {
  let component: EditarTareaComponent;
  let fixture: ComponentFixture<EditarTareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarTareaComponent]
    });
    fixture = TestBed.createComponent(EditarTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
