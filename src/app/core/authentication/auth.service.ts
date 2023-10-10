import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, iif, merge, of } from 'rxjs';
import { catchError, map, share, switchMap, tap } from 'rxjs/operators';
import { filterObject, isEmptyObject } from './helpers';
import { User } from './interface';
import { LoginService } from './login.service';
import { TokenService } from './token.service';
import { ApiAuthService } from './api-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>({});
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
    private apiAuthService: ApiAuthService
  ) {}

  init() {
    return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
  }

  change() {
    return this.change$;
  }

  check() {
    return this.tokenService.valid();
  }

  /*
  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      tap(token => this.tokenService.set(token)),
      map(() => this.check())
    );
  }
  */

  login(username: string, password: string, rememberMe = false) {
    return this.apiAuthService.login(username, password).pipe(
      tap(token => {
        this.tokenService.set(token.tokenData);
        this.user$.next(token.userData);
      }),
      map(() => this.check()),
      catchError(error => {
        //console.error("Error en la solicitud de inicio de sesión:", error);
        throw error;
      })
    );
  }

  refresh() {
    return this.apiAuthService
      .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
      .pipe(
        catchError(() => of(undefined)),
        tap(token => this.tokenService.set(token)),
        map(() => this.check())
      );
  }

  logout() {
    return this.apiAuthService.logout().pipe(
      tap(() => this.tokenService.clear()),
      map(() => !this.check())
    );
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.apiAuthService.menu(), of([]));
  }

  private assignUser() {
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    return this.apiAuthService.me().pipe(tap(user => this.user$.next(user)));
  }
}
