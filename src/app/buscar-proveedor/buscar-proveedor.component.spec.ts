import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarProveedorComponent } from './buscar-proveedor.component';

describe('BuscarProveedorComponent', () => {
  let component: BuscarProveedorComponent;
  let fixture: ComponentFixture<BuscarProveedorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscarProveedorComponent]
    });
    fixture = TestBed.createComponent(BuscarProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
