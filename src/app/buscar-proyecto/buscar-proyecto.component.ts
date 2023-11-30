import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-buscar-proyecto',
  templateUrl: './buscar-proyecto.component.html',
})
export class BuscarProyectoComponent {
  @Output() filtroChange: EventEmitter<string> = new EventEmitter<string>();

  filtrarProyectos(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filtroChange.emit(inputValue);
  }
}
