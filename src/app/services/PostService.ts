import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'  
})
export class PostService {
  readonly APIUrl = "http://localhost:53535/api" //url de la sln

  constructor(private http: HttpClient) { }

  getUserList(): Observable < any[] > {  
    return this.http.get < any > (this.APIUrl + '/usuarios');  
}  

addUsuario(val: any) {  
  return this.http.post(this.APIUrl + '/usuarios', val);  
}  

updateUsuario(val: any) {  
  return this.http.put(this.APIUrl + '/usuarios', val);  
}  
deleteUsuario(val: any) {  
  return this.http.delete(this.APIUrl + '/usuarios/' + val);  
}  

}
