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

  toDescriptions(str){
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.slice(1); });
  }

  makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

}
