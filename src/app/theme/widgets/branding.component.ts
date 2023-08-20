import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <a class="d-inline-block text-nowrap r-full text-reset" href="/">
      <img src="./assets/images/isotipo.png" class="brand-logo align-middle m-2" alt="logo" />
    </a>
  `,
  styles: [
    `
      .brand-logo {
        width: 60px;
        height: 60px;
      }
    `,
  ],
})
export class BrandingComponent {}
