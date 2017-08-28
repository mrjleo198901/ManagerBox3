import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class ClienteService {

  constructor(private http: Http) { }

  registerCliente(cliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'cliente', cliente, { headers: headers })
      .map(res => res.json())
  }
  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'cliente', { headers: headers })
      .map(res => res.json());
  }
  updateCliente(cliente) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'cliente/' + cliente._id, cliente, { headers: headers })
      .map(res => res.json())
  }
  getByTipo(idCargo) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('id_cargo', idCargo);
    console.log(params)
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'cliente/', { search: params })
      .map(res => res.json())
  }
}
