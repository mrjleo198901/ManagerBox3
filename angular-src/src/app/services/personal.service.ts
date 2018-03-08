import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class PersonalService {
  public url: string;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  registerPersonal(personal) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'personal', personal, { headers: headers })
      .map(res => res.json())
  }

  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'personal', { headers: headers })
      .map(res => res.json());
  }

  updatePersonal(personal) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + 'personal/' + personal._id, personal, { headers: headers })
      .map(res => res.json())
  }

  getByTipo(idCargo) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('id_cargo', idCargo);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'personal/', { search: params })
      .map(res => res.json())
  }

  getByCedula(cedula) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('cedula', cedula);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'personal/', { search: params })
      .map(res => res.json())
  }

  deletePersonal(personal) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + 'personal/' + personal, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}
