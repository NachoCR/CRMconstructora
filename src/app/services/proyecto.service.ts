import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  readonly APIUrl;

  constructor(private http: HttpClient) {
    this.APIUrl = 'http://73.56.189.143:7226/api'; //url de la sln
  }

  getProyectList(): Observable<any[]> {
    return this.http
      .get<any>(this.APIUrl + '/Project', {
        headers: {},
      })
      .pipe(
        map((data: any) => {

          return data;
        })
      );
  }

  addProyecto(project: any): Observable<any> {
    project.tasks = [];
    return this.http.put<any>(this.APIUrl + '/Project/', project).pipe(map((data: any) => data));
  }

  updateProyecto(project: any): Observable<any> {
    return this.http.put<any>(this.APIUrl + '/Project/', project).pipe(map((data: any) => data));
  }

  deleteProyecto(project: any) {
    let res;

    return this.http
      .delete<any>(this.APIUrl + '/Project/' + project.projectId)
      .subscribe(data => (res = data));
  }

  getProyectoDetails(pId: number): Observable<any> {
    return this.http.get<any>(this.APIUrl + `/Project/GetProjectById?pId=${pId}`);
  }
}
