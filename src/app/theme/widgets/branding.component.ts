import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <a class="d-inline-block text-nowrap r-full text-reset" href="/">
      <img
        [src]="logoUrl"
        class="brand-logo align-middle m-2"
        alt="logo"
        [style.width]="isSidebarCollapsed ? '40px' : '40px'"
        [style.height]="isSidebarCollapsed ? '40px' : '40px'"
      />
    </a>
  `,
  styles: [
    `
.brand-logo {
  width: 40px;
  height: 40px;
  max-height: 100%; // Agrega esta línea\
  object-fit: contain;  // Ajusta esta línea según tus necesidades

}
    `,
  ],
})
export class BrandingComponent {
  @Input() isSidebarCollapsed = false;

  // Ruta a tu imagen de logo (ajústalo según tu estructura de proyecto)
  logoUrl = '../../assets/images/isotipo.png';
}
