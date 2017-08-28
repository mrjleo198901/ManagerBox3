import { Component, NgModule, OnInit, OnChanges, ElementRef, Renderer } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import * as moment from 'moment';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ClienteService } from '../../services/cliente.service';
import { TipoClienteService } from '../../services/tipo-cliente.service'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})

export class ClientesComponent implements OnInit {
  sourceTC: LocalDataSource = new LocalDataSource();
  sourceC: LocalDataSource = new LocalDataSource();
  showDialog = false;
  showDialog1 = false;
  showDialog2 = false;
  showDialog3 = false;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaNacimientoString: string;
  sexo: number;
  selected_tipo_cliente;
  flagUpdate: boolean;
  flagCreate: boolean;
  oldUser;
  public dt: Date = new Date();
  settingsC = {
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
      correo: {
        title: 'Email'
      },
      fecha_nacimiento: {
        title: 'Fecha Nacimiento'
      },
      sexo: {
        title: 'Sexo'
      },
      id_tipo_cliente: {
        title: 'Tipo Cliente'
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
  settingsTC = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      _id: {
        title: 'ID',
        width: '70px',
        filter: false
      },
      desc_tipo_cliente: {
        title: 'Nombre',
        width: '450px'
      }
    },
    actions: {
      //columnTitle: '',
      add: true,
      edit: true,
      delete: true
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  };
  clientes: any = [];
  tipo_clientes: any = [];
  showDatepicker;

  constructor(
    private validateService: ValidateService,
    private tipoClienteService: TipoClienteService,
    private clienteService: ClienteService,
    private flashMessagesService: FlashMessagesService,
    public el: ElementRef, public renderer: Renderer) {
    renderer.listenGlobal('document', 'change', (event) => {
      this.dt = moment(this.fechaNacimientoString, 'MM/DD/YYYY').toDate();
    });
    this.sexo = 1;
    this.flagCreate = false;
    this.flagUpdate = false;
    this.showDatepicker = false;
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
    this.selected_tipo_cliente = "";

    /* Get Tipo Productos*/
    this.tipoClienteService.getAll().subscribe(tc => {
      this.tipo_clientes = tc;
      this.sourceTC = new LocalDataSource();
      this.sourceTC.load(this.tipo_clientes);
      /* Get Productos*/
      this.clienteService.getAll().subscribe(c => {
        this.clientes = c;
        let i = 0;
        for (let x of c) {
          let desc = this.search(x.id_tipo_cliente, this.tipo_clientes);
          this.clientes[i].id_tipo_cliente = desc;
          i++;
        }
        //Load data to localDataSource
        this.sourceC = new LocalDataSource();
        this.sourceC.load(this.clientes);
      }, err => {
        console.log(err);
        return false;
      });

    },
      err => {
        console.log(err);
        return false;
      });
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
    this.email = event.data.correo;
    this.fechaNacimientoString = event.data.fecha_nacimiento
    if (event.data.sexo.localeCompare('M') === 0) {
      this.sexo = 1;
    } else {
      this.sexo = 2;
    }
    this.selected_tipo_cliente = event.data.id_tipo_cliente
    console.log(this.selected_tipo_cliente)
    //Set time in datepicker
    //this.dt = moment(event.data.fechaNacimientoString, 'DD/MM/YYYY').toDate();
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
      correo: this.email,
      fecha_nacimiento: f1,
      sexo: nSexo,
      id_tipo_cliente: this.selected_tipo_cliente._id
    }
    console.log(newClient)
    //Required fields
    if (!this.validateService.validateClient(newClient)) {
      this.flashMessagesService.show('Campos vacios', { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    // Validate Email
    if (!this.validateService.validateEmail(newClient.correo)) {
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
    this.clienteService.registerCliente(newClient).subscribe(data => {
      this.flashMessagesService.show('Ingreso Exitoso', { cssClass: 'alert-success', timeout: 2000 });
      this.sourceC.add(newClient);
      this.sourceC.refresh();
      this.ngOnInit();
    }, err => {
      console.log(err);
      this.flashMessagesService.show('Algo salio mal!', { cssClass: 'alert-danger', timeout: 2000 });
    })
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
    this.sourceC.update(this.oldUser, newClient);
    this.sourceC.refresh();
    this.ngOnInit();
    this.showDialog1 = false;
    //this.flagUpdate = false;
  }

  public getDate(): number {
    return this.dt && this.dt.getTime() || new Date().getTime();
  }

  public showCalendar() {
    if (this.showDatepicker == false)
      this.showDatepicker = true
    else
      this.showDatepicker = false
  }

  search(id, myArray) {
    for (let entry of myArray) {
      if (entry._id === id) {
        return entry.desc_tipo_cliente;
      }
    }
  }
}