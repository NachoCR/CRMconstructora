import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, merge, of } from 'rxjs';
import { catchError, map, share, switchMap, tap } from 'rxjs/operators';
import { filterObject, isEmptyObject } from './helpers';
import { User } from './interface';
import { LoginService } from './login.service';
import { TokenService } from './token.service';
import { MenuService } from '@core/bootstrap/menu.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  private change$ = merge(
    this.tokenService.change(),
    this.tokenService.refresh().pipe(switchMap(() => this.refresh()))
  ).pipe(
    switchMap(() => this.assignUser()),
    share()
  );

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private menuService: MenuService
  ) {}

  init() {
    return new Promise<void>((resolve) => this.change$.subscribe(() => resolve()));
  }

  change() {
    return this.change$;
  }

  check() {
    return this.tokenService.valid();
  }

  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      tap(({ token, user, menu }) => {
        this.tokenService.set(token);
        this.user$.next(user);
        this.menuService.set(menu);
        this.saveUserToLocalStorage(user);
      }),
      map(() => this.check())
    );
  }

  refresh() {
    return this.loginService
      .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
      .pipe(
        catchError(() => of(undefined)),
        tap((token) => this.tokenService.set(token)),
        map(() => this.check())
      );
  }

  logout() {
    return this.loginService.logout().pipe(
      tap(() => {
        this.tokenService.clear();
        this.saveUserToLocalStorage({});
      }),
      map(() => !this.check())
    );
  }

  user() {
    //console.log('User:', this.user$.value);
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), of([]));
  }

  private assignUser() {
    if (!this.check()) {
      return of({}).pipe(tap((user) => {
        this.user$.next(user);
        this.saveUserToLocalStorage(user);
      }));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    return this.loginService.me().pipe(tap((user) => {
      this.user$.next(user);
      this.saveUserToLocalStorage(user);
    }));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : {};
  }

  private saveUserToLocalStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
