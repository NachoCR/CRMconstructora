import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiIdentifierService {

  constructor(private http: HttpClient) {}

  getIdentifiers(): Observable<any> {
    const url = 'https://localhost:7226/api/Identifier';
    return this.http.get(url);
  }
}
