import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-buscar-proveedor',
  templateUrl: './buscar-proveedor.component.html',
})
export class BuscarProveedorComponent {
  @Output() filtroChangeProv: EventEmitter<string> = new EventEmitter<string>();

  filtrarProveedor(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filtroChangeProv.emit(inputValue);
  }
}
