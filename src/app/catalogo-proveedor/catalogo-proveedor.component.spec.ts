import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoProveedorComponent } from './catalogo-proveedor.component';

describe('CatalogoProveedorComponent', () => {
  let component: CatalogoProveedorComponent;
  let fixture: ComponentFixture<CatalogoProveedorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogoProveedorComponent]
    });
    fixture = TestBed.createComponent(CatalogoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
