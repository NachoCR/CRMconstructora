import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  readonly APIUrl;

  constructor(private http: HttpClient) {
    this.APIUrl = 'http://73.56.189.143:7226/api'; //url de la sln
  }

  getTasksList(): Observable<any[]> {
    return this.http
      .get<any>(this.APIUrl + '/Task', {
        headers: {},
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }
  getTasksByUser(pId: number): Observable<any[]> {
    return this.http
      .get<any>(this.APIUrl + '/Task/GetTasksByUserId', {
        headers: {},
        params: { pId },
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }
}
