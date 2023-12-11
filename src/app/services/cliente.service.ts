import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  readonly APIUrl;

  constructor(private http: HttpClient) {
    this.APIUrl = 'http://73.56.189.143:7226/api'; //url de la sln
    this.APIUrl = 'http://73.56.189.143:7226/api'; //url de la sln
  }

  getClientList(): Observable<any[]> {
    return this.http
      .get<any>(this.APIUrl + '/Client', {
        headers: {},
      })
      .pipe(
        map((data: any) => {
          
          return data;
        })
      );
  }

  addCliente(client: any): Observable<any> {
    
    let res;

    return this.http.put<any>(this.APIUrl + '/Client/', client).pipe(map((data: any) => data));
  }

  updateCliente(client: any): Observable<any> {
    return this.http.put<any>(this.APIUrl + '/Client/', client).pipe(map((data: any) => data));
  }

  deleteCliente(client: any) {
    let res;
    
    return this.http
      .delete<any>(this.APIUrl + '/Client/' + client.clientId)
      .subscribe(data => (res = data));
  }
}
