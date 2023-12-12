import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesProductoComponent } from './detalles-producto.component';

describe('DetallesProductoComponent', () => {
  let component: DetallesProductoComponent;
  let fixture: ComponentFixture<DetallesProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesProductoComponent]
    });
    fixture = TestBed.createComponent(DetallesProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
