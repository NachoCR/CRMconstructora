import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProjectAssignmentService {

  private readonly APIUrl;

  constructor(private http: HttpClient) {
    this.APIUrl = 'http://73.56.189.143:7226/api';
  }

  getEmployeesByProjectId(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.APIUrl}/EmployeeProjectAssignment/GetEmployeesByProjectId?projectId=${projectId}`);
  }

  getProjectsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.APIUrl}/EmployeeProjectAssignment/GetProjectsByUserId?userId=${userId}`);
  }

  saveAssignmentData(assignment: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.APIUrl}/EmployeeProjectAssignment/SaveAssignmentData`, assignment);
  }

  deleteAssignmentById(assignmentId: number): Observable<number> {
    return this.http.delete<number>(`${this.APIUrl}/EmployeeProjectAssignment/DeleteAssignmentById?assignmentId=${assignmentId}`);
  }

}
