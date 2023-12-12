import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProyectoComponent } from './crear-proyecto.component';

describe('CrearProyectoComponent', () => {
  let component: CrearProyectoComponent;
  let fixture: ComponentFixture<CrearProyectoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearProyectoComponent],
    });
    fixture = TestBed.createComponent(CrearProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
