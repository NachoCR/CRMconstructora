import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
  readonly APIUrl;

  constructor(private http: HttpClient) {
    this.APIUrl = 'http://73.56.189.143:7226/api'; //url de la sln
  }

  getContactoList(): Observable<any[]> {
    return this.http
      .get<any>(this.APIUrl + '/ProviderContact', {
        headers: {},
      })
      .pipe(
        map((data: any) => {
         
          return data;
        })
      );
  }

  addContacto(contacto: any): Observable<any> {
    
    let res;
    
    return this.http
      .put<any>(this.APIUrl + '/ProviderContact/', contacto)
      .pipe(map((data: any) => data));
  }

  updateContacto(contacto: any): Observable<any> {
    debugger;
    console.log(contacto)
    return this.http
      .put<any>(this.APIUrl + '/ProviderContact/', contacto)
      .pipe(map((data: any) => data));
  }

  deleteContacto(contacto: any) {
    let res;
    return this.http
      .delete<any>(this.APIUrl + '/ProviderContact/' + contacto.contactId)
      .subscribe(data => (res = data));
  }

  getContactDetails(pId: number): Observable<any> {
    return this.http.get<any>(this.APIUrl + `/ProviderContact/GetProviderContactDetails/${pId}`);
  }

  validate(validate: any): Observable<any> {
  
    return this.http.post<any>(this.APIUrl + '/ProviderContact', validate);
  }
}
