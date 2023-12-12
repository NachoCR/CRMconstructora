import { Component, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@core/authentication';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel">
      <img class="matero-user-panel-avatar" [src]="user.avatar" alt="avatar" width="64" />
      <h4 class="matero-user-panel-name">{{ user.name }}</h4>
      <h5 class="matero-user-panel-email" *ngIf="isEmailLong; then longMail else shortEmail"  [ngStyle]="{ 'display': isSidebarCollapsed ? 'none' : 'block' }" > {{ user.email }}</h5>

      <ng-template #shortEmail>
        <h5 class="matero-user-panel-email" style="font-size: medium;">{{ user.email }}</h5>
      </ng-template>
      <ng-template #longMail>
        <h5 class="matero-user-panel-email-long" style="font-size: small; word-break: initial;">{{ user.email }}</h5>
      </ng-template>
      <div class="matero-user-panel-icons">
        <button mat-icon-button (click)="logout()" matTooltip="{{ 'Cerrar sesión' | translate }}">
          <mat-icon class="icon-18">exit_to_app</mat-icon>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./user-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserPanelComponent implements OnInit {
  user!: User;
  isEmailLong: boolean = false;
  emailLength: number = 0;
  isSidebarCollapsed = false;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.user().subscribe(user => (this.user = user));
    this.checkEmailLength();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user) {
      this.checkEmailLength();
    }
  }
  

  private checkEmailLength() {
    this.emailLength = (this.user.email ?? '').length;
    const maxEmailLength = 20; // Puedes ajustar esto según tus necesidades
    this.isEmailLong = this.emailLength > maxEmailLength;
  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/'));
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/'));
  }
}
