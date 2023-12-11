import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-buscar-proveedor',
  templateUrl: './buscar-proveedor.component.html',
})
export class BuscarProveedorComponent {
  @Output() filtroChangeProv: EventEmitter<string> = new EventEmitter<string>();

  filtrarProveedor(eventProv: Event): void {
    const inputValue = (eventProv.target as HTMLInputElement).value;
    this.filtroChangeProv.emit(inputValue);
  }
}
