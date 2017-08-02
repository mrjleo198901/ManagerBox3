import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class TipoProductoService {

  constructor(private http: Http) { }

  registerTipoProducto(tipoProducto) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/tipo_producto', tipoProducto, { headers: headers })
      .map(res => res.json())
    /*.catch((error: any) => Observable.throw(error.json().error || 'Server error'));*/
  }
  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/api/tipo_producto', { headers: headers })
      .map(res => res.json());
  }
}
