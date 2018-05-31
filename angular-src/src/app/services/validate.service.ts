import { Injectable } from '@angular/core';
import { MessageGrowlService } from './message-growl.service';
import { DatePipe } from '@angular/common';

@Injectable()
export class ValidateService {

  constructor(private messageGrowlService: MessageGrowlService,
    private datePipe: DatePipe) {
    let a = "xaipoGay"
  }

  validateRegister(user) {
    if (user.name == undefined || user.email == undefined || user.username == undefined || user.npass == undefined ||
      user.name == "" || user.email == "" || user.username == "" || user.npass == "") {
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
    if (client.id_tipo_cliente == "" || client.cedula == "" || client.nombre == "" || client.apellido == ""
      || client.fecha_nacimiento == "") {
      return false;
    } else {
      return true;
    }
  }

  validateTipoProducto(tipoProducto) {
    let res = true;
    if (tipoProducto.desc_tipo_producto == "") {
      document.getElementById("descTPC").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (tipoProducto.path == "") {
      document.getElementById("filesTP").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (tipoProducto.desc_tipo_producto == "") {
      document.getElementById("descTPU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (tipoProducto.path == "") {
      document.getElementById("filesTPU").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validateProveedor(proveedor) {
    let res = true;
    if (proveedor.nombre_proveedor == "") {
      document.getElementById("nombreProve").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (proveedor.ruc == "") {
      document.getElementById("rucProve").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validateKardex(kardex) {
    let res = true;
    if (kardex.desc_producto == "") {
      document.getElementById("desc_productoK").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.num_factura == "") {
      document.getElementById("num_facturaK").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.fecha == "") {
      document.getElementById("fechaK").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.proveedor == "") {
      document.getElementById("selectProve").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.cantidad == 0) {
      document.getElementById("cantK").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.total == 0) {
      document.getElementById("totalK").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.contenido == 0) {
      document.getElementById("contK").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validateKardex1(kardex) {
    let res = true;
    if (kardex.desc_producto == "" || kardex.desc_producto == undefined) {
      document.getElementById("desc_productoK1").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.num_factura == "") {
      document.getElementById("num_facturaK").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.fecha == "") {
      document.getElementById("fechaK").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.proveedor == "") {
      document.getElementById("selectProve").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.cantidad == 0) {
      document.getElementById("cantK").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.total == 0) {
      document.getElementById("totalK").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.contenido == 0) {
      document.getElementById("contK").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validateKardexU(kardex) {
    let res = true;
    if (kardex.desc_producto == "") {
      document.getElementById("desc_productoKU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.num_factura == "") {
      document.getElementById("num_facturaKU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.fecha == "") {
      document.getElementById("fechaKU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.proveedor == "") {
      document.getElementById("selectProve").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.cantidad == 0) {
      document.getElementById("cantKU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.total == 0) {
      document.getElementById("totalKU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.contenido == 0) {
      document.getElementById("contKU").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validateKardex1U(kardex) {
    let res = true;
    if (kardex.desc_producto == "" || kardex.desc_producto == undefined) {
      document.getElementById("desc_productoK1U").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.num_factura == "") {
      document.getElementById("num_facturaKU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.fecha == "") {
      document.getElementById("fechaKU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.proveedor == "") {
      document.getElementById("selectProve").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.cantidad == 0) {
      document.getElementById("cantKU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.total == 0) {
      document.getElementById("totalKU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (kardex.contenido == 0) {
      document.getElementById("contKU").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validatePromocion(promo) {
    let res = true;
    if (promo.nombre == "") {
      document.getElementById("nombrePromo").style.borderColor = "#FE2E2E";
      this.messageGrowlService.notify('error', 'Error', 'Campos Vacíos!');
      res = false;
    }
    return res;
  }

  validatePromocionU(promo) {
    let res = true;
    if (promo.nombre == "") {
      document.getElementById("nombrePromoU").style.borderColor = "#FE2E2E";
      this.messageGrowlService.notify('error', 'Error', 'Campos Vacíos!');
      res = false;
    }
    if (promo.desde <= 0) {
      document.getElementById("desdePromoU").style.borderColor = "#FE2E2E";
      this.messageGrowlService.notify('error', 'Error', 'Campo desde no puede ser 0!');
      res = false;
    }
    if (promo.hasta <= 0) {
      document.getElementById("hastaPromoU").style.borderColor = "#FE2E2E";
      this.messageGrowlService.notify('error', 'Error', 'Campo hasta no puede ser 0!');
      res = false;
    }
    return res;
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
    if (producto.precio_costo == 0) {
      document.getElementById("pcPC").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.precio_venta == 0) {
      document.getElementById("pvPC").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.id_tipo_producto == undefined) {
      document.getElementById("tipoPC").style.borderColor = "#FE2E2E";
      res = false;
    }
    /*if (producto.contenido == 0) {
      document.getElementById("contPC").style.borderColor = "#FE2E2E";
      res = false;
    }*/
    return res;
  }

  customValidateProductoU(producto) {
    let res = true;
    if (producto.nombre == "") {
      document.getElementById("nombrePU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.precio_costo == null) {
      document.getElementById("pcPU").style.borderColor = "#FE2E2E";
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
    /*if (producto.path == undefined) {
      document.getElementById("filesU").style.borderColor = "#FE2E2E";
      res = false;
    }*/
    return res;
  }

  customValidateProductoGasto(producto) {
    let res = true;
    if (producto.nombre == "") {
      document.getElementById("nombrePC1").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.precio_costo == 0) {
      document.getElementById("pcPC").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  customValidateProductoGastoU(producto) {
    let res = true;
    if (producto.nombre == "") {
      document.getElementById("nombrePU").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (producto.precio_costo == 0) {
      document.getElementById("pcPU").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  customValidateCover(cover) {
    let res = true;
    if (cover.nombre == '') {
      document.getElementById("nombre").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  customValidateCoverU(cover) {
    let res = true;
    if (cover.nombre == '') {
      document.getElementById("nombreU").style.borderColor = "#FE2E2E";
      res = false;
    }
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

  validarRucCedula(campo) {
    var numero = campo;
    var suma = 0;
    var residuo = 0;
    var pri = false;
    var pub = false;
    var nat = false;
    var modulo = 11;

    /* Aqui almacenamos los digitos de la cedula en variables. */
    var d1 = numero.substring(0, 1);
    var d2 = numero.substring(1, 2);
    var d3 = numero.substring(2, 3);
    var d4 = numero.substring(3, 4);
    var d5 = numero.substring(4, 5);
    var d6 = numero.substring(5, 6);
    var d7 = numero.substring(6, 7);
    var d8 = numero.substring(7, 8);
    var d9 = numero.substring(8, 9);
    var d10 = numero.substring(9, 10);

    //comparo que el numero de provincias sean los correctos (24 para ecuador).  
    if (numero.substring(0, 2) > 24) {
      return false;
    }

    /* El tercer digito es: */
    /* 9 para sociedades privadas y extranjeros */
    /* 6 para sociedades publicas */
    /* menor que 6 (0,1,2,3,4,5) para personas naturales */

    if (d3 == 7 || d3 == 8) {
      //alert('El tercer dígito ingresado es inválido');
      this.messageGrowlService.notify('error', 'Error', 'El tercer dígito ingresado es inválido!');
      return false;
    }

    /* Solo para personas naturales (modulo 10) */
    if (d3 < 6) {
      nat = true;
      var p1 = d1 * 2; if (p1 >= 10) p1 -= 9;
      var p2 = d2 * 1; if (p2 >= 10) p2 -= 9;
      var p3 = d3 * 2; if (p3 >= 10) p3 -= 9;
      var p4 = d4 * 1; if (p4 >= 10) p4 -= 9;
      var p5 = d5 * 2; if (p5 >= 10) p5 -= 9;
      var p6 = d6 * 1; if (p6 >= 10) p6 -= 9;
      var p7 = d7 * 2; if (p7 >= 10) p7 -= 9;
      var p8 = d8 * 1; if (p8 >= 10) p8 -= 9;
      var p9 = d9 * 2; if (p9 >= 10) p9 -= 9;
      modulo = 10;
    }

    /* Solo para sociedades publicas (modulo 11) */
    /* Aqui el digito verficador esta en la posicion 9, en las otras 2 en la pos. 10 */
    else if (d3 == 6) {
      pub = true;
      p1 = d1 * 3;
      p2 = d2 * 2;
      p3 = d3 * 7;
      p4 = d4 * 6;
      p5 = d5 * 5;
      p6 = d6 * 4;
      p7 = d7 * 3;
      p8 = d8 * 2;
      p9 = 0;
    }

    /* Solo para entidades privadas (modulo 11) */
    else if (d3 == 9) {
      pri = true;
      p1 = d1 * 4;
      p2 = d2 * 3;
      p3 = d3 * 2;
      p4 = d4 * 7;
      p5 = d5 * 6;
      p6 = d6 * 5;
      p7 = d7 * 4;
      p8 = d8 * 3;
      p9 = d9 * 2;
    }

    suma = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
    residuo = suma % modulo;

    /* Si residuo=0, dig.ver.=0, caso contrario 10 - residuo*/
    var digitoVerificador = residuo == 0 ? 0 : modulo - residuo;

    /* ahora comparamos el elemento de la posicion 10 con el dig. ver.*/
    if (pub == true) {
      if (digitoVerificador != d9) {
        //alert('El ruc de la empresa del sector público es incorrecto.');
        this.messageGrowlService.notify('error', 'Error', 'El ruc de la empresa del sector público es incorrecto!');
        return false;
      }
      /* El ruc de las empresas del sector publico terminan con 0001*/
      if (numero.substring(9, 4) != '0001') {
        //alert('El ruc de la empresa del sector público debe terminar con 0001');
        this.messageGrowlService.notify('error', 'Error', 'El ruc de la empresa del sector público debe terminar con 0001!');
        return false;
      }
    }
    else if (pri == true) {
      if (digitoVerificador != d10) {
        //alert('El ruc de la empresa del sector privado es incorrecto.');
        this.messageGrowlService.notify('error', 'Error', 'El ruc de la empresa del sector privado es incorrecto!');
        return false;
      }
      //verificar esta parte con los demas RUC
      if (numero.length > 10 && (numero.substring(13, 10) != '001' && numero.substring(13, 10) != '002' &&
        numero.substring(13, 10) != '003' && numero.substring(13, 10) != '004' && numero.substring(13, 10) != '005' &&
        numero.substring(13, 10) != '006' && numero.substring(13, 10) != '007' && numero.substring(13, 10) != '008' &&
        numero.substring(13, 10) != '009')) {
        //alert('El ruc de la empresa del sector privado debe terminar con 001');
        this.messageGrowlService.notify('error', 'Error', 'El ruc de la empresa del sector privado debe terminar con 001!');
        return false;
      }
    }

    else if (nat == true) {
      if (digitoVerificador != d10) {
        //alert('El número de cédula de la persona natural es incorrecto.');
        this.messageGrowlService.notify('error', 'Error', 'El número de cédula de la persona natural es incorrecto!');
        return false;
      }

      if (numero.length > 10 && (numero.substring(13, 10) != '001' && numero.substring(13, 10) != '002' &&
        numero.substring(13, 10) != '003' && numero.substring(13, 10) != '004' && numero.substring(13, 10) != '005' &&
        numero.substring(13, 10) != '006' && numero.substring(13, 10) != '007' && numero.substring(13, 10) != '008' &&
        numero.substring(13, 10) != '009')) {
        //alert('El ruc de la persona natural debe terminar con 00*');
        this.messageGrowlService.notify('error', 'Error', 'El ruc de la persona natural debe terminar con 00*!');
        return false;
      }
    }
    this.messageGrowlService.notify('success', 'Éxito', 'Cedula/Ruc Correcto!');
    return true;
  }

  validarNumFact(num) {
    let valid = false;
    var n = num.indexOf("_");
    if (n !== -1 || num === "") {
      valid = true;
    }
    return valid;
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

  validateCargoPersonal(cargoPersonal) {
    if (cargoPersonal.descripcion_cargo_personal == undefined ||
      cargoPersonal.descripcion_cargo_personal == "") {
      return false;
    } else {
      return true;
    }
  }

  camposVacios(cad, id) {
    if (cad == "") {
      document.getElementById("id").style.borderColor = "#FE2E2E";
      return false;
    } else
      return true;
  }

  validatePersonal(personal) {
    if (personal.cedula == undefined || personal.nombres == undefined || personal.apellidos == undefined || personal.telefono == undefined ||
      personal.email == undefined || personal.cedula == "" || personal.nombres == "" || personal.apellidos == "" || personal.telefono == "" ||
      personal.email == "") {
      return false;
    } else {
      return true;
    }
  }

  validatePersonalU(personal) {

    let res = true;
    if (personal.cedula == "") {
      document.getElementById("cedula").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (personal.nombres == "") {
      document.getElementById("nombres").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (personal.apellidos == "") {
      document.getElementById("apellidos").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (personal.telefono == "") {
      document.getElementById("telefono").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (personal.email == "") {
      document.getElementById("email").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validateTarjeta(tarjeta) {
    let res = true;
    if (tarjeta.numero == undefined || tarjeta.numero == '') {
      document.getElementById("numeroGT").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (tarjeta.tipo == undefined || tarjeta.tipo == '') {
      document.getElementById("tipoTarjetas").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (tarjeta.limite == undefined || tarjeta.limite == '') {
      document.getElementById("limite").style.borderColor = "#FE2E2E";
      console.log
      res = false;
    }
    return res;
  }

  validateFormaPago(fp) {
    let res = true;
    let sum = fp.formaPago.efectivo + fp.formaPago.tarjeta + fp.formaPago.credito + fp.formaPago.cheque;
    if (sum !== fp.totalPagar) {
      document.getElementById("pnlFp").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validateFormaPago1(fp) {
    let res = true;
    let sum = fp.formaPago.efectivo + fp.formaPago.tarjeta + fp.formaPago.credito + fp.formaPago.cheque;
    if (sum !== fp.totalPagar) {
      document.getElementById("pnlFp").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (fp.ruc == '') {
      document.getElementById("inputCiRuc").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (fp.nombre == '') {
      document.getElementById("nombreS").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (fp.telefono == '') {
      document.getElementById("telefonoS").style.borderColor = "#FE2E2E";
      res = false;
    }
    if (fp.direccion == '') {
      document.getElementById("direccionS").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validateTipoCliente(nombre) {
    let res = true;
    if (nombre == undefined || nombre == '') {
      document.getElementById("descTC").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validateTipoClienteU(nombre) {
    let res = true;
    if (nombre == undefined || nombre == '') {
      document.getElementById("descTCU").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validateTipoReport(tipo) {
    let res = true;
    if (tipo == 0) {
      document.getElementById("tipoReport").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  validateParameters(lstHeaders) {
    let res = true;
    let i = 0;
    for (let entry of lstHeaders) {
      if (entry.active === true) {
        i++;
      }
    }
    if (i == 0) {
      document.getElementById("pnlParameters").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  customValidateMateria(materia_prima) {
    let res = true;
    if (materia_prima.nombre == "") {
      document.getElementById("nombreMat").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  customValidateMateriaU(materia_prima) {
    let res = true;
    if (materia_prima.nombre == "") {
      document.getElementById("nombreMatU").style.borderColor = "#FE2E2E";
      res = false;
    }
    return res;
  }

  //SOLO LETRAS MAYUSCULAS O MINUSCULAS Y ESPACIOS 
  soloLetras(evt) {
    var key = evt.keyCode || evt.which;
    var letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    var tecla = evt.key.toLowerCase();
    var especiales = "8-13-16-17-18-20-37-39-46".split("-");
    var tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }

    if (letras.indexOf(tecla) === -1 && !tecla_especial) {
      return false;
    } else
      return true;
  }

  /*getDateTime() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    return localISOTime;
  }*/

  getDateTimeEs() {
    let currentDateTime = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    return currentDateTime;
  }

  getDateTimeEsPrimeNG1() {
    var date = new Date();
    date.setHours(date.getHours() - 8);
    let currentDateTime = this.datePipe.transform(date, 'MM/dd/yyyy HH:mm');
    return currentDateTime;
  }

  getDateTimeEsPrimeNG() {
    let currentDateTime = this.datePipe.transform(new Date(), 'MM/dd/yyyy HH:mm');
    return currentDateTime;
  }

  getDateTimeEsPrimeNG2() {
    let currentDateTime = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
    return currentDateTime;
  }

  getDateEs() {
    let currentDateTime = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    return currentDateTime;
  }

  getTimeEs() {
    let currentDateTime = this.datePipe.transform(new Date(), 'HH:mm:ss');
    return currentDateTime;
  }

  getDateTimeStamp() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var newCad = localISOTime.substr(0, (localISOTime.length) - 4);
    return newCad
  }

  getDateTimeStamp1() {
    var tzoffset = 780 * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    var newCad = localISOTime.substr(0, (localISOTime.length) - 4);
    return newCad
  }

  getTimeStampFromDate(fecha) {
    var date1 = new Date(fecha);
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(date1.getTime() - tzoffset)).toISOString();
    return localISOTime
  }

  isoToString(s) {
    var date = new Date(s);
    date.setHours(date.getHours() + 5);
    return (this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss'))
  }

  validateCads(s) {
    return s;
  }

  validateCads1(s) {
    s = s.trim();
    return s;
  }

  formatSails(lstCompras) {
    let newLst: any = [];
    for (let entry of lstCompras) {
      var index = newLst.findIndex(i => i.producto._id === entry.producto._id);
      if (index == -1) {
        newLst.push(entry);
      } else {
        newLst[index].cantidad += entry.cantidad
      }
    }
    return newLst;
  }

  formatTotalVentas(lstCompras) {
    let newLst: any = [];
    for (let entry of lstCompras) {
      var index = newLst.findIndex(i => i.descripcion === entry.descripcion);
      if (index == -1) {
        newLst.push(entry);
      } else {
        newLst[index].precio_venta += entry.precio_venta;
        newLst[index].total += entry.total
        newLst[index].cantidad += entry.cantidad;
      }
    }
    return newLst;
  }

  formatSailsStock(lstCompras) {
    let newLst: any = [];
    for (let entry of lstCompras) {
      if (entry.total == 0) {
        var index = newLst.findIndex(i => i.descripcion === entry.descripcion);
        if (index == -1) {
          newLst.push(entry);
        } else {
          newLst[index].cantidad += entry.cantidad
        }
      }
    }
    return newLst;
  }

}
