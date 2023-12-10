import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  readonly APIUrl;

  constructor(private http: HttpClient) {
    //this.APIUrl = 'http://73.56.189.143:7226/api';
    this.APIUrl = 'https://localhost:7226/api';
  }

  getProductoList(): Observable<any[]> {
    return this.http
      .get<any>(this.APIUrl + '/ProviderCatalog', {
        headers: {},
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  getUnidadList(): Observable<any[]> {
    return this.http
      .get<any>(this.APIUrl + '/ProviderCatalog/GetUnits', {
        headers: {},
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  addProducto(producto: any): Observable<any> {
    let res;
    debugger;
    return this.http
      .put<any>(this.APIUrl + '/ProviderCatalog/', producto)
      .pipe(map((data: any) => data));
  }

  updateProducto(producto: any): Observable<any> {
    return this.http
      .put<any>(this.APIUrl + '/ProviderCatalog/', producto)
      .pipe(map((data: any) => data));
  }

  deleteProducto(producto: any) {
    let res;
    return this.http
      .delete<any>(this.APIUrl + `/ProviderCatalog/${producto.itemId}`)
      .subscribe(data => (res = data));
  }

  getProductoDetails(pId: number): Observable<any> {
    return this.http.get<any>(this.APIUrl + `/ProviderCatalog/GetProviderCatalogDetails/${pId}`);
  }

}
