import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegister } from '@core/models/user-register';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {

  readonly APIUrl;
  constructor(private http: HttpClient) {
    this.APIUrl = "https://localhost:7226/api/User" 
  }

  register(user: UserRegister): Observable<any> {
    return this.http.post(this.APIUrl, user);
  }
}
