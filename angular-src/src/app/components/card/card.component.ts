import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import * as moment from 'moment';
import { ValidateService } from '../../services/validate.service';
import { TabMenuModule, MenuItem } from 'primeng/primeng';
import { ProductoService } from '../../services/producto.service';
import { TipoProductoService } from '../../services/tipo-producto.service';
import { ClienteService } from '../../services/cliente.service';
import { TipoClienteService } from '../../services/tipo-cliente.service';
import { MessageGrowlService } from '../../services/message-growl.service';
import { ClientesComponent } from '../../components/clientes/clientes.component';
import { FormatterService } from '../../services/formatter.service';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  cardNumber: string;
  validCard: String;
  baseColor: String;
  validCedula: String;
  // Atributos cliente
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  fecha_nacimiento: string;
  sexo: string;
  selected_tipo_cliente: string;

  cantHombres: number;
  cantMujeres: number;
  cantSalenM: number;
  cantSalenH: number;
  showDialog = false;
  showDialogPrint = false;
  flagUserFound = false;
  flagCardFound = false;
  nfLael = "";
  selectedTab: number;
  public dt: Date = new Date();
  tabs: any[];
  mapTP: any[];
  mapP: any[];
  public headers = [];
  mapProdShow: any[];
  color = 'primary';
  selectedCars3: any[];
  promos: any[];
  selectedPromo: string;
  blockedPanel: boolean = true;
  lstPromos: any[];
  types: any[];
  selectedIeMujeres: string[] = ['Egreso'];
  selectedIeHombres: string[] = ['Egreso'];
  es: any;
  sexs = [
    { "name": 'Masculino', "pseudo": "M" },
    { "name": 'Femenino', "pseudo": "F" },
  ];
  tipo_clientes: any = [];
  clientes: any = [];
  citiesDD: any[];
  private foo: ClientesComponent;
  searchUser: any;

  change($event) {
    $event = false;
  }

  constructor(
    private validateService: ValidateService,
    private flashMessagesService: FlashMessagesService,
    public el: ElementRef, public renderer: Renderer,
    private productoService: ProductoService,
    private tipoProductoService: TipoProductoService,
    private clienteService: ClienteService,
    private tipoClienteService: TipoClienteService,
    private messageGrowlService: MessageGrowlService,
    private formatterService: FormatterService,
    public dialog: MdDialog) {

    this.foo = new ClientesComponent(validateService, tipoClienteService, clienteService, el, renderer, dialog, messageGrowlService, formatterService);

    this.cardNumber = "";
    this.validCard = "ñ1006771_";

    this.baseColor = "#f8f5f0";
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Borrar'
    }
    // Atributos cliente
    this.cedula = "";
    this.nombre = "";
    this.apellido = "";
    this.telefono = "";
    this.correo = "";
    //this.fecha_nacimiento = "";
    this.sexo = "M";
    this.selected_tipo_cliente = "";

    this.tipoProductoService.getAll().subscribe(tp => {
      this.mapTP = tp;
      this.tabs = [];
      for (let entry of tp) {
        let aux = { label: entry.desc_tipo_producto, icon: 'fa-bar-chart' };
        this.tabs.push(aux);
      }
      this.productoService.getAll().subscribe(p => {
        this.mapP = p;
        this.promos = [
          { value: "2 x 1", label: "2 x 1" },
          { value: "1/2 Precio", label: "1/2 Precio" },
        ];
        this.mapProdShow = [];
        let firstElement = this.mapTP[0]._id;
        for (let entry of p) {
          if (entry.id_tipo_producto.localeCompare(firstElement) === 0) {
            let aux = { nombre: entry.nombre, precio_unitario: entry.precio_unitario, selectedPromo: this.promos[0].value };
            this.mapProdShow.push(aux);
          }
        }
        //console.log(this.mapP);
        this.FillHeaders(this.mapP);
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
      return false;
    })
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Borrar'
    }
  }

  ngOnInit() {
    setTimeout(function () {
      document.getElementById('cedula').focus();
    }, 50)
    document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';
    this.cantHombres = 0;
    this.cantMujeres = 0;
    this.cantSalenM = 0;
    this.cantSalenH = 0;
    this.selectedTab = 0;
    //alert(document.getElementById('cedula').style.backgroundColor);
    this.selectedCars3 = [];
    this.lstPromos = [
      { descripcion: 'Cerveza budweiser 350ml', pu: '3.25', total: '25', cantidad: '5' },
      { descripcion: 'Cerveza pilsener 350ml', pu: '2.80', total: '25', cantidad: '4' },
      { descripcion: 'Wiskey grants 1LT', pu: '4.25', total: '25', cantidad: '2' },
      { descripcion: 'Pecera jaggerboom', pu: '4.25', total: '25', cantidad: '2' },
      { descripcion: 'Pecera jaggerboom', pu: '4.25', total: '25', cantidad: '2' },
      { descripcion: 'Pecera jaggerboom', pu: '4.25', total: '25', cantidad: '2' },
      { descripcion: 'Cerveza corona pequeña', pu: '4.30', total: '25', cantidad: '7' }
    ];
    this.types = [];
    this.types.push({ label: 'Entran', value: 'Ingreso' });
    this.types.push({ label: 'Salen', value: 'Egreso' });

    var initial = new Date(this.getDate()).toLocaleDateString().split("/");
    this.fecha_nacimiento = [initial[0], initial[1], initial[2]].join('/');
    this.tipoClienteService.getAll().subscribe(tc => {
      this.tipo_clientes = tc;
      this.citiesDD = [];
      for (let x of tc) {
        this.citiesDD.push({ label: x.desc_tipo_cliente, value: x.desc_tipo_cliente });
      }
      this.selected_tipo_cliente = this.citiesDD[0].label;
      this.clienteService.getAll().subscribe(c => {
        this.clientes = c;
      })
    },
      err => {
        console.log(err);
        return false;
      });
  }

  FillHeaders(mapP) {
    for (let property in mapP[0]) {
      if (mapP[0].hasOwnProperty(property)) {
        if (property.localeCompare("nombre") === 0 || property.localeCompare("precio_unitario") === 0)
          this.headers.push({
            field: property,
            header: (property.charAt(0).toUpperCase() + property.substr(1).toLowerCase()).replace("_", " ")
          });
      }
    }
  }

  setCursorAdd() {
    setTimeout(function () {
      document.getElementById('ciA').focus();
    }, 0)
  }

  saveClient() {
    const newClient = {
      cedula: this.cedula,
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono,
      correo: this.correo,
      fecha_nacimiento: this.fecha_nacimiento,
      sexo: this.sexo,
      id_tipo_cliente: this.searchByName(this.selected_tipo_cliente, this.tipo_clientes),
      tarjeta: ""
    }
    //Required fields
    if (!this.validateService.validateClient(newClient)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    this.clienteService.registerCliente(newClient).subscribe(data => {
      /*this.foo.sourceC.add(newClient);
      this.foo.sourceC.refresh();
      this.foo.ngOnInit();*/
      this.clientes.push(newClient);
      this.showDialog = false;
      this.checkClient();
      this.messageGrowlService.notify('success', 'Exito', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  public getDate(): number {
    return this.dt && this.dt.getTime() || new Date().getTime();
  }

  enterKey() {
    let o = "ñ";
    let f = "_";
    let aux = o.concat(this.cardNumber.concat(f));
    //console.log(aux)
    if (aux === this.validCard) {
      document.getElementById('basic-addon1').style.backgroundColor = '#6ce600';//soft green
      document.getElementById('basic-addon2').style.backgroundColor = '#f8f5f0';//default color
    } else {
      var x = document.getElementById('basic-addon2')
      document.getElementById('basic-addon2').style.backgroundColor = '#FE2E2E';//soft red
      document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';//default color

    }
  }

  onChange(event) {
    let finalChar = this.cardNumber.slice(-1)
    if (finalChar.localeCompare("_") == 0) {
      let v = document.getElementById('numero');
      v.click();
      if (this.cardNumber === this.validCard) {
        document.getElementById('basic-addon1').style.backgroundColor = '#6ce600';//soft green
        document.getElementById('basic-addon2').style.backgroundColor = '#f8f5f0';//default color
        this.flagCardFound = true;
      } else {
        var x = document.getElementById('basic-addon2')
        document.getElementById('basic-addon2').style.backgroundColor = '#FE2E2E';//soft red
        document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';//default color
        this.flagCardFound = false;

      }
    }
  }

  checkClient() {
    this.searchUser = this.clientes.find(x => x.cedula === this.cedula);
    if (this.searchUser !== undefined) {
      if (this.cedula === this.searchUser.cedula) {
        this.searchUser.id_tipo_cliente = this.searchById(this.searchUser.id_tipo_cliente, this.tipo_clientes);
        document.getElementById('basic-addon3').style.backgroundColor = '#6ce600';
        this.flagUserFound = true;
      }
    }
    else {
      this.nfLael = "Usuario no encontrado.";
      document.getElementById("basic-addon3").style.backgroundColor = "#FE2E2E";
      this.flagUserFound = false;
    }
  }

  enterKey1() {
    this.checkClient();
  }

  lessWoman() {
    if (this.cantMujeres > 0)
      this.cantMujeres--;
  }

  plusWoman1() {
    if (this.cantMujeres < 100)
      this.cantMujeres++;
  }

  lessMan() {
    if (this.cantHombres > 0)
      this.cantHombres--;
  }

  plusMan() {
    if (this.cantHombres < 100)
      this.cantHombres++;
  }

  lessTotalM() {
    if (this.cantSalenM > 0)
      this.cantSalenM--;
  }

  plusTotalM() {
    if (this.cantSalenM < this.cantMujeres)
      this.cantSalenM++;
  }

  lessTotalH() {
    if (this.cantSalenH > 0)
      this.cantSalenH--;
  }

  plusTotalH() {
    if (this.cantSalenH < this.cantHombres)
      this.cantSalenH++;
  }

  public alertMe1(st) {
    if (this.selectedTab != st && this.selectedTab > 0) {
      setTimeout(function () {
        let v = document.getElementById('cedula');
        if (v != null)
          v.click();
      }, 200);
    }
    this.selectedTab = 1;
  };

  public alertMe2(st) {
    if (!this.selectedTab != st) {
      setTimeout(function () {
        let v = document.getElementById('numeroS');
        if (v != null)
          v.click();
      }, 200);
    }
    this.selectedTab = 2;
  };

  public alertMe3(st) {
    if (!this.selectedTab != st) {
      setTimeout(function () {

      }, 200);
    }
    this.selectedTab = 2;
  };

  onRowUnselect(event) {
    this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!')
  }

  onRowSelect(event) {
    this.messageGrowlService.notify('warn', 'Promocion Activada', event.data);
  }

  handleChange(e) {
    this.mapProdShow = []
    for (let entry of this.mapP) {
      if (entry.id_tipo_producto.localeCompare(this.mapTP[e.index]._id) === 0) {
        let aux = { nombre: entry.nombre, precio_unitario: entry.precio_unitario, selectedPromo: this.promos[0].value };
        this.mapProdShow.push(aux);
      }
    }
  }

  searchById(id, myArray) {
    for (let entry of myArray) {
      if (entry._id === id) {
        return entry.desc_tipo_cliente;
      }
    }
  }

  searchByName(name, myArray) {
    for (let entry of myArray) {
      if (entry.desc_tipo_cliente === name) {
        return entry._id;
      }
    }
  }

  display: boolean = false;

  showDialogT() {
    this.display = true;
  }

  onChangeCI() {
    if (this.cedula.length != 10)
      document.getElementById("ciA").style.borderColor = "#FE2E2E";
    if (this.cedula.length != 13)
      document.getElementById("ciA").style.borderColor = "#FE2E2E";
    if (this.cedula.length == 10 || this.cedula.length == 13) {
      if (!this.validateService.validarRucCedula(this.cedula)) {
        this.messageGrowlService.notify('error', 'Error', 'Cedula/Ruc Inválido!');
        document.getElementById("ciA").style.borderColor = "#FE2E2E";
      } else
        document.getElementById("ciA").style.borderColor = "#5ff442";
    }
  }

  onChangeNombre($event) {
    this.nombre = this.formatterService.toTitleCase(this.nombre);
  }

  onChangeApellido($event) {
    this.apellido = this.formatterService.toTitleCase(this.apellido);
  }

  onChangeEmail($event) {
    this.correo = this.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.correo)) {
      document.getElementById("correo").style.borderColor = "#5ff442";
    }
    else {
      document.getElementById("correo").style.borderColor = "#FE2E2E";
    }
  }

  insertClientCard() {
    this.searchUser.id_tipo_cliente = this.searchByName(this.searchUser.id_tipo_cliente, this.tipo_clientes);
    let newClient = {
      "apellido": this.searchUser.apellido,
      "cedula": this.searchUser.cedula,
      "correo": this.searchUser.correo,
      "fecha_nacimiento": this.searchUser.fecha_nacimiento,
      "id_tipo_cliente": this.searchUser.id_tipo_cliente,
      "nombre": this.searchUser.nombre,
      "sexo": this.searchUser.sexo,
      "telefono": this.searchUser.telefono,
      "_id": this.searchUser._id,
      "tarjeta": this.cardNumber
    }

    console.log(newClient);
    this.clienteService.updateCliente(newClient).subscribe(data => {
      this.messageGrowlService.notify('info', 'Información', 'Modificación exitosa!');
      this.flagUserFound = false;
      this.flagCardFound = false;
      this.nfLael = "";
      this.cardNumber = "";
      this.cedula = ";"
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }
}
