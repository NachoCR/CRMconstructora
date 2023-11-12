import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiIdentifierService {
  constructor(private http: HttpClient) {}

  getIdentifiers(): Observable<any> {
    const url = 'http://73.56.189.143:7226/api/Identifier';
    return this.http.get(url);
  }
}
