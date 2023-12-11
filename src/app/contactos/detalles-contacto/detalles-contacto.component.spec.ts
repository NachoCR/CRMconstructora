import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesContactoComponent } from './detalles-contacto.component';

describe('DetallesContactoComponent', () => {
  let component: DetallesContactoComponent;
  let fixture: ComponentFixture<DetallesContactoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesContactoComponent]
    });
    fixture = TestBed.createComponent(DetallesContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
