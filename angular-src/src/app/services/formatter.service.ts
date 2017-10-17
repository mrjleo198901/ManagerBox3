import { Injectable } from '@angular/core';

@Injectable()
export class FormatterService {

  constructor() { }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }

  toLowerCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toLowerCase() + txt.substr(1).toLowerCase(); });
  }

}
