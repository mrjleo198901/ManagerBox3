import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import * as moment from 'moment';
import { ValidateService } from '../../services/validate.service';

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
  sexo: number;
  cantHombres: number;
  cantMujeres: number;
  cantSalenM: number;
  cantSalenH: number;
  showDialog = false;
  showDialogPrint = false;
  flagUserFound = false;
  nfLael = "";
  selectedTab: number;
  fechaNacimientoString: string;
  sexoString: string;
  public dt: Date = new Date();
  change($event) {
    $event = false;
  }

  constructor(
    private validateService: ValidateService,
    private flashMessagesService: FlashMessagesService,
    public el: ElementRef, public renderer: Renderer
  ) {
    renderer.listenGlobal('document', 'change', (event) => {
      //Set time in datepicker
      this.dt = moment(this.fechaNacimientoString, 'MM/DD/YYYY').toDate();
    });
    this.sexo = 1;
    this.cardNumber = "";
    this.validCard = "ñ1006771_";

    this.baseColor = "#f8f5f0";
    this.validCedula = "0502926819";
    var initial = new Date(this.getDate()).toLocaleDateString().split("/");
    this.fechaNacimientoString = [initial[1], initial[0], initial[2]].join('/');
    this.cedula = "";
    this.nombre = "";
    this.apellido = "";
    this.telefono = "";
    this.email = "";
    //usuario fictisio
    /*this.nombre = "Jorge";
    this.apellido = "Muñoz";
    this.telefono = "0987327418";
    this.cedula;
    this.email = "jmunoz@riobytes.com";
    this.fechaShow = formatDate(new Date());
    this.sexo = 1;*/
  }

  ngOnInit() {
    document.getElementById('cedula').focus();
    document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';
    this.cantHombres = 0;
    this.cantMujeres = 0;
    this.cantSalenM = 0;
    this.cantSalenH = 0;
    this.selectedTab = 0;

    alert(document.getElementById('cedula').style.backgroundColor);
    
  }
  setCursorAdd() {
    setTimeout(function () {
      document.getElementById('ci').focus();
    }, 500)
  }
  onCreate(event: any) {
    this.ngOnInit();
    this.dt = new Date();
  }
  saveUser() {
    let nSexo;
    if (this.sexo === 1) {
      nSexo = "M"
    } else {
      nSexo = "F"
    }
    let fecha = new Date(this.getDate()).toLocaleDateString().split("/");
    let f1 = [fecha[1], fecha[0], fecha[2]].join('/');
    const newClient = {
      cedula: this.cedula,
      nombre: this.nombre,
      apellido: this.apellido,
      telefono: this.telefono,
      email: this.email,
      fechaNacimientoString: f1,
      sexo: nSexo
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
        v.click();
      }, 200);
    }
    this.selectedTab = 1;
  };
  public alertMe2(st) {

    if (!this.selectedTab != st && this.selectedTab > 0) {
      setTimeout(function () {
        let v = document.getElementById('numeroS');
        v.click();
      }, 200);
    }
    this.selectedTab = 2;
  };

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
