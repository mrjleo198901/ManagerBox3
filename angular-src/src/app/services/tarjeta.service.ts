import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
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
    return this.http.get(url + 'tarjeta/', { search: params })
      .map(res => res.json())
  }
}
