import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
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
import { AuthService } from '../../services/auth.service';
import { TarjetaService } from '../../services/tarjeta.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component'
import * as myGlobals from '../../components/globals';
import { FacturaService } from '../../services/factura.service';
import { DetalleFacturaService } from '../../services/detalle-factura.service';
import { PromocionService } from '../../services/promocion.service';

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
  numero;
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
  selectedPromos: any[];
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
  public clientes: any = [];
  clientesC: any = [];
  citiesDD: any[];
  private foo: ClientesComponent;
  searchUser: any;
  cardNumberS;
  settingsT = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      numero: {
        title: 'Numero Tarjeta',
        width: '12%',
      },
      cedula: {
        title: 'CI. Cliente',
        width: '12%'
      },
      nombre: {
        title: 'Nombre Cliente',
        width: '15%'
      },
      apellido: {
        title: 'Apellido Cliente',
        width: '15%'
      },
      limite: {
        title: 'Limite Consumo',
        width: '10%'
      },
      tipo: {
        title: 'Tipo',
        width: '10%'
      },
      descripcion: {
        title: 'Descripcion',
        width: '26%'
      }
    },
    actions: {
      // columnTitle: '',
      add: true,
      edit: true,
      delete: true
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  };
  sourceT: LocalDataSource = new LocalDataSource();;
  showDialogT = false;
  selectedClientGP: any;
  tipoTarjetas: any = [];
  limiteConsumo;
  descTarjeta;
  cardNumberGT;
  selectedTipoTarjeta: any;
  naCliente;
  flagCN = false;
  lstAddCardCI: any = [];
  lstAddCardCI1: any = [];
  showDialogTU = false;
  flagCNU = false;
  updateTarjeta: any;
  oldCard;
  ind = 0;
  lstCards: any = [];
  flagActivateInsertCard = true;
  lstPromociones: any = [];

  change($event) {
    $event = false;
  }

  constructor(
    private validateService: ValidateService,
    public el: ElementRef, public renderer: Renderer,
    private productoService: ProductoService,
    private tipoProductoService: TipoProductoService,
    private clienteService: ClienteService,
    private tipoClienteService: TipoClienteService,
    private messageGrowlService: MessageGrowlService,
    private formatterService: FormatterService,
    public dialog: MdDialog,
    private tarjetaService: TarjetaService,
    private facturaService: FacturaService,
    private detalleFacturaService: DetalleFacturaService,
    private promocionService: PromocionService) {

    this.cardNumber = "";
    this.validCard = "ñ1006771_";

    this.baseColor = "#f8f5f0";
    // Atributos cliente
    this.cedula = "";
    this.nombre = "";
    this.apellido = "";
    this.telefono = "";
    this.correo = "";
    this.sexo = "M";
    this.selected_tipo_cliente = "";
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
    setTimeout(function () {
      if (document.getElementById('cedulaNew') !== null)
        document.getElementById('cedulaNew').focus();
    }, 500);

    this.tipoTarjetas = [];
    this.tipoTarjetas.push({ label: 'Normal', value: 'Normal' });
    this.tipoTarjetas.push({ label: 'VIP', value: 'VIP' });
    this.selectedTipoTarjeta = this.tipoTarjetas[0].label;

    this.updateTarjeta = {
      'numero': '',
      'cedula': '',
      'tipo': '',
      'limite': '',
      'descripcion': ''
    };
  }

  ngOnInit() {
    setTimeout(function () {
      document.getElementById('cedulaNew').focus();
    }, 500)
    document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';
    this.cantHombres = 0;
    this.cantMujeres = 0;
    this.cantSalenM = 0;
    this.cantSalenH = 0;
    this.selectedTab = 0;
    //alert(document.getElementById('cedula').style.backgroundColor);
    this.selectedPromos = [];
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
    this.tipoProductoService.getAll().subscribe(tp => {
      this.mapTP = tp;
      this.tabs = [];
      for (let entry of tp) {
        let aux = { label: entry.desc_tipo_producto, icon: 'fa-bar-chart' };
        this.tabs.push(aux);
      }
      this.productoService.getAll().subscribe(p => {
        this.mapP = p;
        this.promocionService.getAll().subscribe(data => {
          this.lstPromociones = data;
          /*console.log(this.lstPromociones)
          this.promos = [];
          for (let entry of this.lstPromociones) {
            let aux = { value: entry, label: entry.nombre }
            this.promos.push(aux);
          }*/
          this.mapProdShow = [];
          let firstElement = this.mapTP[0]._id;
          for (let entry of p) {
            if (entry.id_tipo_producto.localeCompare(firstElement) === 0) {
              let aux = {
                nombre: entry.nombre,
                cant_existente: entry.cant_existente,
                precio_costo: entry.precio_costo,
                precio_venta: entry.precio_venta,
                selectedPromo: this.lstPromociones[0].nombre,
                precio_promo: entry.precio_venta
              };
              this.mapProdShow.push(aux);
            }
          }
          this.FillHeaders(this.mapP);
        }, err => {
          console.log(err);
        })

      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
      return false;
    })
    this.ngOnInitCards();
  }

  FillHeaders(mapP) {
    for (let property in mapP[0]) {
      if (mapP[0].hasOwnProperty(property)) {
        if (property.localeCompare("nombre") === 0 || property.localeCompare("cant_existente") === 0 || property.localeCompare("precio_venta") === 0 || property.localeCompare("precio_costo") === 0)
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

  public getDate(): number {
    return this.dt && this.dt.getTime() || new Date().getTime();
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
      console.log(myGlobals.globalClients)
      this.showDialog = false;
      this.ngOnInit();
      this.checkClient();
      this.messageGrowlService.notify('success', 'Exito', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  onAddTSubmit() {
    const newCard = {
      numero: this.cardNumberGT,
      nombre: this.selectedClientGP.nombre,
      apellido: this.selectedClientGP.apellido,
      cedula: this.selectedClientGP.cedula,
      limite: this.limiteConsumo,
      descripcion: this.descTarjeta,
      tipo: this.selectedTipoTarjeta
    }
    //Required fields
    if (!this.validateService.validateTarjeta(newCard)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacíos!');
      return false;
    }
    if (this.selectedClientGP.value.cedula.localeCompare("") !== 0) {
      let row = this.lstAddCardCI.find(x => x.value.cedula === newCard.cedula);
      this.lstAddCardCI = this.lstAddCardCI.filter(function (obj) {
        return obj.value.cedula !== row.value.cedula;
      });
    }
    this.tarjetaService.register(newCard).subscribe(data => {
      this.sourceT.add(newCard);
      this.sourceT.refresh();
      let row = this.lstAddCardCI.find(x => x.value.cedula === newCard.cedula);
      this.ngOnInitCards();
      this.showDialogT = false;
      this.messageGrowlService.notify('success', 'Exito', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })

  }

  onDeleteT(event): void {
    this.openDialog(event.data);
  }

  openDialog(dataT) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        if (result.localeCompare("Aceptar") == 0) {
          //remove from database
          this.tarjetaService.delete(dataT._id).subscribe(data => {
            this.sourceT.remove(dataT);
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
            //add to lstclientesadd
            let busCI = this.clientes.find(x => x.cedula === dataT.cedula);
            let aux = {
              'value': {
                'apellido': busCI.apellido,
                'cedula': busCI.cedula,
                'correo': busCI.correo,
                'fecha_nacimiento': busCI.fecha_nacimiento,
                'id_tipo_cliente': busCI.id_tipo_cliente,
                'nombre': busCI.nombre,
                'sexo': busCI.sexo,
                'telefono': busCI.telefono,
                '_id': busCI._id
              },
              'label': busCI.nombre + ' ' + busCI.apellido,
            }
            this.lstAddCardCI.push(aux);

          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');

          })
        }
    });
  }

  onUpdateTSubmit() {
    console.log(this.updateTarjeta)
    this.updateTarjeta.cedula = this.selectedClientGP.cedula;
    this.updateTarjeta.nombre = this.selectedClientGP.nombre;
    this.updateTarjeta.apellido = this.selectedClientGP.apellido;
    //Required fields
    if (!this.validateService.validateTarjeta(this.updateTarjeta)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    this.tarjetaService.update(this.updateTarjeta).subscribe(data => {
      this.sourceT.update(this.oldCard, this.updateTarjeta);
      this.sourceT.refresh();
      this.ngOnInitCards();
      this.showDialogTU = false;
      this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
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
        let v = document.getElementById('cedulaNew');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 1;
  };

  public alertMe2(st) {
    if (!this.selectedTab != st) {
      setTimeout(function () {
        let v = document.getElementById('numeroS');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 2;
  };

  public alertMe3(st) {
    if (!this.selectedTab != st) {
      setTimeout(function () {
        let v = document.getElementById('numeroT');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 3;
  };

  onRowUnselect(event) {
    this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!')
  }

  onRowSelect(event) {
    //Update productos
    this.productoService.getByNombre(event.data.nombre).subscribe(producto => {
      let aux = {
        cant_existente: event.data.cant_existente,
        nombre: event.data.nombre,
        precio_costo: event.data.precio_costo,
        precio_promo: event.data.precio_promo,
        precio_venta: event.data.precio_venta,
        selectedPromo: event.data.selectedPromo
      }
      producto[0].promocion = aux;
      console.log(producto);
      this.productoService.updateProducto(producto).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', "Se ha habilitado una promoción!");
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
      })
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
    })
  }

  handleChange(e) {
    this.mapProdShow = []
    for (let entry of this.mapP) {
      if (entry.id_tipo_producto.localeCompare(this.mapTP[e.index]._id) === 0) {
        let aux = {
          nombre: entry.nombre,
          cant_existente: entry.cant_existente,
          precio_costo: entry.precio_costo,
          precio_venta: entry.precio_venta,
          selectedPromo: this.lstPromociones[0].nombre,
          precio_promo: entry.precio_venta
        };
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

  onChange(event) {
    let finalChar = this.cardNumber.slice(-1)
    if (this.cardNumber.length == 9) {
      if (finalChar.localeCompare("_") == 0) {

        //document.getElementById('cantMujeres').focus();
        this.checkCard();
      }
    } else {
      this.flagCardFound = false;
      document.getElementById('basic-addon2').style.backgroundColor = '#FE2E2E';//soft red
      document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';//default color
    }
  }

  checkCard() {
    let searchCard = this.lstCards.find(x => x.cedula === this.cedula);
    if (searchCard !== undefined) {
      this.flagCardFound = true;
      this.cardNumber = searchCard.numero;
      this.flagActivateInsertCard = false;
      setTimeout(function () {
        document.getElementById('cantMujeres').focus();
      }, 0)
    } else {
      if (this.cardNumber.length == 9) {
        this.tarjetaService.getByNumero(this.cardNumber).subscribe(data => {
          console.log(data)
          if (data.length > 0) {
            this.flagCardFound = true;
            document.getElementById('basic-addon1').style.backgroundColor = '#6ce600';//soft green
            document.getElementById('basic-addon2').style.backgroundColor = '#f8f5f0';//default color
          } else {
            this.flagCardFound = false;
            document.getElementById('basic-addon2').style.backgroundColor = '#FE2E2E';//soft red
            document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';//default color
          }
        }, err => {
          console.log(err);
        })
      }
    }
  }

  onChangeCILength($event) {
    if (this.cedula.length != 10) {
      this.nfLael = "Usuario no encontrado.";
      document.getElementById("basic-addon3").style.backgroundColor = "#FE2E2E";
      this.flagUserFound = false;
      document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';//default color
      document.getElementById('basic-addon2').style.backgroundColor = '#f8f5f0';//default color
      this.cardNumber = "";
    }
    if (this.cedula.length != 13) {
      this.nfLael = "Usuario no encontrado.";
      document.getElementById("basic-addon3").style.backgroundColor = "#FE2E2E";
      this.flagUserFound = false;
      document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';//default color
      document.getElementById('basic-addon2').style.backgroundColor = '#f8f5f0';//default color
      this.cardNumber = "";
    }
    if (this.cedula.length == 10 || this.cedula.length == 13) {
      this.checkClient();
    }
  }

  checkClient() {
    this.searchUser = this.clientes.find(x => x.cedula === this.cedula);
    if (this.searchUser !== undefined) {
      this.searchUser.id_tipo_cliente = this.searchById(this.searchUser.id_tipo_cliente, this.tipo_clientes);
      document.getElementById('basic-addon3').style.backgroundColor = '#6ce600';
      this.flagUserFound = true;
      this.checkCard();
      setTimeout(function () {
        document.getElementById('numero').focus();
      }, 0)
    } else {
      this.nfLael = "Usuario no encontrado.";
      document.getElementById("basic-addon3").style.backgroundColor = "#FE2E2E";
      this.flagUserFound = false;
      this.cardNumber = "";
    }
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

  onChangeDescAdd($event) {
    this.descTarjeta = this.descTarjeta.toLowerCase();
  }

  onChangeDescUpdate($event) {
    this.updateTarjeta.descripcion = this.updateTarjeta.descripcion.toLowerCase();
  }

  insertClientCard() {
    //console.log(this.flagUserFound + " " + this.flagCardFound)
    console.log(this.selectedPromos)
    /*this.searchUser.id_tipo_cliente = this.searchByName(this.searchUser.id_tipo_cliente, this.tipo_clientes);
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
    let total = this.cantMujeres + this.cantHombres
    if (total > 0) {
      this.clienteService.updateCliente(newClient).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', 'Tarjeta ingresada!');
        this.flagUserFound = false;
        this.flagCardFound = false;
        this.nfLael = '';
        this.cardNumber = '';
        this.cedula = '';
        //set factura & detalle factura
        let newFactura = {
          cedula: this.searchUser.cedula,
          num_factura: '',
          num_autorizacion: '',
          ruc: '',
          nombre: this.searchUser.nombre + this.searchUser.apellido,
          telefono: this.searchUser.telefono,
          direccion: 'Riobamba',
          detalleFacturaV: []
        }
        this.facturaService.register(newFactura).subscribe(data => {
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
        })
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      })
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Ingresa un número de personas!');
    }*/
  }

  onChangeClose($event) {
  }

  onChangeAddT($event) {
    this.cardNumberGT = this.cardNumberGT.toLowerCase();
    if (this.cardNumberGT.length === 9) {
      if (this.cardNumberGT.charAt(0).localeCompare('ñ') == 0 && this.cardNumberGT.charAt(8).localeCompare('_') == 0) {
        this.flagCN = true;
        document.getElementById('basic-addon7').style.backgroundColor = '#6ce600';
        document.getElementById('basic-addon8').style.backgroundColor = '#f8f5f0';
      } else {
        this.flagCN = false;
        document.getElementById("basic-addon8").style.backgroundColor = "#FE2E2E";
        document.getElementById('basic-addon7').style.backgroundColor = '#f8f5f0';
      }
    } else {
      this.flagCN = false;
      document.getElementById("basic-addon8").style.backgroundColor = "#FE2E2E";
      document.getElementById('basic-addon7').style.backgroundColor = '#f8f5f0';
    }
  }

  onChangeAddTU($event) {
    if (this.cardNumberGT.length === 9) {
      if (this.cardNumberGT.charAt(0).localeCompare('ñ') == 0 && this.cardNumberGT.charAt(8).localeCompare('_') == 0) {
        this.flagCN = true;
        document.getElementById('basic-addon9').style.backgroundColor = '#6ce600';
        document.getElementById('basic-addon10').style.backgroundColor = '#f8f5f0';
      } else {
        this.flagCN = false;
        document.getElementById("basic-addon10").style.backgroundColor = "#FE2E2E";
        document.getElementById('basic-addon9').style.backgroundColor = '#f8f5f0';
      }
    } else {
      this.flagCN = false;
      document.getElementById("basic-addon10").style.backgroundColor = "#FE2E2E";
      document.getElementById('basic-addon9').style.backgroundColor = '#f8f5f0';
    }
  }

  setCursorAddT() {
    document.getElementById('basic-addon7').style.backgroundColor = '#f8f5f0';
    document.getElementById('basic-addon8').style.backgroundColor = '#f8f5f0';
    this.cardNumberGT = "";
    this.descTarjeta = "";
    this.limiteConsumo = "";
    setTimeout(function () {
      document.getElementById('numeroGT').focus();
    }, 0)
  }

  setCursorUpdateT() {
    document.getElementById('basic-addon9').style.backgroundColor = '#f8f5f0';
    document.getElementById('basic-addon10').style.backgroundColor = '#f8f5f0';
    setTimeout(function () {
      document.getElementById('limiteU').focus();
      console.log()
    }, 0)
  }

  filterCardCI(clientesC, lstCardCI) {
    for (let entry of lstCardCI) {
      clientesC = clientesC.filter(function (obj) {
        return obj.value.cedula !== entry.cedula;
      });
    }
    return clientesC;
  }

  onUpdateT(event: any) {
    this.updateTarjeta = event.data;
    this.oldCard = event.data;
    this.lstAddCardCI1 = [];
    for (let entry of this.lstAddCardCI) {
      this.lstAddCardCI1.push(entry);
    }
    let b = this.clientes.find(x => x.cedula === event.data.cedula);
    let aux = {
      'value': {
        'apellido': b.apellido,
        'cedula': b.cedula,
        'correo': b.correo,
        'fecha_nacimiento': b.fecha_nacimiento,
        'id_tipo_cliente': b.id_tipo_cliente,
        'nombre': b.nombre,
        'sexo': b.sexo,
        'telefono': b.telefono,
        '_id': b._id
      },
      'label': b.nombre + ' ' + b.apellido
    }
    this.lstAddCardCI1.push(aux);
    this.selectedClientGP = aux.value;
  }

  ngOnInitCards() {
    this.tipoClienteService.getAll().subscribe(tc => {
      this.tipo_clientes = tc;
      this.citiesDD = [];
      for (let x of tc) {
        this.citiesDD.push({ label: x.desc_tipo_cliente, value: x.desc_tipo_cliente });
      }
      this.selected_tipo_cliente = this.citiesDD[0].label;
      this.clienteService.getAll().subscribe(c => {
        this.clientes = c;
        let i = 1;
        let aux = {
          'value': {
            'apellido': '',
            'cedula': '',
            'correo': '',
            'fecha_nacimiento': '',
            'id_tipo_cliente': '',
            'nombre': '',
            'sexo': '',
            'telefono': '',
            '_id': ''
          },
          'label': '--------------------N/A--------------------'
        }
        this.clientesC = [];
        this.clientesC[0] = aux;
        this.selectedClientGP = aux;
        for (let entry of c) {
          let aux = {
            'value': {
              'apellido': entry.apellido,
              'cedula': entry.cedula,
              'correo': entry.correo,
              'fecha_nacimiento': entry.fecha_nacimiento,
              'id_tipo_cliente': entry.id_tipo_cliente,
              'nombre': entry.nombre,
              'sexo': entry.sexo,
              'telefono': entry.telefono,
              '_id': entry._id
            },
            'label': entry.nombre + ' ' + entry.apellido,
          }
          this.clientesC[i] = aux;
          i++;
        }
        this.tarjetaService.getAll().subscribe(t => {
          this.lstCards = t;
          this.sourceT.load(this.lstCards);
          //console.log(this.lstCards)
          this.lstAddCardCI = this.filterCardCI(this.clientesC, this.lstCards);
        }), err => {
          console.log(err);
          return false;
        }
      })
    },
      err => {
        console.log(err);
        return false;
      });
  }
}
