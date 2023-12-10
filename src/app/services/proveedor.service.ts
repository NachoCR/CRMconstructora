import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  readonly APIUrl;

  constructor(private http: HttpClient) {
    this.APIUrl = 'http://73.56.189.143:7226/api'; //url de la sln
  }

  getProvidersList(): Observable<any[]> {
    return this.http
      .get<any>(this.APIUrl + '/Provider', {
        headers: {},
      })
      .pipe(
        map((data: any) => {
          //console.log(data);
          return data;
        })
      );
  }

  addProveedor(provider: any): Observable<any> {
    provider.contacts = [];
    console.log(provider);
    let res;
    debugger;

    return this.http.put<any>(this.APIUrl + '/Provider/', provider).pipe(map((data: any) => data));
  }

  updateProveedor(provider: any): Observable<any> {
    return this.http.put<any>(this.APIUrl + '/Provider/', provider).pipe(map((data: any) => data));
  }

  deleteProveedor(provider: any) {
    let res;
    console.log(provider);
    return this.http
      .delete<any>(this.APIUrl + '/Provider/' + provider.providerId)
      .subscribe(data => (res = data));
  }
}
