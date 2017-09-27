import { Component, NgModule, OnInit, OnChanges, ElementRef, Renderer } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import * as moment from 'moment';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ClienteService } from '../../services/cliente.service';
import { TipoClienteService } from '../../services/tipo-cliente.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MessageGrowlService } from '../../services/message-growl.service';
import { FormatterService } from '../../services/formatter.service';
import { AuthService } from '../../services/auth.service';
import { CardComponent } from '../../components/card/card.component';
import { ProductoService } from '../../services/producto.service';
import { TipoProductoService } from '../../services/tipo-producto.service';
import * as myGlobals from '../../components/globals';

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
  correo: string;
  fecha_nacimiento: string;
  sexo: string;
  selected_tipo_cliente: string;
  flagUpdate: boolean;
  flagCreate: boolean;
  oldUser;
  public dt: Date = new Date();
  settingsC = {
    mode: 'external',
    columns: {
      cedula: {
        title: 'Cedula',
        width: '100px'
      },
      nombre: {
        title: 'Nombre',
        width: '160px'
      },
      apellido: {
        title: 'Apellido',
        width: '160px'
      },
      telefono: {
        title: 'Telefono',
        width: '100px'
      },
      correo: {
        title: 'Email',
        width: '150px'
      },
      fecha_nacimiento: {
        title: 'Fecha Nacimiento',
        width: '100px'
      },
      sexo: {
        title: 'Sexo',
        width: '75px'
      },
      id_tipo_cliente: {
        title: 'Tipo Cliente',
        width: '140px'
      }
    },
    actions: {
      add: true,
      edit: true,
      delete: true
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
        width: '400px'
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
  color = 'primary';
  es: any;
  sexs = [
    { "name": 'Masculino', "pseudo": "M" },
    { "name": 'Femenino', "pseudo": "F" },
  ];
  options = {
    position: ["bottom", "left"],
    timeOut: 5000,
    lastOnBottom: true
  }
  citiesDD: any[];
  private foo: CardComponent;

  constructor(
    private validateService: ValidateService,
    private tipoClienteService: TipoClienteService,
    private clienteService: ClienteService,
    public el: ElementRef, public renderer: Renderer, public dialog: MdDialog,
    private messageGrowlService: MessageGrowlService,
    private productoService: ProductoService,
    private formatterService: FormatterService,
    private tipoProductoService: TipoProductoService) {
    this.flagCreate = false;
    this.flagUpdate = false;
    this.showDatepicker = false;

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

    /*this.foo = new CardComponent(
      validateService,
      el, renderer,
      productoService,
      tipoProductoService,
      clienteService,
      tipoClienteService,
      messageGrowlService,
      formatterService,
      dialog
    );*/

  }

  ngOnInit() {
    var initial = new Date(this.getDate()).toLocaleDateString().split("/");
    this.fecha_nacimiento = [initial[0], initial[1], initial[2]].join('/');
    this.sexo = "M";
    this.cedula = "";
    this.nombre = "";
    this.apellido = "";
    this.telefono = "";
    this.correo = "";
    /* Get Tipo Clientes*/
    this.tipoClienteService.getAll().subscribe(tc => {
      this.tipo_clientes = tc;
      this.sourceTC = new LocalDataSource();
      this.sourceTC.load(this.tipo_clientes);
      this.citiesDD = [];
      for (let x of tc) {
        this.citiesDD.push({ label: x.desc_tipo_cliente, value: x.desc_tipo_cliente });
      }
      this.selected_tipo_cliente = this.citiesDD[0].label;
      /* Get Clientes*/
      this.clienteService.getAll().subscribe(c => {
        myGlobals.setValue(c);
        this.clientes = c;
        let i = 0;
        for (let x of c) {
          let desc = this.searchById(x.id_tipo_cliente, this.tipo_clientes);
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
    }, 0)
  }

  setCursorUpdate() {
    setTimeout(function () {
      document.getElementById('ciU').focus();
    }, 0)
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
    this.correo = event.data.correo;
    this.fecha_nacimiento = event.data.fecha_nacimiento;
    this.sexo = event.data.sexo;
    this.selected_tipo_cliente = event.data.id_tipo_cliente;
  }

  onUpdateTC(event: any) {
    console.log(event.data)
  }

  setCursorUpdateTC() {
    setTimeout(function () {
      //document.getElementById('ciU').focus();
    }, 500)
  }

  onDeleteTC(event): void {
    this.openDialog(event.data);
  }

  openDialog(data) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        if (result.localeCompare("Aceptar") == 0) {
          this.sourceTC.remove(data);
          //remove from database
          this.tipoClienteService.deleteTipoCliente(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
          })
        }
    });
  }

  onDeleteC(event): void {
    this.openDialog1(event.data);
  }

  openDialog1(data) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        if (result.localeCompare("Aceptar") == 0) {
          this.sourceC.remove(data);
          //remove from database
          this.clienteService.deleteCliente(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');

          })
        }
    });
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
    // Validate Email
    if (newClient.correo !== "") {
      if (!this.validateService.validateEmail(newClient.correo)) {
        this.messageGrowlService.notify('error', 'Error', 'Ingresa un mail válido!');
        return false;
      }
    }
    this.clienteService.registerCliente(newClient).subscribe(data => {
      data.id_tipo_cliente = this.searchById(data.id_tipo_cliente, this.tipo_clientes);
      this.clientes.push(data);
      this.sourceC.refresh();
      this.showDialog = false;
      this.messageGrowlService.notify('success', 'Exito', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  updateClient() {
    const newClient = {
      _id: this.oldUser._id,
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
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      return false;
    }
    //Validate Email
    if (!this.validateService.validateEmail(newClient.correo)) {
      this.messageGrowlService.notify('error', 'Error', 'Ingresa un mail válido!');
      return false;
    }
    if (newClient.correo !== "") {
      if (!this.validateService.validateEmail(newClient.correo)) {
        this.messageGrowlService.notify('error', 'Error', 'Ingresa un mail válido!');
        return false;
      }
    }
    this.clienteService.updateCliente(newClient).subscribe(data => {
      this.messageGrowlService.notify('info', 'Información', 'Modificación exitosa!');
      this.sourceC.update(this.oldUser, newClient);
      this.sourceC.refresh();
      //this.ngOnInit();
      this.showDialog1 = false;
      this.flagUpdate = false;
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
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

  onChange() {
    if (this.cedula.length != 10)
      document.getElementById("ci").style.borderColor = "#FE2E2E";
    if (this.cedula.length != 13)
      document.getElementById("ci").style.borderColor = "#FE2E2E";
    if (this.cedula.length == 10 || this.cedula.length == 13) {
      if (!this.validateService.validarRucCedula(this.cedula)) {
        this.messageGrowlService.notify('error', 'Error', 'Cedula/Ruc Inválido!');
        document.getElementById("ci").style.borderColor = "#FE2E2E";
      } else
        //document.getElementById("ci").style.borderColor = "#DADAD2";
        document.getElementById("ci").style.borderColor = "#5ff442";//green
    }
  }

  onChangeU() {
    if (this.cedula.length != 10)
      document.getElementById("ciU").style.borderColor = "#FE2E2E";
    if (this.cedula.length != 13)
      document.getElementById("ciU").style.borderColor = "#FE2E2E";
    if (this.cedula.length == 10 || this.cedula.length == 13) {
      if (!this.validateService.validarRucCedula(this.cedula)) {
        this.messageGrowlService.notify('error', 'Error', 'Cedula/Ruc Inválido!');
        document.getElementById("ciU").style.borderColor = "#FE2E2E";
      } else
        document.getElementById("ciU").style.borderColor = "#5ff442";//green
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

  onChangeEmailU($event) {
    this.correo = this.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.correo)) {
      document.getElementById("correoU").style.borderColor = "#5ff442";
    }
    else {
      document.getElementById("correoU").style.borderColor = "#FE2E2E";
    }
  }
}
