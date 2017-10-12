import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class ActiveCardsService {

  constructor(private http: Http) { }

  register(active_cards) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'active_cards', active_cards, { headers: headers })
      .map(res => res.json())
  }

  searchByCard(cardNumber) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('cardNumber', cardNumber);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(url + 'active_cards/', options)
      .map(res => res.json())
  }

  delete(active_cards) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(url + 'active_cards/' + active_cards, { headers: headers })
      .map(res => res.json())
  }

}
