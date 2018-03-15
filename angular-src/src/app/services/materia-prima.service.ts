import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class MateriaPrimaService {
  public url: string;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  register(materia_prima) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'materia_prima', materia_prima, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  update(materia_prima) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + 'materia_prima/' + materia_prima._id, materia_prima, { headers: headers })
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
    return this.http.get(this.url + 'materia_prima/', options)
      .map(res => res.json())
  }

  getById(_id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('_id', _id);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(this.url + 'materia_prima/', options)
      .map(res => res.json())
  }

  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'materia_prima', { headers: headers })
      .map(res => res.json());
  }

  delete(materia_prima) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + 'materia_prima/' + materia_prima, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}
