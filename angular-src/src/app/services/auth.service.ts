import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { GLOBAL } from '../components/globals';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  public url: string;
  //isDev: boolean;

  constructor(private http: Http) {
    this.url = GLOBAL.url;
  }

  public registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'register', user, { headers: headers })
      .map(res => res.json());

  }
  public authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //let ep = this.prepEndpoint('users/authenticate');
    return this.http.post(this.url + 'authenticate', user, { headers: headers })
      .map(res => res.json());
  }
  public getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    //let ep = this.prepEndpoint('users/profile');
    return this.http.get(this.url + 'profile', { headers: headers })
      .map(res => res.json());
  }
  public storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  public imprimir(token, user) {
    console.log(token);
    console.log(user)

  }
  public loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
  public loggedIn() {
    return tokenNotExpired('id_token');
  }

  public logout() {
    this.authToken = null;
    this.user = null;
    //localStorage.clear();
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
  }

  public sendEmail(user) {
    console.log(user)
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'sendmail', user, { headers: headers })
      .map(res => res.json());
  }

  public updateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + 'updateUser', user, { headers: headers })
      .map(res => res.json());
  }

  public getAll() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + 'usersList', { headers: headers })
      .map(res => res.json());
  }

}
