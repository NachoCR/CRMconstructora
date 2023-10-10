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

// get(uri: string) {
//   return this.http.get(`${this.APIUrl}/${uri}`);
// }

// post(uri: string, payload: Object) {
//   return this.http.post(`${this.APIUrl}/${uri}`, payload);
// }

// patch(uri: string, payload: Object) {
//   return this.http.patch(`${this.APIUrl}/${uri}`, payload);
// }

// delete(uri: string) {
//   return this.http.delete(`${this.APIUrl}/${uri}`);
// }



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
  return this.http.post(this.APIUrl + '/User', val);  
}  

updateUsuario(user: any) {  
  let result;
  this.http.put<any>(this.APIUrl + '/User/' + user.userId, user).subscribe(data => result = data);
}  

deleteUsuario(val: any) {  
  return this.http.delete(this.APIUrl + '/usuarios/' + val);  
}  

}
