import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class FacturaService {
  public url: string;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  register(factura) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'factura', factura, { headers: headers })
      .map(res => res.json());
  }
  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'factura', { headers: headers })
      .map(res => res.json());
  }

  getByDateTime(factura) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'getVentasByDate', factura, { headers: headers })
      .map(res => res.json());
  }

  getByDateCajero(factura) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'getVentasByDateCajero', factura, { headers: headers })
      .map(res => res.json());
  }

  getByDateTimeDF(factura) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'getVentasByDateDF', factura, { headers: headers })
      .map(res => res.json());
  }

  getLastOne() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'getLastOne', { headers: headers })
      .map(res => res.json());
  }

  update(factura) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + 'factura/' + factura._id, factura, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  delete(factura) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + 'factura/' + factura, { headers: headers })
      .map(res => res.json());
  }
  getByCedula(cedula) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('cedula', cedula);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(this.url + 'factura/', options)
      .map(res => res.json());
  }
  getById(idFactura) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('_id', idFactura);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(this.url + 'factura/', options)
      .map(res => res.json())
  }

}
