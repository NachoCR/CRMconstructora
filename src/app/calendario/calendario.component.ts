import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
})
export class CalendarioComponent implements OnInit {
  user?: User;
  loading?: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserID();
  }

  getUserID(): void {
    const subscription = this.authService.user().subscribe(user => {
      this.user = user;
      this.loading = false;
    });
  }
}
