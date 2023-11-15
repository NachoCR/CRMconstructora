import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  readonly APIUrl;

  constructor(private http: HttpClient) {
    this.APIUrl = "http://73.56.189.143:7226/api" //url de la sln
  }

  getClientList(): Observable<any[]> {
    debugger;
    return this.http
      .get<any>(this.APIUrl + '/Client', {
        headers: {},
      })
      .pipe(
        map((data: any) => {
          console.log(data);
          return data;
        })
      );
  }

  addCliente(client: any): Observable<any> {
    console.log(client);
    let res;
    debugger;
    return this.http.put<any>(this.APIUrl + '/Client/', client).pipe(map((data: any) => data));
  }

  updateCliente(client: any): Observable<any> {
    return this.http.put<any>(this.APIUrl + '/Client/', client).pipe(map((data: any) => data));
  }

  deleteCliente(client: any) {
    let res;
    console.log(client);
    return this.http
      .delete<any>(this.APIUrl + '/Client/' + client.clientId)
      .subscribe(data => (res = data));
  }
}
