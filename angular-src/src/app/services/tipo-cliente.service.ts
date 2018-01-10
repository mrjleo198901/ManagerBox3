import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class TipoClienteService {
  public url: string;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  registerTipoCliente(tipoCliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'tipo_cliente', tipoCliente, { headers: headers })
      .map(res => res.json())
    /*.catch((error: any) => Observable.throw(error.json().error || 'Server error'));*/
  }
  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'tipo_cliente', { headers: headers })
      .map(res => res.json());
  }
  updateTipoCliente(tipoCliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + 'tipo_cliente/' + tipoCliente._id, tipoCliente, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  deleteTipoCliente(tipoCliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + 'tipo_cliente/' + tipoCliente, { headers: headers })
      .map(res => res.json())
  }
  getByNombreProducto(nombre_producto) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('nombre_producto', nombre_producto);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(this.url + 'tipo_cliente/', options)
      .map(res => res.json())
  }
}
