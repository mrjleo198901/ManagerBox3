import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class ConfigurationService {
  public url: string;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  register(conf) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'configuracion', conf, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  update(conf) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + 'configuracion/' + conf._id, conf, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'configuracion', { headers: headers })
      .map(res => res.json());
  }

  getByDesc(descripcion) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('descripcion', descripcion);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'configuracion/', { search: params })
      .map(res => res.json())
  }
}
