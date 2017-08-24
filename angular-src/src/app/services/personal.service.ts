import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
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
    return this.http.put(url + 'personal/' + personal.id, personal, { headers: headers })
      .map(res => res.json())
  }

}
