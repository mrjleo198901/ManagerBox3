import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class PromocionService {

  constructor(private http: Http) { }

  register(promocion) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'promociones', promocion, { headers: headers })
      .map(res => res.json());
  }
  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'promociones', { headers: headers })
      .map(res => res.json());
  }
  update(promocion) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'promociones/' + promocion._id, promocion, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  delete(promocion) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(url + 'promociones/' + promocion, { headers: headers })
      .map(res => res.json());
  }
  getByCedula(_id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('_id', _id);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(url + 'promociones/', options)
      .map(res => res.json())
  }

}
