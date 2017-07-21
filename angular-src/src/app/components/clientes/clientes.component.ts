import { Component, NgModule, OnInit, OnChanges, ElementRef, Renderer } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import * as moment from 'moment';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./style.scss']
})

export class ClientesComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  showDialog = false;
  showDialog1 = false;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaNacimiento: Date;
  fechaNacimientoString: string;
  sexo: number;
  sexoString: string;
  flagUpdate: boolean;
  flagCreate: boolean;
  oldUser;
  public dt: Date = new Date();
  settings = {
    mode: 'external',
    columns: {
      cedula: {
        title: 'Cedula'
      },
      nombre: {
        title: 'Nombre'
      },
      apellido: {
        title: 'Apellido'
      },
      telefono: {
        title: 'Telefono'
      },
      email: {
        title: 'Email'
      },
      fechaNacimientoString: {
        title: 'Fecha Nacimiento'
      },
      sexo: {
        title: 'Sexo'
      }
    },
    actions: {
      add: true,
      edit: true,
      delete: false
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
      //class: 'font-size: 200%;'
    }
  };

  data = [
    {
      cedula: "0502926819",
      nombre: "Jorge",
      apellido: "Muñoz",
      telefono: "0987327418",
      email: "jmunoz@riobytes.com",
      fechaNacimientoString: "1/8/1989",
      sexo: "M"
    },
    {
      cedula: "0602926819",
      nombre: "Jairo",
      apellido: "Gonzalez",
      telefono: "0987327418",
      email: "jgonzalez@riobytes.com",
      fechaNacimientoString: "3/8/1989",
      sexo: "M"
    },
    {
      cedula: "1206310052",
      nombre: "Juan",
      apellido: "Mishquero",
      telefono: "0987327418",
      email: "jmishquero@riobytes.com",
      fechaNacimientoString: "10/2/1989",
      sexo: "M"
    }
  ];

  constructor(
    private validateService: ValidateService,
    private flashMessagesService: FlashMessagesService,
    public el: ElementRef, public renderer: Renderer) {
    renderer.listenGlobal('document', 'change', (event) => {
      //Set time in datepicker
      this.dt = moment(this.fechaNacimientoString, 'MM/DD/YYYY').toDate();
    });
    this.sexo = 1;
    this.flagCreate = false;
    this.flagUpdate = false;
  }

  ngOnInit() {
    var initial = new Date(this.getDate()).toLocaleDateString().split("/");
    this.fechaNacimientoString = [initial[1], initial[0], initial[2]].join('/');
    this.sexo = 1;
    this.cedula = "";
    this.nombre = "";
    this.apellido = "";
    this.telefono = "";
    this.email = "";
    //Load data to localDataSource
    this.source = new LocalDataSource();
    this.source.load(this.data);
    this.validateService.getScreen();

  }

  change($event) {
    this.flagCreate = false;
  }

  changeU($event) {
    this.flagUpdate = false;
  }

  setCursorAdd() {
    setTimeout(function () {
      document.getElementById('ci').focus();
      //get dialog dimensions
      /*let h = document.getElementById("dlgMain").style.position;
      let w = document.getElementById("dlgMain").style.width;
      console.log(w + "x" + h)*/
    }, 500)
  }

  setCursorUpdate() {
    setTimeout(function () {
      document.getElementById('ciU').focus();
    }, 500)
  }

  onCreate(event: any) {
    this.flagCreate = true;
    this.ngOnInit();
    this.dt = new Date();
    //this.fechaNacimientoString = this.dt.toLocaleDateString();
  }

  onUpdate(event: any) {
    this.flagUpdate = true;
    //Save the current row
    this.oldUser = event.data;
    this.cedula = event.data.cedula;
    this.nombre = event.data.nombre;
    this.apellido = event.data.apellido;
    this.telefono = event.data.telefono;
    this.email = event.data.email;
    this.fechaNacimientoString = event.data.fechaNacimientoString;
    if (event.data.sexo.localeCompare('M') === 0) {
      this.sexo = 1;
    } else {
      this.sexo = 2;
    }
    //Set time in datepicker
    this.dt = moment(event.data.fechaNacimientoString, 'MM/DD/YYYY').toDate();
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
    //this.flashMessagesService.grayOut(true);
    this.flashMessagesService.show('Ingreso Exitoso', { cssClass: 'alert-success', timeout: 2000 });
    this.source.add(newClient);
    this.source.refresh();
    this.ngOnInit();
    this.showDialog = false;
    //this.flagCreate = false;
  }

  updateUser() {
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
    //console.log(this.oldUser);
    this.source.update(this.oldUser, newClient);
    this.source.refresh();
    this.ngOnInit();
    this.showDialog1 = false;
    //this.flagUpdate = false;
  }

  public getDate(): number {
    return this.dt && this.dt.getTime() || new Date().getTime();
  }
}

/*function getScreen() {

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
  document.write('<p>Your viewport width is ' + viewportwidth + 'x' + viewportheight + '</p>');
  console.log(viewportwidth + 'x' + viewportheight);
}*/



