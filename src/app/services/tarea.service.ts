import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  readonly APIUrl;

  constructor(private http: HttpClient) {
    this.APIUrl = 'http://73.56.189.143:7226/api'; //url de la sln
  }

  getTaskList(): Observable<any[]> {
    return this.http
      .get<any>(this.APIUrl + '/Task', {
        headers: {},
      })
      .pipe(
        map((data: any) => {
          console.log(data);
          return data;
        })
      );
  }

  addTask(task: any): Observable<any> {
    console.log(task);
    let res;
    debugger;
    return this.http.put<any>(this.APIUrl + '/Task/', task).pipe(map((data: any) => data));
  }

  updateTask(task: any): Observable<any> {
    return this.http.put<any>(this.APIUrl + '/Task/', task).pipe(map((data: any) => data));
  }

  deleteTask(task: any) {
    let res;
    console.log(task);
    return this.http
      .delete<any>(this.APIUrl + '/Task/' + task.taskId)
      .subscribe(data => (res = data));
  }
}
