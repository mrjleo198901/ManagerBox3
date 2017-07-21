import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  settings = {
    actions: false,
    columns: {
      tipo: {
        title: 'Tipo', type: 'html', filter: false, valuePrepareFunction: (value) => { return '<div class="wide">' + value + '</div>'; }
      },
      descripcion: {
        width: '100px',
        title: 'Descripcion', type: 'html', filter: false, valuePrepareFunction: (value) => { return '<div class="wide">' + value + '</div>'; }
      }
    }
  };
  data = [
    {
      tipo: 1,
      descripcion: "tipo1"
    },
    {
      tipo: 2,
      descripcion: "tipo2"
    },
    {
      tipo: 3,
      descripcion: "tipo3"
    }
  ];

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
  sexo: String;
  cantHombres: number;
  cantMujeres: number;
  cantSalenM: number;
  cantSalenH: number;
  showDialog = false;
  showDialogPrint = false;
  //showCliente = false;
  flagUserFound = false;
  nfLael = "";
  selectedTab: number;
  change($event) {
    //alert($event)
    $event = false;
  }

  constructor(private flashMessage: FlashMessagesService) {
    this.cardNumber = "";
    this.validCard = "ñ1006771_";
    //Default component color rgb(248, 245, 240)
    this.baseColor = "#f8f5f0";
    this.validCedula = "0502926819";
    //usuario fictisio
    this.nombre = "Jorge";
    this.apellido = "Muñoz";
    this.telefono = "0987327418";
    this.cedula;
    this.email = "jmunoz@riobytes.com";
    this.fechaShow = formatDate(new Date());
    this.sexo = "M";
  }

  ngOnInit() {
    document.getElementById('cedula').focus();
    document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';
    this.cantHombres = 0;
    this.cantMujeres = 0;
    this.cantSalenM = 0;
    this.cantSalenH = 0;
    this.selectedTab = 0;
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
  //on select a tab do something
  /*public doOnTabSelect(selectedTab) {
    if (selectedTab === 2) {
      setTimeout(function () {
        let v = document.getElementById('numeroS');
        v.click();
      }, 200);
    } else {
      alert("inside")
      setTimeout(function () {
        let v = document.getElementById('cedula');
        v.click();
      }, 200);
    }
  };*/

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
