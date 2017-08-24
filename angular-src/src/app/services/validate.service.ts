import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user) {
    if (user.name == undefined || user.email == undefined || user.username == undefined || user.password == undefined ||
      user.name == "" || user.email == "" || user.username == "" || user.password == "") {
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validateClient(client) {
    if (client.cedula == undefined || client.nombre == undefined || client.apellido == undefined ||
      client.telefono == undefined || client.email == undefined || client.fechaNacimientoString == undefined ||
      client.cedula == "" || client.nombre == "" || client.apellido == "" ||
      client.telefono == "" || client.email == "" || client.fechaNacimientoString == "") {
      return false;
    } else {
      return true;
    }
  }

  validateTipoProducto(tipoProducto) {
    if (tipoProducto.desc_tipo_producto == undefined ||
      tipoProducto.desc_tipo_producto == "") {
      return false;
    } else {
      return true;
    }
  }

  validateProducto(producto) {
    if (producto.nombre == "" || producto.precio_unitario == null || producto.utilidad == null
      || producto.cant_existente == null || producto.selected_tipo_producto == "") {
      return false;
    } else {
      return true;
    }
  }

  customValidateProducto(producto) {
    let res = true;
    if (producto.nombre == "") {
      document.getElementById("nombrePC").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.precio_unitario == null) {
      document.getElementById("puPC").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.utilidad == null) {
      document.getElementById("utilidadPC").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.cant_existente == null) {
      document.getElementById("cantPC").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.id_tipo_producto == undefined) {
      document.getElementById("tipoPC").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.path == undefined) {
      document.getElementById("filesC").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  customValidateProductoU(producto) {
    let res = true;
    if (producto.nombre == "") {
      document.getElementById("nombrePU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.precio_unitario == null) {
      document.getElementById("puPU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.utilidad == null) {
      document.getElementById("utilidadPU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.cant_existente == null) {
      document.getElementById("cantPU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.id_tipo_producto == undefined) {
      document.getElementById("tipoPU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.path == undefined) {
      document.getElementById("filesU").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validadorCedula(cedula) {
    let message;
    let type;

    //Preguntamos si la cedula consta de 10 digitos
    if (cedula.length == 10) {

      //Obtenemos el digito de la region que sonlos dos primeros digitos
      var digito_region = cedula.substring(0, 2);

      //Pregunto si la region existe ecuador se divide en 24 regiones
      if (digito_region >= 1 && digito_region <= 24) {

        // Extraigo el ultimo digito
        var ultimo_digito = cedula.substring(9, 10);

        //Agrupo todos los pares y los sumo
        var pares = parseInt(cedula.substring(1, 2)) + parseInt(cedula.substring(3, 4)) + parseInt(cedula.substring(5, 6)) + parseInt(cedula.substring(7, 8));

        //Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
        var numero1 = cedula.substring(0, 1);
        numero1 = (numero1 * 2);
        if (numero1 > 9) { numero1 = (numero1 - 9); }

        var numero3 = cedula.substring(2, 3);
        numero3 = (numero3 * 2);
        if (numero3 > 9) { numero3 = (numero3 - 9); }

        var numero5 = cedula.substring(4, 5);
        numero5 = (numero5 * 2);
        if (numero5 > 9) { numero5 = (numero5 - 9); }

        var numero7 = cedula.substring(6, 7);
        numero7 = (numero7 * 2);
        if (numero7 > 9) { numero7 = (numero7 - 9); }

        var numero9 = cedula.substring(8, 9);
        numero9 = (numero9 * 2);
        if (numero9 > 9) { numero9 = (numero9 - 9); }

        var impares = numero1 + numero3 + numero5 + numero7 + numero9;

        //Suma total
        var suma_total = (pares + impares);

        //extraemos el primero digito
        var primer_digito_suma = String(suma_total).substring(0, 1);

        //Obtenemos la decena inmediata
        var decena = (parseInt(primer_digito_suma) + 1) * 10;

        //Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
        var digito_validador = decena - suma_total;

        //Si el digito validador es = a 10 toma el valor de 0
        if (digito_validador == 10)
          var digito_validador = 0;

        //Validamos que el digito validador sea igual al de la cedula
        if (digito_validador == ultimo_digito) {
          message = 'La cedula: ' + cedula + ' es correcta';
          type = "success";
        } else {
          message = 'La cedula: ' + cedula + ' es incorrecta';
          type = "danger";
        }

      } else {

        // imprimimos en consola si la region no pertenece
        message = 'Esta cedula no pertenece a ninguna region';
        type = "danger";
      }
    } else {

      //imprimimos en consola si la cedula tiene mas o menos de 10 digitos
      message = 'Esta cedula tiene menos de 10 Digitos';
      type = "danger";
    }
    return message + "/" + type;
  }

  formatDate(date) {
    var monthNames = [
      "Enero", "Febrero", "Marzo",
      "Abril", "Mayo", "Junio", "Julio",
      "Agosto", "Septiembre", "Octubre",
      "Noviembre", "Diciembre"
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    console.log(day + ' ' + monthNames[monthIndex] + ' ' + year);
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  getScreen() {
    var viewportwidth;
    var viewportheight;
    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
      viewportwidth = window.innerWidth,
        viewportheight = window.innerHeight
    }
    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined'
      && typeof document.documentElement.clientWidth !=
      'undefined' && document.documentElement.clientWidth != 0) {
      viewportwidth = document.documentElement.clientWidth,
        viewportheight = document.documentElement.clientHeight
    }
    // older versions of IE
    else {
      viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
        viewportheight = document.getElementsByTagName('body')[0].clientHeight
    }
    //document.write('<p>Your viewport width is ' + viewportwidth + 'x' + viewportheight + '</p>');
    console.log(viewportwidth + 'x' + viewportheight);
  }

}
