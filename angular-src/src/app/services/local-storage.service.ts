import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  setItem(globalPromos) {
    localStorage.setItem("promosActivas", JSON.stringify(globalPromos));

  }
  removeItem() {
    localStorage.removeItem("promosActivas");
  }

}
