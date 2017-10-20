import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class PersonalService {

  constructor(private http: Http) { }

  registerPersonal(personal) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'personal', personal, { headers: headers })
      .map(res => res.json())
  }
  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'personal', { headers: headers })
      .map(res => res.json());
  }
  updatePersonal(personal) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'personal/' + personal._id, personal, { headers: headers })
      .map(res => res.json())
  }
  getByTipo(idCargo) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('id_cargo', idCargo);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'personal/', { search: params })
      .map(res => res.json())
  }
  getByCedula(cedula) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('cedula', cedula);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'personal/', { search: params })
      .map(res => res.json())
  }
}
