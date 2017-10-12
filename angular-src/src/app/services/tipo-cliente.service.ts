import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class TipoClienteService {

  constructor(private http: Http) { }

  registerTipoCliente(tipoCliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'tipo_cliente', tipoCliente, { headers: headers })
      .map(res => res.json())
    /*.catch((error: any) => Observable.throw(error.json().error || 'Server error'));*/
  }
  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'tipo_cliente', { headers: headers })
      .map(res => res.json());
  }
  updateTipoCliente(tipoCliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'tipo_cliente/' + tipoCliente.id, tipoCliente, { headers: headers })
      .map(res => res.json())
    /*.catch((error: any) => Observable.throw(error.json().error || 'Server error'));*/
  }
  deleteTipoCliente(tipoCliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(url + 'tipo_cliente/' + tipoCliente, { headers: headers })
      .map(res => res.json())
  }
}
