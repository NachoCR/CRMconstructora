import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiRolService {

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any> {
    const url = 'https://73.56.189.143:7226/api/Role';
    return this.http.get(url);
  }
}
