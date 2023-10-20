import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'  
})
export class UsuarioService {

  readonly APIUrl;

  constructor(private http: HttpClient) { 
 this.APIUrl = "https://localhost:7226/api" //url de la sln
  }

getUserList(): Observable < any[] > {  
    return this.http.get < any > (this.APIUrl + '/User',  {
      headers: {

      }
    }).pipe(map((data: any) => {
      console.log(data);
      return data;
    } ));  
}  

addUsuario(val: any) {  
  console.log(val);
  let res;
  debugger;
  return this.http.put<any>(this.APIUrl + '/User', val).pipe(map((data : any) => data));
}  

updateUsuario(user: any):Observable < any > {  
  
  return this.http.put<any>(this.APIUrl + '/User/', user).pipe(map((data : any) => data));
}  

deleteUsuario(user: any) { 
  let res; 
  return this.http.delete<any>(this.APIUrl + '/User/' + user.userId).subscribe(data => res = data);  
}  

}
