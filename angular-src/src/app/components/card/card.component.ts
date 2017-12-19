import { Component, OnInit, ElementRef, Renderer, Output, EventEmitter, Input, ViewChild, AfterViewInit } from '@angular/core';
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
import { DecimalPipe, DatePipe } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { FacturacionComponent } from '../../components/facturacion/facturacion.component';
import { PersonalService } from '../../services/personal.service';
import { ActiveCardsService } from '../../services/active-cards.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Subject } from 'rxjs/Subject';
import { CajaService } from '../../services/caja.service';
import { Router } from '@angular/router';

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
  flagCaUsFound = false;
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
  lstConsumo: any[];
  types: any[];
  selectedIeMujeres = 'Egreso';
  selectedIeHombres = 'Egreso';
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
  limiteConsumo = 100;
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
  showDialogPB = false;
  value: number = 0;
  @ViewChild('cedulaNew')
  myInputVariable1: any;
  cc;
  flagTC = false;
  flagTCU = false;
  coverMujeres = 3;
  coverHombres = 3;
  showDialogFP = false;
  rucFactura;
  flagFP = false;
  lstFP: any = [];
  selectedFP: any;
  flagInsertRuc = true;
  selectedRucFactura;
  totalConsumo: number = 0;
  flagCheckVenta = true;
  telefonoS;
  direccionS;
  flagConfirmFP = true;
  flagCardSFound = false;
  nfLaelS;
  searchUserS: any;
  totalPagar;
  showDateHour;
  cardNumberE;
  flagCardEFound = false;
  nfLaelE;
  searchUserE = {
    ci: '',
    nombre: '',
    cantMujeres: 0,
    cantHombres: 0,
    egresoMujeres: 0,
    egresoHombres: 0,
    idFactura: '',
    cardNumber: '',
    ingresoMujeres: 0,
    ingresoHombres: 0,
    _id: ''
  }
  validCI = false;
  flagCheckFP = false;
  flagFP2 = false;

  fpEfectivo = 0;
  fpTarjeta = 0;
  fpPorCobrar = 0;
  fpCheque = 0;
  flagConsCero = true;
  abono = 0;
  flagFP3 = false;
  cardNumberG;
  flagCheckCI = true;
  checked = true;
  tipoDoc = true;
  tipo_documentos: any;
  selected_tipo_doc;
  position = 'below';
  showCompras = false;
  showDateApertura;
  showHourApertura;
  currentDateTime;
  lstComprasCliente: any = [];
  lstComprasClienteOld: any = [];
  cantColor = '#0000FF';
  displayOpenCaja;
  displayCloseCaja;
  displayOptions;
  username;
  us;
  btnLabel;
  btnClass;
  public static updateDisplayCaja: Subject<boolean> = new Subject();
  displayOpenCajaN = false;
  displayCloseCajaN = false;
  montoO = 0;
  montoF = 0;
  efectivoExis = 0;
  efectivoEsp = 45;
  flagShowAlert;
  public static checkOpenCaja: Subject<boolean> = new Subject();
  displayCloseCajaL = false;
  colorConsCero = 'ui-state-error ui-message ui-corner-all';
  textoConsumo = 'Consumo en cero';
  flagErrorFP = false;
  campoFP;
  maximoFP;

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
    private promocionService: PromocionService,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private localStorageService: LocalStorageService,
    private personalService: PersonalService,
    private activeCardsService: ActiveCardsService,
    private cajaService: CajaService,
    public authService: AuthService,
    private router: Router) {

    this.currentDateTime = this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss');
    this.showDateApertura = this.currentDateTime.split(' ')[0];
    this.showHourApertura = this.currentDateTime.split(' ')[1];

    this.displayOpenCaja = false;
    this.displayCloseCaja = false;
    this.displayOptions = false;

    this.us = JSON.parse(localStorage.getItem('user'));
    if (this.us !== null) {
      this.personalService.getByCedula(this.us.username).subscribe(data => {
        if (data.length > 0) {
          let nombres = data[0].nombres.split(' ');
          this.username = nombres[0];
        }
      }, err => {
        console.log(err);
      })
    }

    //Verificar si acabo de loguearse
    CardComponent.updateDisplayCaja.subscribe(res => {
      //console.log("insideeeeeeeeeee");
      this.cajaService.getActiveCajaById('open', this.us.id).subscribe(data => {
        if (data.length > 0) {
          this.displayOptions = true;
        }
      }, err => {
        console.log(err);
      });
    })

    //Chequear caja abierta no loguin
    this.cajaService.getActiveCajaById('open', this.us.id).subscribe(data => {
      if (data.length > 0) {
        this.btnLabel = 'Cerrar Turno';
        this.btnClass = '#EFAD4D';
      } else {
        this.btnLabel = 'Abrir Turno';
        this.btnClass = '#2398E5';
      }
    }, err => {
      console.log(err);
    });

    //Verificar si caja se cerro antes de salir
    CardComponent.checkOpenCaja.subscribe(res => {
      this.displayCloseCajaL = true;
    })

    /*this.displayOptions = true;
    let caja1 = {
      idUser: '5a2f07113d4776179c860762',
      montoO: '50',
      montoF: 'open',
      fechaO: this.currentDateTime,
      fechaF: ''
    }
    this.cajaService.register(caja1).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    });
    let caja2 = {
      idUser: '5a30a670747bd11f78a51331',
      montoO: '35',
      montoF: 'open',
      fechaO: this.currentDateTime,
      fechaF: ''
    }
    this.cajaService.register(caja2).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    });*/

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
    }, 50);

    this.tipoTarjetas = [];
    this.tipoTarjetas.push({ label: 'Normal', value: 'Normal' });
    this.tipoTarjetas.push({ label: 'VIP', value: 'VIP' });
    this.selectedTipoTarjeta = this.tipoTarjetas[0].label;

    this.tipo_documentos = [];
    this.tipo_documentos.push({ label: 'Cédula', value: '1' });
    this.tipo_documentos.push({ label: 'Pasaporte', value: '2' });
    this.selected_tipo_doc = this.tipo_documentos[0];

    this.updateTarjeta = {
      'numero': '',
      'cedula': '',
      'tipo': '',
      'limite': '',
      'descripcion': ''
    };

    this.lstFP = [];
    this.lstFP.push({ label: 'Efectivo', value: 0 });
    this.lstFP.push({ label: 'Tarjeta de Crédito', value: 1 });
    this.lstFP.push({ label: 'Efectivo y Tarjeta de Crédito', value: 2 });
    this.lstFP.push({ label: 'Por Cobrar', value: 3 });
    this.lstFP.push({ label: 'Consumo en Cero', value: 4 });
    this.selectedFP = this.lstFP[0];
  }

  ngOnInit() {
    setTimeout(function () {
      document.getElementById('cedulaNew').focus();
    }, 50)
    document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';
    this.cantHombres = 0;
    this.cantMujeres = 0;
    this.cantSalenM = 0;
    this.cantSalenH = 0;
    this.selectedTab = 0;
    this.selectedPromos = [];
    /*this.lstConsumo = [
      { descripcion: 'Cerveza budweiser 350ml', pu: '3.25', total: '25', cantidad: '5' },
      { descripcion: 'Cerveza pilsener 350ml', pu: '2.80', total: '25', cantidad: '4' },
      { descripcion: 'Wiskey grants 1LT', pu: '4.25', total: '25', cantidad: '2' },
      { descripcion: 'Pecera jaggerboom', pu: '4.25', total: '25', cantidad: '2' },
      { descripcion: 'Pecera jaggerboom', pu: '4.25', total: '25', cantidad: '2' },
      { descripcion: 'Pecera jaggerboom', pu: '4.25', total: '25', cantidad: '2' },
      { descripcion: 'Cerveza corona pequeña', pu: '4.30', total: '25', cantidad: '7' }
    ];*/
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
          this.mapProdShow = [];
          let firstElement = this.mapTP[0]._id;
          //localStorage.removeItem("promosActivas");
          //this.localStorageService.removeItem();
          for (let entry of p) {
            if (entry.promocion.length > 0) {

              let aux = {
                nombre: entry.nombre,
                cant_existente: this.decimalPipe.transform(entry.cant_existente, '1.2-2'),
                precio_costo: this.decimalPipe.transform(entry.precio_costo, '1.2-2'),
                precio_venta: this.decimalPipe.transform(entry.precio_venta, '1.2-2'),
                selectedPromo: this.lstPromociones[0].nombre,
                precio_promo: this.decimalPipe.transform(entry.precio_venta, '1.2-2')
              };
              this.selectedPromos.push(aux);
              myGlobals.addElementPromo(entry);
              //this.localStorageService.setItem(myGlobals.globalPromos)

            }
            if (entry.id_tipo_producto.localeCompare(firstElement) === 0) {
              let aux = {
                nombre: entry.nombre,
                cant_existente: this.decimalPipe.transform(entry.cant_existente, '1.2-2'),
                precio_costo: this.decimalPipe.transform(entry.precio_costo, '1.2-2'),
                precio_venta: this.decimalPipe.transform(entry.precio_venta, '1.2-2'),
                selectedPromo: this.lstPromociones[0].nombre,
                precio_promo: this.decimalPipe.transform(entry.precio_venta, '1.2-2')
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
    this.rucFactura = '';
  }

  openCloseCaja() {
    if (this.btnLabel.localeCompare('Cerrar Turno') == 0) {
      this.displayCloseCajaN = true;
    } else {
      this.displayOpenCajaN = true;
      setTimeout(function () {
        document.getElementById('montoO').focus();
      }, 0);
    }
  }

  closeCaja() {
    this.montoF = this.efectivoExis;
    this.cajaService.getActiveCajaById('open', this.us.id).subscribe(data => {
      let caja = {
        idUser: this.us.id,
        montoO: data[0].montoO,
        montoF: this.montoF,
        fechaO: data[0].fechaO,
        fechaF: this.validateService.getDateTimeEs()
      }
      this.messageGrowlService.notify('info', 'Información', 'Se ha cerrado caja exitosamente.\nEnviando correo al administrador.');
      /*this.cajaService.register(caja).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', 'Se ha cerrado caja exitosamente.\nEnviando correo al administrador.');
      }, err => {
        console.log(err);
      })*/
    }, err => {
      console.log(err);
    });
    this.sendEmail();
  }

  sendEmail() {
    const user = {
      name: 'asd',
      email: 'mrjleo1989@gmail.com',
      username: this.us.name,
      npass: this.formatterService.makeId()
    }
    this.cajaService.sendCorte(user).subscribe(data => {
      console.log(data);
    });
  }

  openCaja() {
    let caja = {
      idUser: this.us.id,
      montoO: this.montoO,
      montoF: 'open',
      fechaO: this.validateService.getDateTimeEs(),
      fechaF: ''
    }
    console.log(caja);
    /*this.cajaService.register(caja).subscribe(data => {

    }, err => {

    })*/
  }

  closeCajaL() {
    this.montoF = this.efectivoExis;
    this.cajaService.getActiveCajaById('open', this.us.id).subscribe(data => {

      let caja = {
        idUser: this.us.id,
        montoO: data[0].montoO,
        montoF: this.montoF,
        fechaO: data[0].fechaO,
        fechaF: this.validateService.getDateTimeEs()
      }
      /*this.cajaService.register(caja).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', 'Se ha cerrado caja exitosamente.\nEnviando correo al administrador.');
          this.displayCloseCajaL = false;
          this.authService.logout();
          this.router.navigate(['/login']);
      }, err => {
        console.log(err);
      })*/
    }, err => {
      console.log(err);
    })
  }

  logOut() {
    this.displayCloseCajaL = false;
    this.authService.logout();
    this.messageGrowlService.notify('info', 'Información', 'Saliste!');
    this.router.navigate(['/login']);
  }

  onChangeExis() {
    if ((this.efectivoExis - this.efectivoEsp) == 0) {
      this.flagShowAlert = true;
    } else {
      this.flagShowAlert = false;
    }
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
    if (!this.flagUserFound) {
      this.showDialog = true;
      setTimeout(function () {
        document.getElementById('ciA').focus();
      }, 0)
      this.onChangeCI();
    }
  }

  onChangeTipoDoc() {
    if (this.selected_tipo_doc.value == 1) {
      this.tipoDoc = true;
      setTimeout(function () {
        let v = document.getElementById('cedulaNew');
        if (v != null)
          v.click();
      }, 50);
    } else {
      this.checked = false;
      this.tipoDoc = false;
      setTimeout(function () {
        let v = document.getElementById('cedulaNew');
        if (v != null)
          v.click();
      }, 50);
    }
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
      this.ngOnInitClient();
      this.clientes.push(data)
      this.showDialog = false;
      this.checkClient();
      this.messageGrowlService.notify('success', 'Éxito', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  onAddTSubmit() {
    const newCard = {
      numero: this.cardNumberGT,
      nombre: '',
      apellido: '',
      cedula: '',
      limite: this.limiteConsumo,
      descripcion: this.descTarjeta,
      tipo: this.selectedTipoTarjeta
    }
    //Required fields
    if (!this.validateService.validateTarjeta(newCard)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacíos!');
      return false;
    }
    if (this.flagTC == false) {
      newCard.nombre = this.selectedClientGP.nombre;
      newCard.apellido = this.selectedClientGP.apellido;
      newCard.cedula = this.selectedClientGP.cedula;
      let row = this.lstAddCardCI.find(x => x.value.cedula === newCard.cedula);
      this.lstAddCardCI = this.lstAddCardCI.filter(function (obj) {
        return obj.value.cedula !== row.value.cedula;
      });
    }
    this.tarjetaService.register(newCard).subscribe(data => {
      this.sourceT.add(newCard);
      this.sourceT.refresh();
      let row = this.lstAddCardCI.find(x => x.value.cedula === newCard.cedula);
      //this.lstAddCardCI.push(asdsad)

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

  deletePromos() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        if (result.localeCompare("Aceptar") == 0) {
          this.showDialogPB = true;
          let n = this.mapP.length;
          let exp = 100 / n;
          this.value = 0;
          for (let entry of this.mapP) {
            entry.promocion = [];
            this.productoService.updateProducto(entry).subscribe(data => {
              this.value += exp;
              if (this.value >= 100) {
                this.value = 100;
                this.showDialogPB = false;
              }
            }, err => {
              console.log(err)
            })
            this.messageGrowlService.notify('success', 'Éxito', 'Promociones Activas Eliminadas!');
          }
        }
    });
  }

  onUpdateTSubmit() {
    this.updateTarjeta.cedula = '';
    this.updateTarjeta.nombre = '';
    this.updateTarjeta.apellido = '';
    //Required fields
    if (!this.validateService.validateTarjeta(this.updateTarjeta)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    if (this.flagTCU == false) {
      this.updateTarjeta.cedula = this.selectedClientGP.cedula;
      this.updateTarjeta.nombre = this.selectedClientGP.nombre;
      this.updateTarjeta.apellido = this.selectedClientGP.apellido;
      let row = this.lstAddCardCI.find(x => x.value.cedula === this.updateTarjeta.cedula);
      this.lstAddCardCI = this.lstAddCardCI.filter(function (obj) {
        return obj.value.cedula !== row.value.cedula;
      });
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

  public alertMe4(st) {
    if (!this.selectedTab != st) {
      setTimeout(function () {
        let v = document.getElementById('numeroTar');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 3;
  };

  onRowUnselect(event) {
    this.productoService.getByNombre(event.data.nombre).subscribe(data => {
      data[0].promocion = [];
      const producto = {
        _id: data[0]._id,
        nombre: data[0].nombre,
        precio_costo: parseFloat(data[0].precio_costo),
        precio_venta: parseFloat(data[0].precio_venta),
        utilidad: parseFloat(data[0].utilidad),
        cant_existente: data[0].cant_existente,
        contenido: parseFloat(data[0].contenido),
        path: data[0].path,
        subproductoV: data[0].subproductoV,
        id_tipo_producto: data[0].id_tipo_producto,
        promocion: data[0].promocion
      };
      myGlobals.sliceElement(producto);
      console.log(myGlobals.globalPromos);
      if (myGlobals.globalPromos.length > 0) {
        localStorage.removeItem('promosActivas');
        localStorage.setItem('promosActivas', JSON.stringify(myGlobals.globalPromos));
      } else {
        localStorage.removeItem('promosActivas');
      }
      FacturacionComponent.updateUserStatus.next(true);
      this.productoService.updateProducto(producto).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', "Se ha deshabilitado la promoción!");
        FacturacionComponent.updateUserStatus.next(true);
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
      })
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', "Algo salió mal!");
    })
  }

  onRowSelect(event) {
    //Update productos
    this.productoService.getByNombre(event.data.nombre).subscribe(data => {
      let aux = {
        cant_existente: event.data.cant_existente,
        nombre: event.data.nombre,
        precio_costo: event.data.precio_costo,
        precio_promo: event.data.precio_promo,
        precio_venta: event.data.precio_venta,
        selectedPromo: event.data.selectedPromo
      }
      data[0].promocion = aux;
      const producto = {
        _id: data[0]._id,
        nombre: data[0].nombre,
        precio_costo: parseFloat(data[0].precio_costo),
        precio_venta: parseFloat(data[0].precio_venta),
        utilidad: parseFloat(data[0].utilidad),
        cant_existente: data[0].cant_existente,
        contenido: parseFloat(data[0].contenido),
        path: data[0].path,
        subproductoV: data[0].subproductoV,
        id_tipo_producto: data[0].id_tipo_producto,
        promocion: [data[0].promocion]
      };
      myGlobals.addElementPromo(producto);
      console.log(myGlobals.globalPromos);
      localStorage.removeItem('promosActivas');
      localStorage.setItem('promosActivas', JSON.stringify(myGlobals.globalPromos));
      FacturacionComponent.updateUserStatus.next(true)
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
          cant_existente: this.decimalPipe.transform(entry.cant_existente, '1.2-2'),
          precio_costo: this.decimalPipe.transform(entry.precio_costo, '1.2-2'),
          precio_venta: this.decimalPipe.transform(entry.precio_venta, '1.2-2'),
          selectedPromo: this.lstPromociones[0].nombre,
          precio_promo: this.decimalPipe.transform(entry.precio_venta, '1.2-2'),
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

  onChangeOpen(event) {
    this.cardNumber = this.cardNumber.toLowerCase();
    let finalChar = this.cardNumber.slice(-1)
    if (this.cardNumber.length == 9) {
      if (finalChar.localeCompare("_") == 0) {
        this.checkCard();
      }
    } else {
      this.flagCaUsFound = false;
      this.flagCardFound = false;
      document.getElementById('basic-addon2').style.backgroundColor = '#FF4B36';//soft red
      document.getElementById('basic-addon1').style.backgroundColor = '';//default color
    }
  }

  checkCard() {
    /*let searchCard = this.lstCards.find(x => x.cedula === this.cedula);
    if (searchCard !== undefined) {
      this.flagCardFound = true;
      //this.cardNumber = searchCard.numero;
      this.flagActivateInsertCard = false;
      this.flagCaUsFound = true;
      setTimeout(function () {
        document.getElementById('cantMujeres').focus();
      }, 0)
    } else {*/
    if (this.cardNumber.length == 9) {
      this.tarjetaService.getByNumero(this.cardNumber).subscribe(data => {
        console.log(data)
        if (data.length > 0) {
          this.flagCardFound = true;
          document.getElementById('basic-addon1').style.backgroundColor = '#8FC941';//soft green
          document.getElementById('basic-addon2').style.backgroundColor = '';//default color
          setTimeout(function () {
            document.getElementById('cantMujeres').focus();
          }, 0)
          if (this.flagCardFound && this.flagUserFound) {
            this.flagCaUsFound = true;
          } else {
            this.flagCaUsFound = false;
          }
        } else {
          this.flagCaUsFound = false;
          this.flagCardFound = false;
          document.getElementById('basic-addon2').style.backgroundColor = '#FF4B36';//soft red
          document.getElementById('basic-addon1').style.backgroundColor = '';//default color
        }
      }, err => {
        console.log(err);
      })
    }
    //}
  }

  onChangePassLength($event) {

    this.nfLael = "";
    this.flagUserFound = false;
    this.cardNumber = "";
    this.flagCaUsFound = false;

    document.getElementById('basic-addonPass1').style.backgroundColor = '';
  }

  searchPass() {
    this.clienteService.getByCedula(this.cedula).subscribe(data => {
      if (data.length > 0) {
        this.searchUser = data[0];
        document.getElementById('basic-addonPass1').style.backgroundColor = '#8FC941';
        this.flagUserFound = true;
      } else {
        this.flagCaUsFound = false;
        this.nfLael = "Cliente no encontrado.";
        document.getElementById("basic-addonPass1").style.backgroundColor = "#FF4B36";
        this.flagUserFound = false;
        this.cardNumber = "";
      }
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  onChangeCILength($event) {
    if (this.cedula.length == 0) {
      document.getElementById('basic-addon3').style.backgroundColor = '';
      this.nfLael = "";
      this.flagUserFound = false;
      document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';
      document.getElementById('basic-addon2').style.backgroundColor = '#f8f5f0';
      this.cardNumber = "";
      this.flagCaUsFound = false;
    } else {
      if (this.cedula.length != 10) {
        this.nfLael = "";
        document.getElementById("basic-addon3").style.backgroundColor = "#FF4B36";
        this.flagUserFound = false;
        document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';
        document.getElementById('basic-addon2').style.backgroundColor = '#f8f5f0';
        this.cardNumber = "";
        this.flagCaUsFound = false;
      }
      if (this.cedula.length == 10) {
        if (this.checked === true) {
          if (!this.validateService.validarRucCedula(this.cedula)) {
            this.messageGrowlService.notify('error', 'Error', 'Cedula Inválida!');
          } else {
            this.checkClient();
          }
        } else {
          this.checkClient();
        }
      }
    }
  }

  checkClient() {
    let a = undefined;
    this.activeCardsService.searchByCI(this.cedula).subscribe(data => {
      a = data[0];
      if (a === undefined) {
        this.searchUser = this.clientes.find(x => x.cedula === this.cedula);
        if (this.searchUser !== undefined) {
          this.searchUser.id_tipo_cliente = this.searchById(this.searchUser.id_tipo_cliente, this.tipo_clientes);
          document.getElementById('basic-addon3').style.backgroundColor = '#8FC941';
          this.flagUserFound = true;
          this.checkCard();
          setTimeout(function () {
            document.getElementById('numero').focus();
          }, 0)
          if (this.flagCardFound && this.flagUserFound) {
            this.flagCaUsFound = true;
          } else {
            this.flagCaUsFound = false;
          }
        } else {
          this.flagCaUsFound = false;
          this.nfLael = "Cliente no encontrado.";
          document.getElementById("basic-addon3").style.backgroundColor = "#FF4B36";
          this.flagUserFound = false;
          this.cardNumber = "";
        }
      } else {
        this.messageGrowlService.notify('warn', 'Advertencia', 'El usuario ingresado ya registra un tarjeta activa!');
      }
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  onChangeCI() {
    if (this.cedula.length != 10) {
      document.getElementById("ciA").style.borderColor = "#FF4B36";
      this.validCI = false;
    } else {
      if (this.checked === true) {
        if (!this.validateService.validarRucCedula(this.cedula)) {
          this.messageGrowlService.notify('error', 'Error', 'Cedula Inválida!');
          document.getElementById("ciA").style.borderColor = "#FF4B36";
          this.validCI = false;
        } else {
          document.getElementById("ciA").style.borderColor = "#5ff442";
          this.checkClient1();
        }
      } else {
        this.checkClient1();
      }
    }
  }

  checkClient1() {
    this.searchUser = this.clientes.find(x => x.cedula === this.cedula);
    if (this.searchUser === undefined) {
      this.validCI = true;
    } else {
      this.validCI = false;
      this.messageGrowlService.notify('warn', 'Advertencia', 'El cliente ya ha sido ingresado!');
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
      document.getElementById("correo").style.borderColor = "#FF4B36";
    }
  }

  onChangeDescAdd($event) {
    this.descTarjeta = this.descTarjeta.toLowerCase();
  }

  onChangeDescUpdate($event) {
    this.updateTarjeta.descripcion = this.updateTarjeta.descripcion.toLowerCase();
  }

  insertClientCard() {
    let activeCard = {
      idFactura: '',
      ci: '',
      cardNumber: '',
      nombre: '',
      fechaHora: this.validateService.getDateTimeEs(),
      cantMujeres: 0,
      cantHombres: 0,
      egresoMujeres: 0,
      egresoHombres: 0,
      ingresoMujeres: 0,
      ingresoHombres: 0
    }
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
    activeCard.ci = newClient.cedula;
    activeCard.cardNumber = newClient.tarjeta;
    activeCard.cantMujeres = this.cantMujeres;
    activeCard.cantHombres = this.cantHombres;
    let total = this.cantMujeres + this.cantHombres;
    if (total > 0) {
      this.clienteService.updateCliente(newClient).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', 'Tarjeta ingresada!');
        //set factura & detalle factura
        let auxM = {
          fecha: this.validateService.getDateTimeEs(),
          cantidad: this.cantMujeres,
          descripcion: 'cover mujer',
          total: (this.cantMujeres * this.coverMujeres),
          precio_venta: this.coverMujeres,
          vendedor: this.us.id
        }
        let auxH = {
          fecha: this.validateService.getDateTimeEs(),
          cantidad: this.cantHombres,
          descripcion: 'cover hombre',
          total: (this.cantHombres * this.coverHombres),
          precio_venta: this.coverHombres,
          vendedor: this.us.id
        }
        let detalle: any = [];
        detalle.push(auxM);
        detalle.push(auxH);
        let newFactura = {
          cedula: this.searchUser.cedula,
          num_factura: '',
          num_autorizacion: '',
          ruc: '',
          nombre: this.searchUser.nombre + ' ' + this.searchUser.apellido,
          telefono: this.searchUser.telefono,
          direccion: 'Riobamba',
          detalleFacturaV: detalle
        }
        activeCard.nombre = newFactura.nombre;
        this.setDvInsertCard();
        this.facturaService.register(newFactura).subscribe(data => {
          activeCard.idFactura = data._id;
          this.insertIdFactCiCarNumber(activeCard);
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
    }
  }

  setDvInsertCard() {
    this.flagUserFound = false;
    this.flagCardFound = false;
    this.nfLael = '';
    this.cardNumber = '';
    this.cedula = '';
    this.cantMujeres = 0;
    this.cantHombres = 0;
    document.getElementById("basic-addon3").style.backgroundColor = '';
    document.getElementById("basic-addon1").style.backgroundColor = '';
    document.getElementById("basic-addon2").style.backgroundColor = '';
    document.getElementById("basic-addon4").style.backgroundColor = '';
  }

  insertIdFactCiCarNumber(activeCard) {
    this.activeCardsService.register(activeCard).subscribe(data => {
      console.log(data)
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  onChangeAddT($event) {
    this.cardNumberGT = this.cardNumberGT.toLowerCase();
    if (this.cardNumberGT.length === 9) {
      if (this.cardNumberGT.charAt(0).localeCompare('ñ') == 0 && this.cardNumberGT.charAt(8).localeCompare('_') == 0) {
        let existingCard = this.lstCards.find(x => x.numero === this.cardNumberGT);
        if (existingCard === undefined) {
          this.flagCN = true;
          document.getElementById('basic-addon7').style.backgroundColor = '#8FC941';
          document.getElementById('basic-addon8').style.backgroundColor = '#f8f5f0';
        } else {
          this.messageGrowlService.notify('warn', 'Advertencia', 'La tarjeta ya fue ingresada!');
        }
      } else {
        this.flagCN = false;
        document.getElementById("basic-addon8").style.backgroundColor = "#FF4B36";
        document.getElementById('basic-addon7').style.backgroundColor = '#f8f5f0';
      }
    } else {
      this.flagCN = false;
      document.getElementById("basic-addon8").style.backgroundColor = "#FF4B36";
      document.getElementById('basic-addon7').style.backgroundColor = '#f8f5f0';
    }
  }

  onChangeAddTU($event) {
    if (this.cardNumberGT.length === 9) {
      if (this.cardNumberGT.charAt(0).localeCompare('ñ') == 0 && this.cardNumberGT.charAt(8).localeCompare('_') == 0) {
        this.flagCN = true;
        document.getElementById('basic-addon9').style.backgroundColor = '#8FC941';
        document.getElementById('basic-addon10').style.backgroundColor = '#f8f5f0';
      } else {
        this.flagCN = false;
        document.getElementById("basic-addon10").style.backgroundColor = "#FF4B36";
        document.getElementById('basic-addon9').style.backgroundColor = '#f8f5f0';
      }
    } else {
      this.flagCN = false;
      document.getElementById("basic-addon10").style.backgroundColor = "#FF4B36";
      document.getElementById('basic-addon9').style.backgroundColor = '#f8f5f0';
    }
  }

  changeTC() {
    if (this.selectedTipoTarjeta.localeCompare('VIP')) {
      this.flagTC = true;
    } else {
      this.flagTC = false;
    }
  }

  changeTCU() {
    if (this.updateTarjeta.tipo.localeCompare('VIP')) {
      this.flagTCU = true;
    } else {
      this.flagTCU = false;
    }
  }

  setCursorAddT() {
    document.getElementById('basic-addon7').style.backgroundColor = '#f8f5f0';
    document.getElementById('basic-addon8').style.backgroundColor = '#f8f5f0';
    this.cardNumberGT = "";
    this.descTarjeta = "";
    this.limiteConsumo = 100;
    this.flagTC = true;
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
    if (event.data.tipo.localeCompare('VIP')) {
      this.flagTCU = true;
    } else {
      this.flagTCU = false;
    }
    this.updateTarjeta = event.data;
    this.oldCard = event.data;
    this.lstAddCardCI1 = [];
    for (let entry of this.lstAddCardCI) {
      this.lstAddCardCI1.push(entry);
    }
    let b = this.clientes.find(x => x.cedula === event.data.cedula);
    if (b !== undefined) {
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
  }

  public ngOnInitCards() {
    this.tipoClienteService.getAll().subscribe(tc => {
      this.tipo_clientes = tc;
      this.citiesDD = [];
      for (let x of tc) {
        this.citiesDD.push({ label: x.desc_tipo_cliente, value: x.desc_tipo_cliente });
      }
      this.selected_tipo_cliente = this.tipo_clientes[0];
      this.clienteService.getAll().subscribe(c => {
        this.clientes = c;
        let i = 0;
        this.clientesC = [];
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

  ngOnInitClient() {

    this.telefono = '';
    this.nombre = '';
    this.apellido = '';
    this.correo = '';
    this.sexo = 'M'
    var initial = new Date(this.getDate()).toLocaleDateString().split("/");
    this.fecha_nacimiento = [initial[0], initial[1], initial[2]].join('/');
    this.selected_tipo_cliente = '';
  }

  /*TAB CLOSE*/
  openFP(): void {
    this.showDialogFP = true;
    if (this.totalPagar !== 0) {
      this.colorConsCero = 'ui-state-highlight ui-message ui-corner-all';
      //this.colorConsCero = 'ui-state-error-text ui-message ui-corner-all';
      this.textoConsumo = 'Consumo normal';
      this.flagConsCero = false;
    }
  }
  onChangeFPE($event) {
    if (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque > parseFloat(this.totalPagar)) {
      this.fpEfectivo = 0;
      setTimeout(function () {
        let v = document.getElementById('fpEfectivo');
        if (v != null) {
          v.click();
          this.fpEfectivo = 0;
        }
      }, 0);
      this.flagErrorFP = true;
      this.campoFP = 'Efectivo';
      this.maximoFP = this.totalPagar - (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque);
    } else {
      this.flagErrorFP = false;
    }
  }

  onChangeFPT($event) {
    if (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque > parseFloat(this.totalPagar)) {
      this.fpTarjeta = 0;
      setTimeout(function () {
        let v = document.getElementById('fpTarjeta');
        if (v != null) {
          v.click();
          this.fpTarjeta = 0;
        }
      }, 0);
      this.campoFP = 'Tarjeta de Crédito';
      this.maximoFP = this.totalPagar - (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque);
      this.flagErrorFP = true;
    } else {
      this.flagErrorFP = false;
    }
  }

  onChangeFPC($event) {
    if (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque > parseFloat(this.totalPagar)) {
      this.fpPorCobrar = 0;
      setTimeout(function () {
        let v = document.getElementById('fpPorCobrar');
        if (v != null) {
          v.click();
          this.fpPorCobrar = 0;
        }
      }, 0);
      this.campoFP = 'Crédito Directo';
      this.maximoFP = this.totalPagar - (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque);
      this.flagErrorFP = true;
    } else {
      this.flagErrorFP = false;
    }
  }

  onChangeFPCH($event) {
    if (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque > parseFloat(this.totalPagar)) {
      this.fpCheque = 0;
      setTimeout(function () {
        let v = document.getElementById('fpCheque');
        if (v != null) {
          v.click();
          this.fpCheque = 0;
        }
      }, 0);
      this.campoFP = 'Cheque';
      this.maximoFP = this.totalPagar - (this.fpEfectivo + this.fpTarjeta + this.fpPorCobrar + this.fpCheque);
      this.flagErrorFP = true;
    } else {
      this.flagErrorFP = false;
    }
  }

  insertRuc($event) {
    this.flagInsertRuc = !this.flagInsertRuc;
    if (!this.selectedRucFactura) {
      this.rucFactura = 'Consumidor Final';
      this.telefonoS = '9999999999';
      this.direccionS = 'Riobamba';
      this.flagCheckVenta = true;
      this.flagFP = false;
    } else {
      this.checkCiRuc();
      this.flagFP = true;
      if (this.searchUserS !== undefined) {
        this.rucFactura = this.searchUserS.ci;
      }
      setTimeout(function () {
        document.getElementById('inputCiRuc').focus();
      }, 0)
    }
  }

  setDefaultValues() {
    this.rucFactura = 'Consumidor Final';
    this.telefonoS = '9999999999';
    this.direccionS = 'Riobamba';
    this.flagFP = false;
  }

  checkCiRuc() {
    if (this.rucFactura.length != 10) {
      document.getElementById("addonRUC2").style.color = '#FF4B36';
      document.getElementById("addonRUC1").style.color = '';
      this.flagCheckVenta = false;
    }
    if (this.rucFactura.length != 13) {
      document.getElementById("addonRUC2").style.color = "#FF4B36";
      document.getElementById("addonRUC1").style.color = '';
      this.flagCheckVenta = false;
    }
    if (this.rucFactura.length == 10 || this.rucFactura.length == 13) {
      if (!this.validateService.validarRucCedula(this.rucFactura)) {
        this.messageGrowlService.notify('error', 'Error', 'Cedula/Ruc Inválido!');
        document.getElementById("addonRUC2").style.color = "#FF4B36";
        document.getElementById("addonRUC1").style.color = '';
        this.flagCheckVenta = false;
      } else {
        document.getElementById("addonRUC1").style.color = "#5ff442";
        document.getElementById("addonRUC2").style.color = '';
        this.flagCheckVenta = true;
      }
    }
  }

  setClient() {
    if (this.selectedRucFactura) {
      this.rucFactura = '0502926819';
      this.checkCiRuc();
      setTimeout(function () {
        document.getElementById('inputCiRuc').focus();
      }, 0)
    } else {
      this.rucFactura = '';
    }
  }

  onChangeClose($event) {
    this.cardNumberS = this.cardNumberS.toLowerCase();
    let finalChar = this.cardNumberS.slice(-1)
    if (this.cardNumberS.length == 9) {
      if (finalChar.localeCompare("_") == 0) {
        this.checkActiveCard(this.cardNumberS);
      }
    } else {
      document.getElementById('addonCnS2').style.backgroundColor = '#FF4B36';
      document.getElementById('addonCnS1').style.backgroundColor = '';
      this.flagConfirmFP = true;
      this.flagCardSFound = false;
      this.nfLaelS = '';
      this.lstConsumo = [];
      this.totalPagar = 0;
    }
  }

  checkActiveCard(card) {
    this.activeCardsService.searchByCard(card).subscribe(data => {
      if (data.length > 0) {
        this.searchUserS = {
          ci: data[0].ci,
          nombre: data[0].nombre,
          cantMujeres: data[0].cantMujeres,
          cantHombres: data[0].cantHombres,
          egresoMujeres: data[0].egresoMujeres,
          egresoHombres: data[0].egresoHombres,
          idFactura: data[0].idFactura
        }
        this.messageGrowlService.notify('info', 'Información', 'Tarjeta Encontrada!');
        this.flagConfirmFP = false;
        this.flagCardSFound = true;
        document.getElementById('addonCnS2').style.backgroundColor = '';
        document.getElementById('addonCnS1').style.backgroundColor = '#8FC941';//green
        this.searchConsumo(this.searchUserS.idFactura);
      } else {
        this.flagConfirmFP = true;
        this.flagCardSFound = false;
        this.nfLaelS = 'Tarjeta no ingresada.';
        this.lstConsumo = [];
        this.totalPagar = 0;
        this.messageGrowlService.notify('warn', 'Advertencia', 'Tarjeta No Encontrada!');
        document.getElementById('addonCnS2').style.backgroundColor = '#FF4B36';//soft red
        document.getElementById('addonCnS1').style.backgroundColor = '';//default color
      }
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Ingresa un número de personas!');
    })
  }

  searchConsumo(idFactura) {
    this.facturaService.getById(idFactura).subscribe(data => {
      this.lstConsumo = [];
      this.totalPagar = 0;
      for (let entry of data[0].detalleFacturaV) {
        let aux = {
          descripcion: entry.descripcion,
          precio_venta: this.decimalPipe.transform(entry.precio_venta, '1.2-2'),
          total: this.decimalPipe.transform(entry.total, '1.2-2'),
          cantidad: this.decimalPipe.transform(entry.cantidad, '1.2-2'),
          fecha: entry.fecha
        }
        this.totalPagar += parseFloat(aux.total);
        this.lstConsumo.push(aux);
      }
      this.totalPagar = this.decimalPipe.transform(this.totalPagar, '1.2-2')
      this.totalConsumo = parseFloat(this.totalPagar);
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  confirmFP() {
    console.log(this.fpPorCobrar)
    /*let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tabs</title>
          <table class="table table-striped">
              <thead>
              <tr>
                <th style="text-align: center">Tipo de Promocion</th>
                <th style="text-align: center">Descripcion</th>
              </tr>
              </thead>
              <tbody style="text-align: center">
                <tr>
                <td>1</td>
                  <td>Tipo 1</td>
                </tr>
                <tr>
                <td>2</td>
                  <td>Tipo 2</td>
                </tr>
              </tbody>
            </table>
          </head>
          <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();*/
    //Delete active card
    /*this.activeCardsService.searchByCard('ñ1234567_').subscribe(data => {
      this.activeCardsService.delete(data[0]._id).subscribe(data => {
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      })
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })*/
    //this.showDialogFP = true;
  }

  onRowSelectTC(event) {
    console.log(event.data)
    this.showDateHour = event.data.fecha;
  }

  onChangeEgreso($event) {
    this.cardNumberE = this.cardNumberE.toLowerCase();
    let finalChar = this.cardNumberE.slice(-1)
    if (this.cardNumberE.length == 9) {
      if (finalChar.localeCompare("_") == 0) {
        this.checkActiveCardE(this.cardNumberE);
      }
    } else {
      document.getElementById('addonCnE2').style.backgroundColor = '#FF4B36';
      document.getElementById('addonCnE1').style.backgroundColor = '';
      this.flagCardEFound = false;
      this.nfLaelE = '';
    }
  }

  checkActiveCardE(card) {
    this.activeCardsService.searchByCard(card).subscribe(data => {
      if (data.length > 0) {
        this.searchUserE = {
          ci: data[0].ci,
          nombre: data[0].nombre,
          cantMujeres: data[0].cantMujeres,
          cantHombres: data[0].cantHombres,
          egresoMujeres: data[0].egresoMujeres,
          egresoHombres: data[0].egresoHombres,
          idFactura: data[0].idFactura,
          cardNumber: data[0].cardNumber,
          ingresoMujeres: data[0].ingresoMujeres,
          ingresoHombres: data[0].ingresoHombres,
          _id: data[0]._id
        }
        //fill partial consummation
        this.fillPartialSales(data[0].idFactura);
        this.showDateApertura = data[0].fechaHora.split(' ')[0];
        this.showHourApertura = data[0].fechaHora.split(' ')[1];

        this.messageGrowlService.notify('info', 'Información', 'Tarjeta Encontrada!');
        this.flagCardEFound = true;
        document.getElementById('addonCnE2').style.backgroundColor = '';
        document.getElementById('addonCnE1').style.backgroundColor = '#8FC941';//green
        this.searchConsumo(this.searchUserE.idFactura);
      } else {
        this.flagCardEFound = false;
        this.nfLaelE = 'Tarjeta no ingresada.';
        this.messageGrowlService.notify('warn', 'Advertencia', 'Tarjeta No Encontrada!');
        document.getElementById('addonCnE2').style.backgroundColor = '#FF4B36';//soft red
        document.getElementById('addonCnE1').style.backgroundColor = '';//default color
      }
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Ingresa un número de personas!');
    })
  }

  changeCantidad($event) {
    for (let i = 0; i < this.lstComprasCliente.length; i++) {
      if (this.lstComprasCliente[i].cantidad !== this.lstComprasCliente[i].cantidadOld) {
        this.cantColor = '#FF0000';
      } else {
        this.cantColor = '#0000FF'
      }
    }
  }

  fillPartialSales(idFactura) {
    this.facturaService.getById(idFactura).subscribe(data => {
      this.lstComprasCliente = [];
      for (let entry of data[0].detalleFacturaV) {
        let aux = {
          'fecha': entry.fecha.split(' ')[0],
          'hora': entry.fecha.split(' ')[1],
          'cantidad': entry.cantidad,
          'descripcion': entry.descripcion,
          'precio_venta': entry.precio_venta,
          'total': entry.total,
          'cantidadOld': entry.cantidad
        }
        this.lstComprasCliente.push(aux);
      }
    }, err => {
      console.log(err);
    })
  }

  ConfEgreso() {
    if ((this.cantSalenH + this.cantSalenM) > 0) {
      let detalle: any = [];
      let flagIngresoM = false;
      let flagIngresoH = false;
      if (this.selectedIeMujeres.localeCompare('Ingreso') == 0) {
        if (this.cantSalenM > 0) {
          let aux = {
            fecha: this.validateService.getDateTimeEs(),
            cantidad: this.cantSalenM,
            descripcion: 'cover mujer',
            total: (this.cantSalenM * this.coverMujeres),
            precio_venta: this.coverMujeres
          }
          detalle.push(aux);
          flagIngresoM = true;
        }
      } else { }
      if (this.selectedIeHombres.localeCompare('Ingreso') == 0) {
        if (this.cantSalenH > 0) {
          let aux = {
            fecha: this.validateService.getDateTimeEs(),
            cantidad: this.cantSalenH,
            descripcion: 'cover hombre',
            total: (this.cantSalenH * this.coverHombres),
            precio_venta: this.coverHombres
          }
          detalle.push(aux);
          flagIngresoH = true;
        }
      } else { }

      //Update activeCards
      if (flagIngresoM) {
        this.searchUserE.ingresoMujeres = this.cantSalenM;
      } else {
        this.searchUserE.egresoMujeres = this.cantSalenM;
      }
      if (flagIngresoH) {
        this.searchUserE.ingresoHombres = this.cantSalenH;
      } else {
        this.searchUserE.egresoHombres = this.cantSalenH
      }

      this.activeCardsService.update(this.searchUserE).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', 'Se ha actualizado la factura!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      })
      if (detalle.length > 0) {
        this.updateConsumo(this.searchUserE.idFactura, detalle);
      }

    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona la cantidad de personas que entran/salen!');
    }

  }

  updateConsumo(idFactura, newFila) {
    this.facturaService.getById(idFactura).subscribe(data => {
      let updatedFact = data;
      let vecDF: any = [];
      for (let entry of data[0].detalleFacturaV) {
        let aux = {
          descripcion: entry.descripcion,
          precio_venta: entry.precio_venta,
          total: entry.total,
          cantidad: entry.cantidad,
          fecha: entry.fecha
        }
        vecDF.push(aux)
      }
      for (let entry of newFila) {
        let aux = {
          descripcion: entry.descripcion,
          precio_venta: entry.precio_venta,
          total: entry.total,
          cantidad: entry.cantidad,
          fecha: entry.fecha
        }
        vecDF.push(aux)
      }
      updatedFact[0].detalleFacturaV = vecDF;
      this.facturaService.update(updatedFact[0]).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', 'Se ha actualizado la factura!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      })
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })
  }

  openCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_oi0sKPJYLGjdvOXOM8tE8cMa',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    handler.open({
      name: 'ManagerBox',
      description: 'Pago en Línea',
      amount: 20
    });

  }

  showComprasDetail() {
    this.showCompras = true;
  }

  updateComprasDetail() {
    console.log(this.lstComprasCliente);
    let flagDtChanges = false;
    let n = this.lstComprasCliente.length;
    for (let i = 0; i < n; i++) {
      if (this.lstComprasCliente[i].cantidad !== this.lstComprasCliente[i].cantidadOld) {
        flagDtChanges = true;
        break;
      }
    }
    if (flagDtChanges) {
      this.facturaService.getById(this.searchUserE.idFactura).subscribe(data => {
        let updatedFact = data;
        let vecDF: any = [];
        for (let entry of this.lstComprasCliente) {
          let aux = {
            precio_venta: entry.precio_venta,
            total: (entry.precio_venta * entry.cantidad),
            descripcion: entry.descripcion,
            cantidad: entry.cantidad,
            fecha: entry.fecha
          }
          vecDF.push(aux);
        }
        updatedFact[0].detalleFacturaV = vecDF;
        this.facturaService.update(updatedFact[0]).subscribe(data => {
          this.messageGrowlService.notify('info', 'Información', 'Se ha actualizado la factura!');
          this.showCompras = false;
          this.checkActiveCardE(this.cardNumberE);
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
        })
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      })
    } else {
      this.messageGrowlService.notify('warn', 'Advertencia', 'No se realizaron cambios!');
    }
  }

  /* TAB TARJETAS*/
  onChangeG($event) {
    this.cardNumberG = this.cardNumberG.toLowerCase();
    if (this.cardNumberG.length == 0) {
      document.getElementById('addonCnT2').style.backgroundColor = '';
      document.getElementById('addonCnT1').style.backgroundColor = '';
    } else {
      if (this.cardNumberG.length == 9) {
        let finalChar = this.cardNumberG.slice(-1);
        if (finalChar.localeCompare("_") == 0) {
          this.tarjetaService.getByNumero(this.cardNumberG).subscribe(data => {
            if (data.length === 0) {
              document.getElementById('addonCnT1').style.backgroundColor = '#8FC941';//green
              document.getElementById('addonCnT2').style.backgroundColor = '';
              this.onAddTSubmitNew();
            } else {
              document.getElementById('addonCnT2').style.backgroundColor = '#FF4B36';
              document.getElementById('addonCnT1').style.backgroundColor = '';
              this.messageGrowlService.notify('warn', 'Advertencia', 'Esta tarjeta ya ha sido ingrsada!');
            }
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
          })
        }
      } else {
        document.getElementById('addonCnT2').style.backgroundColor = '#FF4B36';
        document.getElementById('addonCnT1').style.backgroundColor = '';
        this.flagCardEFound = false;
        this.nfLaelE = '';
      }
    }
  }

  searchCard(card) {

  }

  onAddTSubmitNew() {
    const newCard = {
      numero: this.cardNumberG,
      nombre: '',
      apellido: '',
      cedula: '',
      limite: this.limiteConsumo,
      descripcion: '',
      tipo: ''
    }
    this.tarjetaService.register(newCard).subscribe(data => {
      this.sourceT.add(newCard);
      this.sourceT.refresh();
      let row = this.lstAddCardCI.find(x => x.value.cedula === newCard.cedula);
      this.ngOnInit();
      this.ngOnInitCards();
      this.showDialogT = false;
      this.messageGrowlService.notify('success', 'Exito', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    })

  }

}
