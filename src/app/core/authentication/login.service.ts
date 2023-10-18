import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token, User } from './interface';
import { Menu } from '@core';
import { map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(protected http: HttpClient) {}

  login(username: string, password: string, rememberMe = false) {
    const apiUrl = 'https://localhost:7226/api/Login/login';
    const requestBody = {
      identifier: username,
      password: password,
    };  
    return this.http.post<any>(apiUrl, requestBody).pipe(
      map((response: any) => {
        return {
          token: response.tokenData,
          user: response.userData,
          menu: response.menuData,
        };
      })
    );
  }

  /*
  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/auth/login', { username, password, rememberMe });
  }
  */

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  me() {
    return this.http.get<User>('/user');

  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('/user/menu').pipe(map(res => res.menu));
  }
  

}