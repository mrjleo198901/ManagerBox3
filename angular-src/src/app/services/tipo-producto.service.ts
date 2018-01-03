import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class TipoProductoService {
  public url: string;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  registerTipoProducto(tipoProducto) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'tipo_producto', tipoProducto, { headers: headers })
      .map(res => res.json());
  }
  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'tipo_producto', { headers: headers })
      .map(res => res.json());
  }
  updateTipoProducto(tipoProducto) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + 'tipo_producto/' + tipoProducto._id, tipoProducto, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  deleteTipoProducto(tipoProducto) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + 'tipo_producto/' + tipoProducto, { headers: headers })
      .map(res => res.json());
  }
}
