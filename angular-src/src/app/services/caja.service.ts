import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class CajaService {

  constructor(private http: Http) { }

  register(caja) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'caja', caja, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  update(caja) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'caja/' + caja._id, caja, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getByNombre(nombre) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('nombre', nombre);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(url + 'caja/', options)
      .map(res => res.json())
  }

  getById(_id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('_id', _id);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(url + 'caja/', options)
      .map(res => res.json())
  }

  getActiveCaja(montoF) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('montoF', montoF);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(url + 'caja/', options)
      .map(res => res.json())
  }

  getActiveCajaById(montoF, idUser) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('montoF', montoF);
    params.set('idUser', idUser);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(url + 'caja/', options)
      .map(res => res.json())
  }

  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'caja', { headers: headers })
      .map(res => res.json());
  }

  delete(cover) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(url + 'caja/' + cover, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  public sendCorte(user) {
    console.log(user)
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'sendcorte', user, { headers: headers })
      .map(res => res.json());
  }

}
