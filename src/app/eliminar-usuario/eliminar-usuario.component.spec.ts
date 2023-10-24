import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarUsuarioComponent } from './eliminar-usuario.component';

describe('EliminarUsuarioComponent', () => {
  let component: EliminarUsuarioComponent;
  let fixture: ComponentFixture<EliminarUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarUsuarioComponent]
    });
    fixture = TestBed.createComponent(EliminarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
