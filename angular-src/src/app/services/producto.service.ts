import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

const url = 'http://localhost:3000/api/';

@Injectable()
export class ProductoService {

  constructor(private http: Http) { }

  registerProducto(producto) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url + 'producto', producto, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateProducto(producto) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(url + 'producto/' + producto._id, producto, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAll() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(url + 'producto', { headers: headers })
      .map(res => res.json());
  }

  uploadImage(files) {
    const formData: FormData = new FormData();
    formData.append('uploadFile', files, files.name);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return this.http.post(url + 'imagen', formData, options)
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteProducto(producto) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.delete(url + 'producto/' + producto, { headers: headers })
      .map(res => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}
