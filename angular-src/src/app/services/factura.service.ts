import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class FacturaService {

  constructor(private http: Http) { }

  register(factura) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'factura', factura, { headers: headers })
      .map(res => res.json());
  }
  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'factura', { headers: headers })
      .map(res => res.json());
  }
  update(factura) {
    console.log(factura)
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'factura/' + factura._id, factura, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  delete(factura) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(url + 'factura/' + factura, { headers: headers })
      .map(res => res.json());
  }
  getByCedula(cedula) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('cedula', cedula);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(url + 'factura/', options)
      .map(res => res.json())
  }
  getById(idFactura) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('_id', idFactura);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(url + 'factura/', options)
      .map(res => res.json())
  }

}
