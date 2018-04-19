import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class CiudadService {

  public url: string;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'ciudad', { headers: headers })
      .map(res => res.json());
  }
}
