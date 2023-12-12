import { Component } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-permissions-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class PermissionsTestComponent {
  comparedPermission: string[] = ['guest'];

  constructor(private permissionsSrv: NgxPermissionsService) {}

  getPermissions() {
    return Object.keys(this.permissionsSrv.getPermissions());
  }

  addPermission() {
    // this.permissionsSrv.loadPermissions(['admin']);
    this.permissionsSrv.addPermission('admin', () => {
      // return false;
      return new Promise<boolean>((resolve, reject) => {
        setTimeout(() => resolve(true), 2000);
      });
    });
  }

  removePermission() {
    this.permissionsSrv.removePermission('admin');
  }

  unAuthorized() {}

  authorized() {}

  changeToAdmin() {
    this.comparedPermission = ['admin'];
  }

  changeToAnotherPermission() {
    this.comparedPermission = ['awesome'];
  }

  changeToGuest() {
    this.comparedPermission = ['guest'];
  }
}
