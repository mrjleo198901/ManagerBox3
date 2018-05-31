import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numFactura'
})
export class NumFacturaPipe implements PipeTransform {

  transform(value: any, args?: any): any {

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
