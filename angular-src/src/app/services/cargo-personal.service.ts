import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class CargoPersonalService {

  constructor(private http: Http) { }

  registerCargoPersonal(cargoPersonal) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'cargo_personal', cargoPersonal, { headers: headers })
      .map(res => res.json())
  }
  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'cargo_personal', { headers: headers })
      .map(res => res.json());
  }
  updateCargoPersonal(cargoPersonal) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'cargo_personal/' + cargoPersonal.id, cargoPersonal, { headers: headers })
      .map(res => res.json())
  }

}
