import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class KardexService {

  constructor(private http: Http) { }

  register(kardex) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'compras', kardex, { headers: headers })
      .map(res => res.json());
  }
  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'compras', { headers: headers })
      .map(res => res.json());
  }
  update(kardex) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'compras/' + kardex._id, kardex, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  delete(kardex) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(url + 'compras/' + kardex, { headers: headers })
      .map(res => res.json());
  }
  getById(_id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('_id', _id);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(url + 'compras/', options)
      .map(res => res.json())
  }
}
