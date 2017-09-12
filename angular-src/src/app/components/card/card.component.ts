import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import * as moment from 'moment';
import { ValidateService } from '../../services/validate.service';
import { TabMenuModule, MenuItem } from 'primeng/primeng';
import { ProductoService } from '../../services/producto.service';
import { TipoProductoService } from '../../services/tipo-producto.service';
import { MessageGrowlService } from '../../services/message-growl.service';

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
  cedula: String;
  nombre: String;
  apellido: String;
  telefono: String;
  email: String;
  fechaNacimiento: Date;
  fechaShow: String;
  cantHombres: number;
  cantMujeres: number;
  cantSalenM: number;
  cantSalenH: number;
  showDialog = false;
  showDialogPrint = false;
  flagUserFound = false;
  nfLael = "";
  selectedTab: number;
  fechaNacimientoString: Date;
  sexo: string;
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

  change($event) {
    $event = false;
  }

  constructor(
    private validateService: ValidateService,
    private flashMessagesService: FlashMessagesService,
    public el: ElementRef, public renderer: Renderer,
    private productoService: ProductoService,
    private tipoProductoService: TipoProductoService,
    private messageGrowlService: MessageGrowlService) {
    renderer.listenGlobal('document', 'change', (event) => {
      //Set time in datepicker
      this.dt = moment(this.fechaNacimientoString, 'MM/DD/YYYY').toDate();
    });
    this.cardNumber = "";
    this.validCard = "ñ1006771_";

    this.baseColor = "#f8f5f0";
    this.validCedula = "0502926819";
    var initial = new Date(this.getDate()).toLocaleDateString().split("/");
    //this.fechaNacimientoString = [initial[1], initial[0], initial[2]].join('/');
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
    this.cedula = "";
    this.nombre = "";
    this.apellido = "";
    this.telefono = "";
    this.email = "";
    this.sexo = "M";


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
        console.log(this.mapP);
        this.FillHeaders(this.mapP);
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
      return false;
    })
  }

  ngOnInit() {
    setTimeout(function () {
      document.getElementById('cedula').focus();
    }, 50)
    //document.getElementById('cedula').focus();
    console.log(document.getElementById('cedula'))
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
    }, 50)
  }
  onCreate(event: any) {
    //this.ngOnInit();
  }
  saveUser() {
    let fecha = new Date(this.getDate()).toLocaleDateString().split("/");
    let f1 = [fecha[1], fecha[0], fecha[2]].join('/');
    const newClient = {
      cedula: this.cedula,
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono,
      email: this.email,
      fechaNacimientoString: f1,
      sexo: this.sexo
    }
    //Required fields
    if (!this.validateService.validateClient(newClient)) {
      this.flashMessagesService.show('Campos vacios', { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    // Validate Email
    if (!this.validateService.validateEmail(newClient.email)) {
      this.flashMessagesService.show('Porfavor ingresa un mail valido', { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    //Validate cedula
    let valRes = this.validateService.validadorCedula(newClient.cedula).split('/');
    if (valRes[1].localeCompare('success') === 0) {
      this.flashMessagesService.show(valRes[0], { cssClass: 'alert-success', timeout: 2000 });
    } else {
      this.flashMessagesService.show(valRes[0], { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    this.flashMessagesService.show('Ingreso Exitoso', { cssClass: 'alert-success', timeout: 2000 });
    this.ngOnInit();
    this.showDialog = false;
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
      document.getElementById('basic-addon1').style.backgroundColor = '#088A08';//dark green
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
        document.getElementById('basic-addon1').style.backgroundColor = '#088A08';//dark green
        document.getElementById('basic-addon2').style.backgroundColor = '#f8f5f0';//default color
      } else {
        var x = document.getElementById('basic-addon2')
        document.getElementById('basic-addon2').style.backgroundColor = '#FE2E2E';//soft red
        document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';//default color

      }
    }
  }

  checkClient() {
    //this.showCliente = true;
    if (this.cedula === this.validCedula) {
      document.getElementById('basic-addon3').style.borderColor = '#6ce600';
      this.flagUserFound = true;

    } else {
      this.nfLael = "Usuario no encontrado.";
      document.getElementById("basic-addon3").style.borderColor = "#FE2E2E";
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


  display: boolean = false;

  showDialogT() {
    this.display = true;
  }

}

function formatDate(date) {
  var monthNames = [
    "Enero", "Febrero", "Marzo",
    "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre",
    "Noviembre", "Diciembre"
  ];
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  //console.log(day + ' ' + monthNames[monthIndex] + ' ' + year);
  return day + ' ' + monthNames[monthIndex] + ' ' + year;
}
