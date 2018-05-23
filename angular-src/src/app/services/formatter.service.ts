import { Injectable } from '@angular/core';

@Injectable()
export class FormatterService {

  constructor() { }

  toUpperCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toUpperCase(); });
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  }

  toLowerCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toLowerCase() + txt.substr(1).toLowerCase(); });
  }

  toDescriptions(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.slice(1); });
  }

  makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  makeCodNum() {
    var text = "";
    var possible = "0123456789";
    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  modulo11(codigo) {
    let sum0 = codigo[0];
    let sum1 = codigo[1];
    let sum2 = codigo[2];
    let sum3 = codigo[3];
    let sum4 = codigo[4];
    let sum5 = codigo[5];
    let sum6 = codigo[6];
    let sum7 = codigo[7];

    let sumTotal = (sum0 * 3) + (sum1 * 2) + (sum2 * 7) + (sum3 * 6) + (sum4 * 5) + (sum5 * 4) + (sum6 * 3) + (sum7 * 2);
    let resp1 = (sumTotal % 11);
    let total = 11 - resp1;
    return total;
  }

  dinamicModulo11(codigo) {
    let n = codigo.length;
    let vec = [];
    for (let i = 0; i < n; i++) {
      vec.push(codigo[i]);
    }
    let acum = 0;
    let ind = 2;
    for (let j = n - 1; j >= 0; j--) {
      if (ind > 7) {
        ind = 2;
      }
      acum += vec[j] * ind;
      ind++;
    }
    let resp1 = (acum % 11);
    let total = 11 - resp1;
    return total;
  }

  checkDigit11 = function (n, x) {

    var l = n.length, i = 0, j = (l % 8), v = 0;

    for (i = 0, l = l - 1; i < l; i++) {
      v += parseInt(n[i], 10) * j;
      j = (j == 2) ? 9 : --j;
    }

    return v = (v % 11 < 2) ? (x || 0) : (11 - (v % 11));
  };

  add(x, y) {
    return +(x + y).toFixed(12);
  }

  sub(x, y) {
    return +(x - y).toFixed(12);
  }

  times(x, y) {
    return +(x * y).toFixed(12);
  }

  div(x, y) {
    return +(x / y).toFixed(12);
  }

  formatNumFact(value) {

    if (value.length < 3) {
      return value
    } else {
      if (value.length == 3) {
        return value.substring(0, 3) + '-';
      }

      if (value.length == 4) {
        return value.substring(0, 3) + '-' + value.substring(3, 4);
      }
      if (value.length == 5) {
        return value.substring(0, 3) + '-' + value.substring(3, 5);
      }
      if (value.length == 6) {
        return value.substring(0, 3) + '-' + value.substring(3, 6);
      }

      if (value.length == 7) {
        return value.substring(0, 3) + '-' + value.substring(3, 6) + '-';
      }

      if (value.length == 8) {
        return value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 8);
      }
      if (value.length == 9) {
        return value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 9);
      }
      if (value.length == 10) {
        return value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
      }
      if (value.length == 11) {
        return value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 11);
      }
      if (value.length == 12) {
        return value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 12);
      }
      if (value.length == 13) {
        return value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 13);
      }
      if (value.length == 14) {
        return value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 14);
      }
      if (value.length == 15) {
        return value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 15);
      }
      if (value.length == 16) {
        return value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 16);
      }
    }

  }
}
