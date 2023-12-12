import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  user?: User;

  constructor(
    private authService: AuthService,
  ){}

  ngOnInit(): void{
    this.getUserID();
  }

  getUserID(): void{
    this.authService.user().subscribe(user => {
      this.user = user;
    });
  }
}
