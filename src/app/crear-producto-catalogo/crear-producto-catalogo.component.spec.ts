import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProductoCatalogoComponent } from './crear-producto-catalogo.component';

describe('CrearProductoCatalogoComponent', () => {
  let component: CrearProductoCatalogoComponent;
  let fixture: ComponentFixture<CrearProductoCatalogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearProductoCatalogoComponent],
    });
    fixture = TestBed.createComponent(CrearProductoCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
