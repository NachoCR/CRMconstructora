import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecoverService {
  readonly APIUrl;

  constructor(private http: HttpClient) {
    this.APIUrl = 'http://73.56.189.143:7226/api'; //url de la sln
  }

  recoverPassword(email: any): Observable<any> {
    return this.http
      .post<any>(this.APIUrl + '/passwordrecovery/recoverpassword', { email: email })
      .pipe(map((data: any) => data));
  }
}
