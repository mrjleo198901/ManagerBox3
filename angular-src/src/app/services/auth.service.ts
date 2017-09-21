import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

const url = 'http://localhost:3000/api/';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  //isDev: boolean;

  constructor(public http: Http) { }

  public registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'register', user, { headers: headers })
      .map(res => res.json());

  }
  public authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //let ep = this.prepEndpoint('users/authenticate');
    return this.http.post(url + 'authenticate', user, { headers: headers })
      .map(res => res.json());
  }
  public getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    //let ep = this.prepEndpoint('users/profile');
    return this.http.get(url + 'profile', { headers: headers })
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
    localStorage.clear();
  }
}
