import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class ClienteService {
  public url: string;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  registerCliente(cliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'cliente', cliente, { headers: headers })
      .map(res => res.json())
  }
  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'cliente', { headers: headers })
      .map(res => res.json());
  }
  updateCliente(cliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + 'cliente/' + cliente._id, cliente, { headers: headers })
      .map(res => res.json())
  }
  getByTipo(idCargo) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('id_cargo', idCargo);
    console.log(params)
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'cliente/', { search: params })
      .map(res => res.json())
  }
  deleteCliente(cliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + 'cliente/' + cliente, { headers: headers })
      .map(res => res.json())
  }
  getByCedula(cedula) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('cedula', cedula);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(this.url + 'cliente/', options)
      .map(res => res.json())
  }
}
