import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class TipoProductoService {

  constructor(private http: Http) { }

  registerTipoProducto(tipoProducto) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'tipo_producto', tipoProducto, { headers: headers })
      .map(res => res.json())
    /*.catch((error: any) => Observable.throw(error.json().error || 'Server error'));*/
  }
  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'tipo_producto', { headers: headers })
      .map(res => res.json());
  }
  updateTipoProducto(tipoProducto) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'tipo_producto/' + tipoProducto.id, tipoProducto, { headers: headers })
      .map(res => res.json())
    /*.catch((error: any) => Observable.throw(error.json().error || 'Server error'));*/
  }
  deleteTipoProducto(tipoProducto) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(url + 'tipo_producto/' + tipoProducto, { headers: headers })
      .map(res => res.json())
  }
}
