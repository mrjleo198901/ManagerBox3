import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class ActiveCardsService {
  public url: string;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  register(active_cards) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'active_cards', active_cards, { headers: headers })
      .map(res => res.json())
  }

  searchByCard(cardNumber) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('cardNumber', cardNumber);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(this.url + 'active_cards/', options)
      .map(res => res.json())
  }

  searchByCardActive(cardNumber) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('cardNumber', cardNumber);
    params.set('estado', '1');
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(this.url + 'active_cards/', options)
      .map(res => res.json())
  }

  searchByCI(ci) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('ci', ci);
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(this.url + 'active_cards/', options)
      .map(res => res.json())
  }

  delete(active_cards) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.url + 'active_cards/' + active_cards, { headers: headers })
      .map(res => res.json())
  }

  update(active_cards) {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + 'active_cards/' + active_cards._id, active_cards, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'active_cards', { headers: headers })
      .map(res => res.json());
  }

  getAllActives() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.set('Accept', 'text/plain');
    let params: URLSearchParams = new URLSearchParams();
    params.set('estado', '1');
    let options = new RequestOptions({ headers: headers, params: params });
    return this.http.get(this.url + 'active_cards/', options)
      .map(res => res.json())
  }

}
