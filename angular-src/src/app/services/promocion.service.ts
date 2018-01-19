import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class PromocionService {
  public url: string;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  register(promocion) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'promociones', promocion, { headers: headers })
      .map(res => res.json());
  }
  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'promociones', { headers: headers })
      .map(res => res.json());
  }
  update(promocion) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + 'promociones/' + promocion._id, promocion, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  delete(promocion) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + 'promociones/' + promocion, { headers: headers })
      .map(res => res.json());
  }
  getById(_id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('_id', _id);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(this.url + 'promociones/', options)
      .map(res => res.json())
  }

}
