import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class TipoProductoService {

  constructor(private http: Http) { }

  registerTipoProducto(tipoProducto) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'tipo_producto', tipoProducto, { headers: headers })
      .map(res => res.json());
  }
  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'tipo_producto', { headers: headers })
      .map(res => res.json());
  }
  updateTipoProducto(tipoProducto) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'tipo_producto/' + tipoProducto.id, tipoProducto, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  deleteTipoProducto(tipoProducto) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(url + 'tipo_producto/' + tipoProducto, { headers: headers })
      .map(res => res.json());
  }
}
