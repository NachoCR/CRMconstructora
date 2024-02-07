import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Token, User } from './interface';
import { Menu } from '@core';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  readonly APIUrl;

  constructor(protected http: HttpClient) {
    // this.APIUrl = 'http://73.56.189.143:7226/api';
    this.APIUrl = 'https://localhost:7226/api';

  }

  login(username: string, password: string, rememberMe = false) {
    const requestBody = {
      identifier: username,
      password: password,
    };
    return this.http.post<any>(this.APIUrl + '/Login/login', requestBody).pipe(
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
