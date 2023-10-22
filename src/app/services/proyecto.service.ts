import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'  
})
export class ProyectoService {

  readonly APIUrl;

  constructor(private http: HttpClient) { 
 this.APIUrl = "https://localhost:7226/api" //url de la sln
  }

getProyectList(): Observable < any[] > {  
    return this.http.get < any > (this.APIUrl + '/Project',  {
      headers: {

      }
    }).pipe(map((data: any) => {
      console.log(data);
      return data;
    } ));  
}  

addProyecto(project: any):Observable < any > {    
  console.log(project);
  let res;
  debugger;
  return this.http.put<any>(this.APIUrl + '/Project/', project).pipe(map((data : any) => data));
}  

updateProyecto(project: any):Observable < any > {  
  
  return this.http.put<any>(this.APIUrl + '/Project/', project).pipe(map((data : any) => data));
}  

deleteProyecto(project: any) { 
  let res; 
  console.log(project);
  return this.http.delete<any>(this.APIUrl + '/Project/' + project.projectId).subscribe(data => res = data);  
}  

}
