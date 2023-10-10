import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegister } from '@core/models/user-register';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {

  constructor(private http: HttpClient) {}

  register(user: UserRegister): Observable<any> {
    const apiUrl = 'https://localhost:7226/api/User'; 
    return this.http.post(apiUrl, user);
  }
}
