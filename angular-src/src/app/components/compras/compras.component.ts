import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DecimalPipe, SlicePipe } from '@angular/common';

import { MdDialog } from '@angular/material';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

import { ValidateService } from '../../services/validate.service';
import { FormatterService } from '../../services/formatter.service';
import { MessageGrowlService } from '../../services/message-growl.service';
import { KardexService } from '../../services/kardex.service';
import { CiudadService } from '../../services/ciudad.service';
import { ComprasService } from '../../services/compras.service';
import { ProveedorService } from '../../services/proveedor.service';
import { ProductoService } from '../../services/producto.service';
import { TipoProductoService } from '../../services/tipo-producto.service';

import { Proveedor } from '../../models/proveedor';
import { Producto } from '../../models/producto';

import { IconRenderComponent } from '../image-render/icon-render.component';
import { PipeRenderComponent } from '../pipe-render/pipe-render.component';
import { ImageRenderComponent } from '../image-render/image-render.component';

import { UM } from '../globals';


@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  es: any;
  selectedUmMat: any;
  selectedUmMat1: any;
  selected_tipo_producto: any;
  lstUnidadMedida: any = [];
  lstUnidadMedida1: any = [];

  constructor(
    private validateService: ValidateService,
    private http: Http,
    private messageGrowlService: MessageGrowlService,
    private fs: FormatterService,
    private decimalPipe: DecimalPipe,
    private slicePipe: SlicePipe,
    private kardexService: KardexService,
    private ciudadService: CiudadService,
    private comprasService: ComprasService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private dialog: MdDialog,
    private tipoProductoService: TipoProductoService) {
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
    this.lstUnidadMedida = [];
    this.lstUnidadMedida.push({ label: 'Masa', value: 0 });
    this.lstUnidadMedida.push({ label: 'Volumen', value: 1 });
    this.lstUnidadMedida.push({ label: 'Unidades', value: 2 });
    this.selectedUmMat = this.lstUnidadMedida[0];
    this.lstUnidadMedida1 = [];
    this.lstUnidadMedida1.push({ label: 'Gramos', value: 0 });
    this.lstUnidadMedida1.push({ label: 'Onza', value: 1 });
    this.lstUnidadMedida1.push({ label: 'Libras', value: 2 });
    this.lstUnidadMedida1.push({ label: 'Kilogramos', value: 3 });
    this.selectedUmMat1 = this.lstUnidadMedida1[0];
  }

  ngOnInit() {
    this.ngOnInitProve();
    this.ngOnInitCompras();
    //this.notifyMe();
  }

  notifyMe() {
    Notification.requestPermission(function (permission) {
      // Si el usuario acepta, lanzamos la notificación
      if (permission === "granted") {
        var notification = new Notification("Bienvenido..!!")
      }
    });
  }

  onChangeUmMat($event) {
    if (this.selectedUmMat.value === 0) {
      this.flagUnits = true;
      this.lstUnidadMedida1 = [];
      this.lstUnidadMedida1.push({ label: 'Gramos', value: 0 });
      this.lstUnidadMedida1.push({ label: 'Onza', value: 1 });
      this.lstUnidadMedida1.push({ label: 'Libras', value: 2 });
      this.lstUnidadMedida1.push({ label: 'Kilogramos', value: 3 });
      this.selectedUmMat1 = this.lstUnidadMedida1[0];
    }
    if (this.selectedUmMat.value === 1) {
      this.flagUnits = true;
      this.lstUnidadMedida1 = [];
      this.lstUnidadMedida1.push({ label: 'Mililitros', value: 0 });
      this.lstUnidadMedida1.push({ label: 'Onza Liquida', value: 1 });
      this.lstUnidadMedida1.push({ label: 'Litros', value: 2 });
      this.selectedUmMat1 = this.lstUnidadMedida1[0];
    }
    if (this.selectedUmMat.value === 2) {
      this.flagUnits = false;
      this.lstUnidadMedida1 = [];
    }
  }

  /*GESTION PROVEEDOR*/
  settingsProve = {};
  sourceProve: LocalDataSource = new LocalDataSource();
  showDialogProve = true;
  showDialogProveU = false;
  objProve: Proveedor;
  showRepresentante = false;
  representante = {
    nombre: '',
    telefono: '',
    correo: '',
    descripcion: '',
    value: ''
  }
  filteredCiudades: any[];
  citiesEcu: any[];
  ciudad: string;
  lstProveedores: any[];
  showProveDialog;
  showComprasDetail = false;

  filterCiudad(event) {
    let query = event.query;
    this.filteredCiudades = this.filterCiudadS(query, this.citiesEcu);
  }

  filterCiudadS(query, countries: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < countries.length; i++) {
      let country = countries[i];
      if (country.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    return filtered;
  }

  onChangeNombreProve($event) {
    this.objProve.nombre_proveedor = this.fs.toTitleCase(this.objProve.nombre_proveedor);
  }

  validCorreo = true;
  onChangeEmail($event) {
    this.objProve.correo = this.objProve.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.objProve.correo)) {
      this.messageGrowlService.notify('success', 'Éxito', 'Correo válido!');
      document.getElementById("correo").style.borderLeft = "5px solid #42A948"; /* green */
      this.validCorreo = false;
    }
    else {
      document.getElementById("correo").style.borderLeft = "5px solid #a94442"; /* red */
      this.validCorreo = true;
    }
  }

  onChangeEmailU($event) {
    this.objProve.correo = this.objProve.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.objProve.correo)) {
      this.messageGrowlService.notify('success', 'Éxito', 'Correo válido!');
      document.getElementById("correoU").style.borderLeft = "5px solid #42A948"; /* green */
      this.validCorreo = false;
    }
    else {
      document.getElementById("correoU").style.borderLeft = "5px solid #a94442"; /* red */
      this.validCorreo = true;
    }
  }

  validRuc = true;
  onChangeRuc() {
    if (this.objProve.ruc.length != 13) {
      document.getElementById("rucProve").style.borderLeft = "5px solid #a94442"; /* red */
      this.validRuc = true;
    } else {
      if (!this.validateService.validarRucCedula(this.objProve.ruc)) {
        this.messageGrowlService.notify('error', 'Error', 'Ruc inválido!');
        document.getElementById("rucProve").style.borderLeft = "5px solid #a94442"; /* red */
        this.validRuc = true;
      } else {
        this.messageGrowlService.notify('success', 'Éxito', 'Ruc válido!');
        document.getElementById("rucProve").style.borderLeft = "5px solid #42A948"; /* green */
        this.validRuc = false;
      }
    }
  }

  onChangeRucU() {
    if (this.objProve.ruc.length != 13) {
      document.getElementById("rucProveU").style.borderLeft = "5px solid #a94442"; /* red */
      this.validRuc = true;
    } else {
      if (!this.validateService.validarRucCedula(this.objProve.ruc)) {
        this.messageGrowlService.notify('error', 'Error', 'Cedula Inválida!');
        document.getElementById("rucProveU").style.borderLeft = "5px solid #a94442"; /* red */
        this.validRuc = true;
      } else {
        this.messageGrowlService.notify('success', 'Éxito', 'Ruc válido!');
        document.getElementById("rucProveU").style.borderLeft = "5px solid #42A948"; /* green */
        this.validRuc = false;
      }
    }
  }

  onChangeCiudad($event) {
    this.objProve.ciudad = this.fs.toTitleCase(this.objProve.ciudad);
  }

  setCursorAddProve() {
    setTimeout(function () {
      document.getElementById('nombreProve').focus();
      setOriginalColorsProve();
      //document.getElementById('telProve').autocomplete = "off"; 
    }, 0);
    this.setDefaultProve(1);
  }

  check() {
    console.log(JSON.parse(localStorage.getItem('lstProveedor')));
    console.log(this.lstProveedores);
  }

  saveProveedor() {
    this.proveedorService.register(this.objProve).subscribe(data => {
      this.lstProveedores.push(data);
      this.sourceProve.refresh();
      this.setDefaultProve(1);
      this.showDialogProve = false;
      localStorage.setItem('lstProveedor', JSON.stringify(this.lstProveedores));
      this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
  }

  showProveedor(event: any) {
    this.showProveDialog = event.data.nombre_proveedor;
    this.showComprasDetail = true;
  }

  setCursorUpdateProve(event: any) {
    setTimeout(function () {
      document.getElementById('nombreProveU').focus();
      document.getElementById("rucProveU").style.borderLeft = "5px solid #42A948"; /* green */
      document.getElementById("correoU").style.borderLeft = "5px solid #42A948"; /* green */
    }, 0);
    let lst = JSON.parse(localStorage.getItem('lstProveedor'));
    let prov = lst.filter(function (obj) {
      return obj._id.localeCompare(event.data._id) === 0;
    });
    this.objProve = prov[0];
    this.validCorreo = false;
    this.validRuc = false;
  }
  provUpdt: Proveedor;
  searchOldProve(id) {
    let lst = JSON.parse(localStorage.getItem('lstProveedor'));
    this.provUpdt = lst.filter(function (obj) {
      return obj._id.localeCompare(id) === 0;
    });
  }

  updateProveedor() {
    this.proveedorService.update(this.objProve).subscribe(data => {
      this.searchOldProve(data._id);
      this.updateFromLocalStorage(this.objProve);
      this.sourceProve.refresh();
      this.setDefaultProve(2);
      this.showDialogProveU = false;
      this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
  }

  onDeleteProve(event): void {
    this.openDialogProve(event.data);
  }

  openDialogProve(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          this.sourceProve.remove(data);
          this.deleteFromLocalStorage(data);
          // remove from database
          this.proveedorService.delete(data._id).subscribe(dataD => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');
          });
        }
      }
    });
  }

  setDefaultProve(op) {
    this.objProve = {
      nombre_proveedor: '',
      ruc: '',
      direccion: '',
      ciudad: undefined,
      telefono: '',
      correo: '',
      comprasV: [],
      representanteV: []
    };
    this.validRuc = true;
    this.validCorreo = true;
    if (op = 1) {
      setOriginalColorsProve();
    } else {
      setOriginalColorsProveU();
    }

  }

  deleteFromLocalStorage(element) {
    this.lstProveedores = this.lstProveedores.filter(function (el) {
      return el._id !== element._id
    });
    localStorage.setItem('lstProveedor', JSON.stringify(this.lstProveedores));
  }

  updateFromLocalStorage(data) {
    for (var i in this.lstProveedores) {
      if (this.lstProveedores[i]._id == data._id) {
        this.lstProveedores[i] = data;
        break;
      }
    }
    localStorage.setItem('lstProveedor', JSON.stringify(this.lstProveedores));
  }

  //Representante Proveedor
  showRepre() {
    this.showRepresentante = true;
    setTimeout(function () {
      document.getElementById('nombreRepre').focus();
      setOriginalColorsRepre();
    }, 0);
    this.setDefaultRepre();
  }

  onChangeNombreRepre($event) {
    this.representante.nombre = this.representante.nombre.trim();
    this.representante.nombre = this.fs.toTitleCase(this.representante.nombre);
  }

  flagEmailRepre = true;
  onChangeEmailRepre($event) {
    this.representante.correo = this.representante.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.representante.correo)) {
      this.messageGrowlService.notify('success', 'Éxito', 'Correo válido!');
      document.getElementById("correoRepre").style.borderLeft = "5px solid #42A948"; /* green */
      this.flagEmailRepre = false;
    }
    else {
      document.getElementById("correoRepre").style.borderLeft = "5px solid #a94442"; /* red */
      this.flagEmailRepre = true;
    }
  }

  onChangeDescRepre($event) {
    this.representante.descripcion = this.representante.descripcion.trim();
  }

  addRepre() {
    this.representante.value = this.representante.nombre;
    this.objProve.representanteV = [...this.objProve.representanteV, this.representante];

    this.showRepresentante = false;
    this.representante = {
      nombre: '',
      telefono: '',
      correo: '',
      descripcion: '',
      value: ''
    }
    document.getElementById("correoRepre").style.borderLeft = "5px solid #a94442"; /* red */
    this.flagEmailRepre = true;
  }

  selectedRepre: any;
  deleteRepre(i) {
    this.objProve.representanteV.splice(i, 1);
  }

  setDefaultRepre() {
    this.representante = {
      nombre: '',
      telefono: '',
      correo: '',
      descripcion: '',
      value: ''
    };
    this.flagEmailRepre = true;
    setOriginalColorsRepre();
  }

  ngOnInitProve() {
    this.objProve = {
      nombre_proveedor: '',
      ruc: '',
      direccion: '',
      ciudad: undefined,
      telefono: '',
      correo: '',
      comprasV: [],
      representanteV: []
    };
    this.validRuc = true;
    this.showDialogProve = false;
    this.showDialogProveU = false;
    /* Get Ciudades */
    this.ciudadService.getAll().subscribe(countries => {
      this.citiesEcu = countries;
    });
    /* Get Proveedores*/
    /*this.proveedorService.getAll().subscribe(data => {

      if (this.lstProveedoresK.length > 0) {
        this.kardex.proveedor = this.lstProveedoresK[0];
      }

      this.kardexService.getAll().subscribe(data => {
        this.lstKardex = data
        let i = 0;
        for (const x of data) {
          const desc = this.searchDescProve(x.proveedor, this.lstProveedoresK);
          this.lstKardex[i].proveedor = desc;
          const desc1 = this.searchDescProd(x.desc_producto, this.productos);
          this.lstKardex[i].desc_producto = desc1;
          i++;
        }
        localStorage.setItem('lstKardex', JSON.stringify(this.lstKardex));
        this.sourceK = new LocalDataSource();
        this.sourceK.load(this.lstKardex);
        this.settingsK = {
          mode: 'external',
          noDataMessage: 'No existen registros',
          columns: {
            num_factura: {
              title: 'Número Factura',
              width: '14%'
            },
            fecha: {
              title: 'Fecha',
              width: '15%'
            },
            desc_producto: {
              title: 'Descripción Producto',
              width: '22%'
            },
            proveedor: {
              title: 'Proveedor',
              width: '22%'
            },
            cantidad: {
              title: 'Unidades',
              width: '9%'
            },
            total: {
              title: 'Total',
              width: '9%'
            },
            unidades_vendidas: {
              title: 'Unidades Vendidas',
              width: '9%',
              filter: false,
              type: 'custom',
              renderComponent: IconRenderKComponent
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
        }
      }, err => {
        console.log(err);
      })
    }, err => {
      console.log(err);
    })*/
  }

  /*GESTION COMPRAS*/
  settingsC = {};
  sourceC: LocalDataSource = new LocalDataSource();
  showDialogC = true;
  showDialogCU = false;
  selectedIeProd = 'Existente';
  flagProdC = false;
  typesProd: any[];
  objProdCompras: {
    producto: Producto,
    cantidad: 0,
    pcUnitario: 0,
    //unidadMedida: string,
    //contenido: 0,
    //pcAnterior: number,
    fecha: string,
    total: number,
    impuestos: any[]
  }
  selectedProdCompras: any;
  objCompras: {
    num_factura: '',
    fecha: Date,
    proveedor: Proveedor,
    vendedor: '',
    productosV: any[],
    desglose: any,
    formaPago: {
      fpEfectivo: 0,
      fpTarjeta: 0,
      fpPorCobrar: 0,
      fpCheque: 0
    },
    total: number
  }
  lstProveedoresR: any[] = [];
  checkedC = false;
  selectedTipoProd = 'Existente';
  subTotalPagarC = 0;
  flagErrorFP = false;
  campoFP;
  maximoFP;
  lstComprasProve: any[];
  showDialogProdC = false;
  objDesgloce = {
    subtotal: 0,
    iva: 0,
    ice: 0,
    otro: 0,
    descuento: 0,
    propina: 0,
    total: 0
  }
  prodCompra: Producto;
  lstProductos: Producto[];
  flagUnits = true;
  newProd: any;

  setCursorAddC() {
    setTimeout(function () {
      document.getElementById('num_facturaC').focus();
    }, 50);
  }
  validNumFact = true;
  mask = [/\d/, /\d/, /[1-9]/, '-', /\d/, /\d/, /[1-9]/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /[1-9]/];
  onChangeNumFact() {
    if (!this.validateService.validarNumFact(this.objCompras.num_factura)) {
      this.messageGrowlService.notify('success', 'Éxito', 'Número de factura válido!');
      document.getElementById("num_facturaC").style.borderLeft = "5px solid #42A948";
      this.validNumFact = false;
    } else {
      document.getElementById("num_facturaC").style.borderLeft = "5px solid #a94442";
      this.validNumFact = true;
    }
  }

  onClickSelectButton(event) {
    if (this.selectedIeProd.localeCompare('Existente') == 0) {
      this.flagProdC = false;
    } else {
      this.flagProdC = true;
      this.setCursorAddProdCompras();
    }
  }

  changeTipoProd(event) {
    if (this.selectedTipoProd.localeCompare('Existente') == 0) {
      this.flagProdC = false;
      this.setDvProdCompra();
    } else {
      this.flagProdC = true;
      this.setCursorAddProdCompras();
      this.setDvProdCompra();
    }
  }

  setCursorAddProdCompras() {
    setTimeout(function () {
      document.getElementById('desc_productoC').focus();
    }, 0);
  }

  prodAnterior: any;
  onChangeProdCompra() {
    let name: any = this.prodAnterior;
    let prod = this.lstProductos.filter(function (obj) {
      return obj.nombre.localeCompare(name) === 0;
    });
    prod[0].cant_existente = parseFloat(prod[0].cant_existente.toString());
    this.objProdCompras.producto = prod[0];
  }

  addProdCompra() {
    this.subTotalPagarC = 0;
    let um = this.selectedUmMat.label + '-' + this.selectedUmMat1.label;
    const gain = this.fs.add((this.fs.div(30, 100)), 1);
    let pvp = this.fs.times(this.objProdCompras.pcUnitario, gain)
    if (this.selectedTipoProd.localeCompare('Nuevo') === 0) {
      //Ingresar nuevo producto en tabla producto
      this.prodCompra = {
        nombre: this.objProdCompras.producto.nombre,
        precio_costo: this.objProdCompras.pcUnitario,
        precio_venta: pvp,
        utilidad: 30,
        cant_existente: this.objProdCompras.cantidad,
        cant_minima: 5,
        subproductoV: [],
        id_tipo_producto: this.selected_tipo_producto._id,
        path: this.selected_tipo_producto.path,
        contenido: this.objProdCompras.producto.contenido,
        promocion: [],
        unidad_medida: um,
        impuestosCompraV: this.objImpC,
        impuestosVentaV: [],
        recentIncome: true
      };
      console.log(this.prodCompra);
      /*this.productoService.registerProducto(this.prodCompra).subscribe(data => {
        this.ngOnInitProducto();
        this.ngOnInit();
        this.ngOnInitImp();
        this.messageGrowlService.notify('success', 'Éxito', 'Ingreso Exitoso!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      });*/
    } else {
      //Actualizar producto en tabla producto
      this.prodCompra = {
        nombre: this.objProdCompras.producto.nombre,
        precio_costo: this.objProdCompras.pcUnitario,
        precio_venta: pvp,
        utilidad: 30,
        cant_existente: this.objProdCompras.producto.cant_existente + this.objProdCompras.cantidad,
        cant_minima: this.objProdCompras.producto.cant_minima,
        subproductoV: this.objProdCompras.producto.subproductoV,
        id_tipo_producto: this.objProdCompras.producto.id_tipo_producto,
        path: this.objProdCompras.producto.path,
        contenido: this.objProdCompras.producto.contenido,
        promocion: this.objProdCompras.producto.promocion,
        unidad_medida: this.objProdCompras.producto.unidad_medida,
        impuestosCompraV: this.objProdCompras.impuestos,
        impuestosVentaV: [],
        recentIncome: true
      };
      /*this.productoService.updateProducto(this.prodCompra).subscribe(data => {
        this.ngOnInitProducto();
        this.ngOnInit();
        this.ngOnInitImp();
        this.messageGrowlService.notify('info', 'Éxito', 'Modificación Exitosa!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      });*/
    }
    //Add tabla compras
    this.addLstCompras();
    this.calcSubTotal();
    this.calcIva();
    this.calcIce();
    this.calcOtros();
    //Lista de impuestas de la factura
    /*this.objDesgloce = {
      subtotal: this.subTotalPagarC,
      iva: this.fs.sub(this.fs.times(this.subTotalPagarC, 1.12), this.subTotalPagarC),
      ice: 0,
      otro: 0,
      descuento: 0,
      propina: 0,
      total: this.fs.times(this.subTotalPagarC, 1.12)
    }*/
    this.showDialogProdC = false;
    this.setDvProdCompra();
  }

  addLstCompras() {
    let aux: any = [];
    aux = {
      cantidad: this.objProdCompras.cantidad,
      fecha: this.validateService.getDateTimeStamp(),
      impuestos: this.objProdCompras.impuestos,
      pcUnitario: this.objProdCompras.pcUnitario,
      producto: this.prodCompra,
      total: this.fs.times(this.objProdCompras.pcUnitario, this.objProdCompras.cantidad),
      crud: ''
    }
    //For insert or update
    if (!this.flagProdC) {
      aux.crud = 'u';
    } else {
      aux.crud = 'c';
    }
    this.lstComprasProve = [...this.lstComprasProve, aux];
  }

  calcSubTotal() {
    this.objDesgloce.subtotal = this.lstComprasProve.reduce(function (prev, cur) {
      return prev + cur.total;
    }, 0);
  }

  calcIva() {
    let acum = 0;
    for (let entry of this.lstComprasProve) {
      acum = this.fs.add(acum, this.fs.times(entry.cantidad, entry.impuestos[0].valor));
    }
    this.objDesgloce.iva = Number(acum.toFixed(2));
  }

  calcIce() {
    let acum = 0;
    for (let entry of this.lstComprasProve) {
      acum = this.fs.add(acum, this.fs.times(entry.cantidad, entry.impuestos[1].valor));
    }
    this.objDesgloce.ice = Number(acum.toFixed(2));
  }

  calcOtros() {
    let acum = 0;
    for (let entry of this.lstComprasProve) {
      let n = entry.impuestos.length;
      for (let i = 2; i < n; i++) {
        acum = this.fs.add(acum, this.fs.times(entry.cantidad, entry.impuestos[i].valor));
      }
    }
    this.objDesgloce.otro = Number(acum.toFixed(2));
  }

  calcTotal() {
    this.objDesgloce.total = this.objDesgloce.subtotal + this.objDesgloce.iva + this.objDesgloce.ice + this.objDesgloce.otro - this.objDesgloce.descuento + this.objDesgloce.propina;
  }

  deleteRowCompras(index) {
    this.lstComprasProve.splice(index, 1);
    this.lstComprasProve = [...this.lstComprasProve];
    this.subTotalPagarC = this.calcTotalCompras();
    this.objDesgloce = {
      subtotal: this.subTotalPagarC,
      iva: this.fs.sub(this.fs.times(this.subTotalPagarC, 1.12), this.subTotalPagarC),
      ice: 0,
      otro: 0,
      descuento: 0,
      propina: 0,
      total: this.fs.times(this.subTotalPagarC, 1.12)
    }
  }

  calcTotalCompras() {
    let sum = 0;
    return sum = this.lstComprasProve.reduce(function (prev, cur) {
      return prev + cur.total;
    }, 0);
  }

  onAddCompra() {
    this.calcTotal();
    this.objCompras.productosV = this.lstComprasProve;
    this.objCompras.desglose = this.objDesgloce;
    this.objCompras.total = this.objDesgloce.subtotal + this.objDesgloce.iva + this.objDesgloce.ice + this.objDesgloce.otro + this.objDesgloce.propina - this.valorReal1
    console.log(this.objCompras);
    this.comprasService.register(this.objCompras).subscribe(data => {
      this.messageGrowlService.notify('success', 'Éxito', 'Ingreso Exitoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
  }

  onChangeNombreProdCompra($event) {
    this.objProdCompras.producto = this.fs.toTitleCase(this.objProdCompras.producto);
  }

  flagCantPC = false;
  onChangeCantProdCompra($event) {
    if (this.objProdCompras.cantidad > 0) {
      this.flagCantPC = true;
    } else {
      this.flagCantPC = false;
    }
  }

  flagPrecioCostoPC = false;
  onChangePCUProdCompra($event) {
    if (this.objProdCompras.pcUnitario > 0) {
      this.flagPrecioCostoPC = true;
    } else {
      this.flagPrecioCostoPC = false;
    }
  }

  setDvProdCompra() {
    this.flagCantPC = false;
    this.flagPrecioCostoPC = false;
    this.objProdCompras = {
      producto: new Producto,
      cantidad: 0,
      pcUnitario: 0,
      fecha: '',
      total: 0,
      impuestos: []
    }
    this.ngOnInitImpC();
  }

  flagRepresentante = false;
  loadSailers($event) {
    let a: any = this.objCompras.proveedor;
    this.lstProveedoresR = a.representanteV;
    this.flagRepresentante = true;

    //console.log(this.objCompras.proveedor)
  }

  onChangeFPE($event) {
    let total = this.objDesgloce.subtotal + this.objDesgloce.iva + this.objDesgloce.ice + this.objDesgloce.otro + this.objDesgloce.propina - this.valorReal1
    if (this.objCompras.formaPago.fpEfectivo + this.objCompras.formaPago.fpTarjeta + this.objCompras.formaPago.fpPorCobrar + this.objCompras.formaPago.fpCheque > total) {
      this.objCompras.formaPago.fpEfectivo = 0;
      setTimeout(function () {
        let v = document.getElementById('fpEfectivo');
        if (v != null) {
          v.click();
        }
      }, 0);
      this.campoFP = 'Efectivo';
      this.maximoFP = total - (this.objCompras.formaPago.fpEfectivo + this.objCompras.formaPago.fpTarjeta + this.objCompras.formaPago.fpPorCobrar + this.objCompras.formaPago.fpCheque);
      this.flagErrorFP = true;
    } else {
      this.flagErrorFP = false;
    }
  }

  onChangeFPT($event) {
    let total = this.objDesgloce.subtotal + this.objDesgloce.iva + this.objDesgloce.ice + this.objDesgloce.otro + this.objDesgloce.propina - this.valorReal1
    if (this.objCompras.formaPago.fpEfectivo + this.objCompras.formaPago.fpTarjeta + this.objCompras.formaPago.fpPorCobrar + this.objCompras.formaPago.fpCheque > total) {
      this.objCompras.formaPago.fpTarjeta = 0;
      setTimeout(function () {
        let v = document.getElementById('fpTarjeta');
        if (v != null) {
          v.click();
        }
      }, 0);
      this.campoFP = 'Tarjeta de Crédito';
      this.maximoFP = total - (this.objCompras.formaPago.fpEfectivo + this.objCompras.formaPago.fpTarjeta + this.objCompras.formaPago.fpPorCobrar + this.objCompras.formaPago.fpCheque);
      this.flagErrorFP = true;
    } else {
      this.flagErrorFP = false;
    }
  }

  onChangeFPC($event) {
    let total = this.objDesgloce.subtotal + this.objDesgloce.iva + this.objDesgloce.ice + this.objDesgloce.otro + this.objDesgloce.propina - this.valorReal1
    if (this.objCompras.formaPago.fpEfectivo + this.objCompras.formaPago.fpTarjeta + this.objCompras.formaPago.fpPorCobrar + this.objCompras.formaPago.fpCheque > total) {
      this.objCompras.formaPago.fpPorCobrar = 0;
      setTimeout(function () {
        let v = document.getElementById('fpPorCobrar');
        if (v != null) {
          v.click();
        }
      }, 0);
      this.campoFP = 'Crédito Directo';
      this.maximoFP = total - (this.objCompras.formaPago.fpEfectivo + this.objCompras.formaPago.fpTarjeta + this.objCompras.formaPago.fpPorCobrar + this.objCompras.formaPago.fpCheque);
      this.flagErrorFP = true;
    } else {
      this.flagErrorFP = false;
    }
  }

  onChangeFPCH($event) {
    let total = this.objDesgloce.subtotal + this.objDesgloce.iva + this.objDesgloce.ice + this.objDesgloce.otro + this.objDesgloce.propina - this.valorReal1
    if (this.objCompras.formaPago.fpEfectivo + this.objCompras.formaPago.fpTarjeta + this.objCompras.formaPago.fpPorCobrar + this.objCompras.formaPago.fpCheque > total) {
      this.objCompras.formaPago.fpCheque = 0;
      setTimeout(function () {
        let v = document.getElementById('fpCheque');
        if (v != null) {
          v.click();
        }
      }, 0);
      this.campoFP = 'Cheque';
      this.maximoFP = total - (this.objCompras.formaPago.fpEfectivo + this.objCompras.formaPago.fpTarjeta + this.objCompras.formaPago.fpPorCobrar + this.objCompras.formaPago.fpCheque);
      this.flagErrorFP = true;
    } else {
      this.flagErrorFP = false;
    }
  }

  representanteC = {
    nombre: '',
    telefono: '',
    correo: '',
    descripcion: '',
    value: ''
  }
  showRepresentanteC = false;
  onChangeNombreRepreC($event) {
    this.representanteC.nombre = this.representanteC.nombre.trim();
    this.representanteC.nombre = this.fs.toTitleCase(this.representanteC.nombre);
  }

  onChangeEmailRepreC($event) {
    /*this.representanteC.correo = this.representanteC.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.representanteC.correo)) {
      document.getElementById("correoRepreC").style.borderLeft = "5px solid #42A948"; //green 
      this.flagEmailRepre = false;
    }
    else {
      document.getElementById("correoRepreC").style.borderLeft = "5px solid #a94442"; //red
      this.flagEmailRepre = true;
    }*/
  }

  onChangeDescRepreC($event) {
    this.representanteC.descripcion = this.representanteC.descripcion.trim();
  }

  addRepreC() {
    /*this.representanteC.value = this.representanteC.nombre;
    this.objCompras.proveedor.representanteV = [...this.objCompras.proveedor.representanteV, this.representanteC];
    let a: any = this.objCompras.proveedor;
    this.lstProveedoresR = a.representanteV;
    let b: any = this.representanteC
    this.objCompras.vendedor = b;

    this.proveedorService.update(this.objCompras.proveedor).subscribe(data => {
      this.messageGrowlService.notify('info', 'Información', 'Ingreso Existoso!');
      document.getElementById("correoRepreC").style.borderLeft = "5px solid #a94442";
    }, err => {
      console.log(err);
    });

    this.showRepresentanteC = false;
    this.representante = {
      nombre: '',
      telefono: '',
      correo: '',
      descripcion: '',
      value: ''
    }
    document.getElementById("correoRepreC").style.borderLeft = "5px solid #a94442";
    this.flagEmailRepre = true;*/
  }

  valorReal1 = 0;
  onChangeDescuento() {
    let total = this.objDesgloce.subtotal + this.objDesgloce.iva + this.objDesgloce.ice + this.objDesgloce.otro + this.objDesgloce.propina;
    this.valorReal1 = this.fs.times(this.fs.div(this.objDesgloce.descuento, 100), total);
  }

  onChangeDescuento1() {
    let total = this.objDesgloce.subtotal + this.objDesgloce.iva + this.objDesgloce.ice + this.objDesgloce.otro + this.objDesgloce.propina;
    this.objDesgloce.descuento = this.fs.div(this.fs.times(this.valorReal1, 100), total);
  }

  searchTipoProdById(id) {
    for (const entry of this.lstTipoProductos) {
      if (entry._id === id) {
        return entry;
      }
    }
  }

  lstTipoProductos: any[];
  lstCompras: any[];
  ngOnInitCompras() {
    this.typesProd = [];
    this.typesProd.push({ label: 'Existente', value: 'Existente' });
    this.typesProd.push({ label: 'Nuevo', value: 'Nuevo' });
    this.lstComprasProve = [];
    this.objCompras = {
      num_factura: '',
      fecha: new Date(),
      proveedor: new Proveedor,
      vendedor: '',
      productosV: [],
      desglose: undefined,
      formaPago: {
        fpEfectivo: 0,
        fpTarjeta: 0,
        fpPorCobrar: 0,
        fpCheque: 0
      },
      total: 0
    };
    this.objProdCompras = {
      producto: new Producto,
      cantidad: 0,
      pcUnitario: 0,
      fecha: '',
      total: 0,
      impuestos: []
    }
    /* Get Proveedores*/
    this.proveedorService.getAll().subscribe(data => {
      this.lstProveedores = data;
      localStorage.setItem('lstProveedor', JSON.stringify(this.lstProveedores));
      this.sourceProve = new LocalDataSource();
      this.sourceProve.load(data);
      this.settingsProve = {
        mode: 'external',
        noDataMessage: 'No existen registros',
        columns: {
          ruc: {
            title: 'Ruc',
            width: '12%'
          },
          nombre_proveedor: {
            title: 'Nombre',
            width: '20%'
          },
          direccion: {
            title: 'Dirección',
            width: '20%'
          },
          ciudad: {
            title: 'Ciudad',
            width: '12%',
            valuePrepareFunction: (ciudad) => {
              let fila = ciudad.nombre + '--' + ciudad.provincia;
              return fila;
            }
          },
          telefono: {
            title: 'Teléfono',
            width: '12%'
          },
          representanteV: {
            title: 'Representante',
            width: '14%',
            valuePrepareFunction: (representanteV) => {
              let fila = '';
              for (let entry of representanteV) {
                fila += entry.nombre + '--' + entry.telefono + ' ';
              }
              return fila;
            }
          },
          compras: {
            title: 'Compras',
            width: '10%',
            filter: false,
            type: 'custom',
            renderComponent: IconRenderComponent
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
      }
      /* Get Compras */
      this.comprasService.getAll().subscribe(data => {
        this.lstCompras = data;
        localStorage.setItem('lstCompras', JSON.stringify(this.lstCompras));
        this.sourceC = new LocalDataSource();
        this.sourceC.load(data);
        this.settingsC = {
          mode: 'external',
          noDataMessage: 'No existen registros',
          columns: {
            fecha: {
              title: 'Fecha Compra',
              width: '15%'
            },
            num_factura: {
              title: 'Numero Factura',
              width: '15%'
            },
            proveedor: {
              title: 'Proveedor',
              width: '20%',
              valuePrepareFunction: (proveedor) => {
                let name = this.lstProveedores.filter(function (obj) {
                  return obj._id.localeCompare(proveedor) === 0;
                })
                if (name.length > 0) {
                  return name[0].nombre_proveedor;
                } else {
                  return '';
                }
              }
            },
            productosV: {
              title: 'Productos',
              width: '35%',
              valuePrepareFunction: (productosV) => {
                //console.log(productosV);
              }
            },
            total: {
              title: 'Total',
              width: '15%',
              type: 'custom',
              renderComponent: PipeRenderComponent,
              filter: false
            }
          },
          actions: {
            columnTitle: '',
            add: true,
            edit: true,
            delete: true
          },
          attr: {
            class: 'table-bordered table-hover table-responsive'
          }
        };
      }, err => {
        console.log(err);
      })
    }, err => {
      console.log(err);
      return false;
    });
    /* Get Tipo Productos */
    this.tipoProductoService.getAll().subscribe(tp => {
      this.lstTipoProductos = tp;
    }, err => {
      console.log(err);
      return false;
    });
    /* Get Productos*/
    this.lstProductos = [];
    this.productoService.getAll().subscribe(p => {
      localStorage.setItem('lstProductos', JSON.stringify(this.lstProductos));
      for (let entry of p) {
        entry['value'] = entry.nombre;
        entry['label'] = entry.nombre;
        this.lstProductos = [...this.lstProductos, entry];
      }
      //console.log(this.lstProductos);
    }, err => {
      console.log(err);
      return false;
    });

    //console.log(this.fs.dinamicModulo11('010520180117912875410012001011006161585281014691'));
  }

  //Impuestos
  showDlgImpC = false;
  choiceSetC = { nombre: [], porcentaje: [], valor: [] };
  objIvaC = {
    desc: 'IVA',
    porcentaje: 12,
    valor: 0
  }
  objIceC = {
    desc: 'ICE',
    porcentaje: 0,
    valor: 0
  }
  objOtroC = {
    desc: 'OTRO',
    porcentaje: 0,
    valor: 0
  }
  objIvaVC = {
    desc: 'IVA',
    porcentaje: 12,
    valor: 0
  }
  objIceVC = {
    desc: 'ICE',
    porcentaje: 0,
    valor: 0
  }
  objOtroVC = {
    desc: 'OTRO',
    porcentaje: 0,
    valor: 0
  }
  objImpC: any[] = [];

  ngOnInitImpC() {
    this.choiceSetC.nombre = [];
    this.choiceSetC.porcentaje = [];
    this.choiceSetC.valor = [];
    this.objIvaC = {
      desc: 'IVA',
      porcentaje: 12,
      valor: 0
    }
    this.objIceC = {
      desc: 'ICE',
      porcentaje: 0,
      valor: 0
    }
    this.objOtroC = {
      desc: 'OTRO',
      porcentaje: 0,
      valor: 0
    }
    this.objImpC = [...this.objImpC, this.objIvaC];
    this.objImpC = [...this.objImpC, this.objIceC];
    this.objImpC = [...this.objImpC, this.objOtroC];
  }

  addRowImpC = function () {
    this.choiceSetC.nombre.push('');
    this.choiceSetC.porcentaje.push('');
    this.choiceSetC.valor.push('');
  };

  removeChoiceC = function (z) {
    this.choiceSetC.nombre.splice(z, 1);
    this.choiceSetC.porcentaje.splice(z, 1);
    this.choiceSetC.valor.splice(z, 1);
  };

  lstImps: any;
  addImpuestoC() {
    this.objProdCompras.impuestos = [];
    /*this.objProdCompras.impuestos = [...this.objImpC, this.objIvaC];
    this.objProdCompras.impuestos = [...this.objImpC, this.objIceC];
    this.objProdCompras.impuestos = [...this.objImpC, this.objOtroC];*/
    this.objProdCompras.impuestos.push(this.objIvaC);
    this.objProdCompras.impuestos.push(this.objIceC);
    this.objProdCompras.impuestos.push(this.objOtroC);

    let n = this.choiceSetC.nombre.length;
    for (let i = 0; i < n; i++) {
      let aux = { desc: this.choiceSetC.nombre[i], porcentaje: this.choiceSetC.porcentaje[i], valor: this.choiceSetC.valor[i] };
      this.objProdCompras.impuestos = [...this.objImpC, aux];
    }
    this.messageGrowlService.notify('info', 'Información', 'Se guardaron los impuestos!');
    this.showDlgImpC = false;
  }

  valueChangePorIvaC($event) {
    let porcentaje = this.fs.div(this.objIvaC.porcentaje, 100);
    this.objIvaC.valor = this.fs.times(this.objProdCompras.pcUnitario, porcentaje);
  }

  valueChangePorIceC($event) {
    let porcentaje = this.fs.div(this.objIceC.porcentaje, 100);
    this.objIceC.valor = this.fs.times(this.objProdCompras.pcUnitario, porcentaje);
  }

  valueChangePorOtroC($event) {
    let porcentaje = this.fs.div(this.objOtroC.porcentaje, 100);
    this.objOtroC.valor = this.fs.times(this.objProdCompras.pcUnitario, porcentaje);
  }

  calcImpC() {
    let porIva = this.fs.div(this.objIvaC.porcentaje, 100);
    let porIce = this.fs.div(this.objIceC.porcentaje, 100);
    let porOtro = this.fs.div(this.objOtroC.porcentaje, 100);
    this.objIvaC.valor = this.fs.times(this.objProdCompras.pcUnitario, porIva);
    this.objIceC.valor = this.fs.times(this.objProdCompras.pcUnitario, porIce);
    this.objOtroC.valor = this.fs.times(this.objProdCompras.pcUnitario, porOtro);
  }

  valueChangePorGenericC(i) {
    let porcentaje = this.fs.div(this.choiceSetC.porcentaje[i], 100);
    this.choiceSetC.valor[i] = this.fs.times(this.objProdCompras.pcUnitario, porcentaje);
  }

  onChangeDescOtroImpC($event) {
    this.objOtroC.desc = this.objOtroC.desc.toUpperCase();
  }

  onChangeDescVC(i) {
    this.choiceSetC.nombre[i] = this.choiceSetC.nombre[i].toUpperCase();
  }

  //Width detection
  textAlignTitle = 'left';
  onResize(event) {
    let x = event.target.innerWidth;
    //console.log(x)
    if (x < 768) {
      this.textAlignTitle = 'center';
    } else {
      this.textAlignTitle = 'left';
    }
  }

  onRzOnInit(x) {
    if (x < 768) {
      this.textAlignTitle = 'center';
    } else {
      this.textAlignTitle = 'left';
    }
  }
}

function setOriginalColorsProve() {
  document.getElementById("rucProve").style.borderColor = "";
  document.getElementById("correo").style.borderColor = "";
}

function setOriginalColorsProveU() {
  document.getElementById("rucProveU").style.borderColor = "";
  document.getElementById("correoU").style.borderColor = "";
}

function setOriginalColorsRepre() {
  document.getElementById("correoRepre").style.borderColor = "";
}
