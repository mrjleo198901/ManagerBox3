import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class TarjetaService {

  constructor(private http: Http) { }

  register(tarjeta) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'tarjeta', tarjeta, { headers: headers })
      .map(res => res.json());
  }
  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'tarjeta', { headers: headers })
      .map(res => res.json());
  }
  update(tarjeta) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'tarjeta/' + tarjeta._id, tarjeta, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  delete(tarjeta) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(url + 'tarjeta/' + tarjeta, { headers: headers })
      .map(res => res.json());
  }
  getByCI(cedula) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('cedula', cedula);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'tarjeta/' + cedula, { search: params })
      .map(res => res.json())
  }
  /*getByNumero(numero) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('numero', numero);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'tarjeta/', { search: params })
      .map(res => res.json())
  }*/
  getByNumero(numero) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('numero', numero);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(url + 'tarjeta/', options)
      .map(res => res.json())
  }

  getBookById(cedula: string) {
    let myHeaders = new Headers();
    myHeaders.set('Content-Type', 'application/json');
    myHeaders.set('Accept', 'text/plain');
    let myParams = new URLSearchParams();
    myParams.set('cedula', cedula);
    let options = new RequestOptions({ headers: myHeaders, params: myParams });
    return this.http.get(url + 'tarjeta/', options)
      .map(res => res.json());
  }
}
