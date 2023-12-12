import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  readonly APIUrl;

  constructor(private http: HttpClient) {
    this.APIUrl = 'http://73.56.189.143:7226/api'; //url de la sln
  }

  getSolicitudList(): Observable<any[]> {
    return this.http
      .get<any>(this.APIUrl + '/Leave', {
        headers: {},
      })
      .pipe(
        map((data: any) => {
       
          return data;
        })
      );
  }

  addSolicitud(leave: any): Observable<any> {
  
    let res;
    //leave.phone = leave.phone.toString();
    return this.http.put<any>(this.APIUrl + '/Leave/', leave).pipe(map((data: any) => data));
  }

  updateSolicitud(leave: any): Observable<any> {
    return this.http.put<any>(this.APIUrl + '/Leave/', leave).pipe(map((data: any) => data));
  }

  getSolicitudDetails(pId: number): Observable<any> {
    debugger
    return this.http.get<any>(this.APIUrl + `/Leave/GetLeaveById/${pId}`);
  }

  deleteSolicitud(leave: any) {
    let res;
  
    return this.http
      .delete<any>(this.APIUrl + '/Leave/' + leave.leaveId)
      .subscribe(data => (res = data));
  }
}
