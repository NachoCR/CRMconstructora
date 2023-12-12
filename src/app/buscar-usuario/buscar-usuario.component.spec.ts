import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarUsuarioComponent } from './buscar-usuario.component';

describe('BuscarUsuarioComponent', () => {
  let component: BuscarUsuarioComponent;
  let fixture: ComponentFixture<BuscarUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscarUsuarioComponent]
    });
    fixture = TestBed.createComponent(BuscarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
