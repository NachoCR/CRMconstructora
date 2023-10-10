import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token, User } from './interface';
import { Menu } from '@core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiAuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const apiUrl = 'https://localhost:7226/api/Login/login';
    const requestBody = {
      identifier: username,
      password: password,
    };   
    return this.http.post(apiUrl, requestBody);
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  me() {
    return this.http.get<User>('/user');
    //return this.http.get<User>('/me');
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('/me/menu').pipe(map(res => res.menu));
  }
}
