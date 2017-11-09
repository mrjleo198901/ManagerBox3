import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class ProveedorService {

  constructor(private http: Http) { }

  register(proveedor) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'proveedor', proveedor, { headers: headers })
      .map(res => res.json());
  }
  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'proveedor', { headers: headers })
      .map(res => res.json());
  }
  update(proveedor) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'proveedor/' + proveedor._id, proveedor, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  delete(proveedor) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(url + 'proveedor/' + proveedor, { headers: headers })
      .map(res => res.json());
  }

}
