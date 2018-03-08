import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class CargoPersonalService {
  public url: string;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  registerCargoPersonal(cargoPersonal) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'cargo_personal', cargoPersonal, { headers: headers })
      .map(res => res.json())
  }
  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'cargo_personal', { headers: headers })
      .map(res => res.json());
  }
  updateCargoPersonal(cargoPersonal) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + 'cargo_personal/' + cargoPersonal.id, cargoPersonal, { headers: headers })
      .map(res => res.json())
  }

  deleteCargoPersonal(personal) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + 'cargo_personal/' + personal, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}
