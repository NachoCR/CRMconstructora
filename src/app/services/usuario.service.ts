import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  readonly APIUrl;

  constructor(private http: HttpClient) {
    this.APIUrl = 'http://73.56.189.143:7226/api'; //url de la sln
  }

  getUserList(): Observable<any[]> {
    return this.http
      .get<any>(this.APIUrl + '/User', {
        headers: {},
      })
      .pipe(
        map((data: any) => {

          return data;
        })
      );
  }

  addUsuario(user: any): Observable<any> {

    let res;
    user.phone = user.phone.toString();
    return this.http.put<any>(this.APIUrl + '/User/', user).pipe(map((data: any) => data));
  }

  updateUsuario(user: any): Observable<any> {
    return this.http.put<any>(this.APIUrl + '/User/', user).pipe(map((data: any) => data));
  }

  async deleteUsuario(user: any): Promise<any> {
    try {
      const data = await this.http
        .delete<any>(this.APIUrl + '/User/' + user.userId)
        .toPromise();

      return data;
    } catch (error) {
       // You might want to handle or rethrow the error based on your needs
    }
  }
}
