import { Component, OnInit, Directive, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ValidateService } from '../../services/validate.service';
import { TipoProductoService } from '../../services/tipo-producto.service';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ProductoService } from '../../services/producto.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ImageRenderComponent } from '../image-render/image-render.component';
import { IconRenderComponent } from '../image-render/icon-render.component';
import { IconRenderKComponent } from '../image-render/icon-renderK.component';
import { PipeRenderComponent } from '../pipe-render/pipe-render.component';
import { SubprodRenderComponent } from '../subprod-render/subprod-render.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MessageGrowlService } from '../../services/message-growl.service';
import { FormatterService } from '../../services/formatter.service';
import { SelectItem } from 'primeng/primeng';
import { PromocionService } from '../../services/promocion.service';
import { ProveedorService } from '../../services/proveedor.service';
import { KardexService } from '../../services/kardex.service';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { MateriaPrimaService } from '../../services/materia-prima.service';
import { CiudadService } from '../../services/ciudad.service';
import { ComprasService } from '../../services/compras.service';
import { UM } from '../globals';
import { Producto } from '../../models/producto';

const URL = 'http://localhost:3000/api/imagen';
declare var $;

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements OnInit {

  tmpProd;
  borderStyleProdExistente = '';
  borderStyleProdSelec = ''
  colorUpdate = '';
  auxSubprod;
  sourceTP: LocalDataSource = new LocalDataSource();
  sourceP: LocalDataSource = new LocalDataSource();
  showDialogTPC = false;
  showDialogTPU = false;
  showDialogPC = false;
  showDialogPU = false;
  // Atributos Tipo Producto
  desc_tipo_producto;
  id_mostar;
  pathLogoTP;
  pathLogoTPU;
  // Atributos Producto
  productoUpdate;
  nombre;
  precio_costo;
  precio_venta;
  utilidad;
  cant_existente;
  cant_minima;
  subproductoV;
  selected_tipo_producto;
  pathLogo;
  pathLogoU;
  contenido;
  contenidoMili;
  contenidoMiliU;
  // Add product dialog
  selected_producto;
  selected_productoU;
  lista_subProductos: any = [];
  medidaUtilidad;
  cantSubprod: number;
  cantSubProdU: number;
  productos: any = [];
  // Otras
  tipo_productos: any = [];
  lstShow: any = [];
  flagSubProd;
  flagSubProdUpdate;
  flagListaSubProdUpdate;
  settingsTP = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      _id: {
        title: 'ID',
        width: '25%',
        filter: false,
        valuePrepareFunction: (_id) => {
          return this.slicePipe.transform(_id, -6)
        }
      },
      desc_tipo_producto: {
        title: 'Nombre',
        width: '50%'
      },
      path: {
        title: 'Logotipo',
        width: '25%',
        filter: false,
        type: 'custom',
        renderComponent: ImageRenderComponent
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
  settingsP = {};
  position = 'below';
  color = 'primary';
  checked = false;
  lstUnidades: SelectItem[];
  unidadMedidaSuproducto: any;
  userform: FormGroup;
  selectedLstContenido: number = 1;
  @ViewChild('myInput')
  myInputVariable: any;
  @ViewChild('myInput1')
  myInputVariable1: any;
  @ViewChild('myInput2')
  myInputVariable2: any;
  @ViewChild('myInput3')
  myInputVariable3: any;
  costoCantSubProd;
  precio_costoSubProd;
  selected_prodSelec;
  selected_prodSelecU;
  tipoProductoUpdate: any;
  oldTipoProductoUpdate: any;
  settingsK = {
  };
  sourceK: LocalDataSource = new LocalDataSource();
  showDialogK = false;
  kardex = {
    'fecha': '',
    'desc_producto': '',
    'proveedor': '',
    'cantidad': 0,
    'total': 0,
    'num_factura': '',
    'contenido': 0
  };
  dt: Date = new Date();
  es: any;
  filteredProductos: any[];
  selectedProdK;
  oldProve: any;
  showDialogProveU = false;
  showDialogKU = false;
  todayDate: any;
  selectedTP: any;
  lstProductos: Producto[];
  lstKardex: any[];
  kardexU = {
    'fecha': '',
    'desc_producto': '',
    'proveedor': '',
    'cantidad': 0,
    'total': 0,
    'num_factura': '',
    'contenido': 0
  };
  newProd = {
    nombre: '',
    precio_costo: 0,
    precio_venta: 0,
    utilidad: 0,
    cant_existente: 0,
    subproductoV: '',
    id_tipo_producto: '',
    path: '',
    contenido: 0,
    promocion: [],
    _id: ''
  };
  prizeKardex = 0;
  aux;
  showVentasDetail = false;
  showProdDialog;
  tipo_resumen_ventas: any[];
  selectedTR: any;
  flagResumenVentas = false;
  lstFrecuencias: any[];
  selectedFrecuencia: any;
  flagProductoGasto = false;
  productosShow: any[];

  constructor(
    private validateService: ValidateService,
    private tipoProductoService: TipoProductoService,
    private productoService: ProductoService,
    private authService: AuthService,
    private http: Http, public dialog: MdDialog,
    private messageGrowlService: MessageGrowlService,
    private fs: FormatterService,
    private formBuilder: FormBuilder,
    private promocionService: PromocionService,
    private proveedorService: ProveedorService,
    private decimalPipe: DecimalPipe,
    private slicePipe: SlicePipe,
    private kardexService: KardexService,
    private materiaPrimaService: MateriaPrimaService,
    private ciudadService: CiudadService,
    private comprasService: ComprasService) {

    this.pathLogo = undefined;
    this.lstUnidades = [];
    this.lstUnidades.push({ label: 'Volumen--Litro', value: 1 });
    this.lstUnidades.push({ label: 'Volumen--Mililitro', value: 2 });
    this.lstUnidades.push({ label: 'Volumen--Onza Líquida', value: 3 });
    this.lstUnidades.push({ label: 'Masa--Gramo', value: 4 });
    this.lstUnidades.push({ label: 'Masa--Onza', value: 5 });
    this.lstUnidades.push({ label: 'Masa--Libra', value: 6 });
    this.lstUnidades.push({ label: 'Masa--Kilogramo', value: 7 });
    this.lstUnidades.push({ label: 'Unidades', value: 8 });

    this.objPromo = {
      nombre: '',
      productosV: [],
      estado: 0,
      tipoPromo: ''
    }
    this.objPromoUpdate = {
      nombre: '',
      productosV: [],
      estado: 0,
      tipoPromo: ''
    }
    //console.log((0.3 - 0.1).toFixed(2));

    var x = window.innerWidth;
    this.onRzOnInit(x);
  }

  ngOnInit() {
    //console.log(document.getElementById("fpEfectivo").offsetHeight)
    var initial = new Date(this.getDate()).toLocaleDateString().split("/");
    this.todayDate = [initial[0], initial[1], initial[2]].join('/');
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

    this.tipo_resumen_ventas = [];
    this.tipo_resumen_ventas.push({ label: 'Sin Rango de Fechas', value: 0 });
    this.tipo_resumen_ventas.push({ label: 'Con Rango de Fechas', value: 1 });
    this.selectedTR = this.tipo_resumen_ventas[0];
    this.lstFrecuencias = [];
    this.lstFrecuencias.push({ label: 'Ultimo Dia', value: 0 });
    this.lstFrecuencias.push({ label: 'Ultima Semana', value: 1 });
    this.lstFrecuencias.push({ label: 'Ultimo Mes', value: 2 });
    this.lstFrecuencias.push({ label: 'Ultimo Trimestre', value: 3 });
    this.lstFrecuencias.push({ label: 'Ultimo Semestre', value: 4 });
    this.lstFrecuencias.push({ label: 'Ultimo Año', value: 5 });
    this.selectedFrecuencia = this.lstFrecuencias[0];
    /*this.productos = {
      'label': '',
      'value': '',
      'cant_existente': 0,
      'id_tipo_producto': '',
      'nombre': '',
      'path': '',
      'precio_unitario': 0,
      'subproductoV': [],
      'utilidad': 0,
      'contenido': 0,
      '_id': '5993c0a775758c27cccd88ee'
    };*/
    /* Get Tipo Productos*/
    this.tipoProductoService.getAll().subscribe(tp => {
      this.tipo_productos = tp;
      if (this.tipo_productos.length > 0) {
        this.selectedTP = this.tipo_productos[0];
      }
      localStorage.setItem('lstTipoProductos', JSON.stringify(this.tipo_productos));
      this.sourceTP = new LocalDataSource();
      this.sourceTP.load(this.tipo_productos);
      const selectShow: any[] = [];
      for (const entry of tp) {
        selectShow.push({ value: entry._id, title: entry.desc_tipo_producto });
      }
      /* Get Productos*/
      this.productoService.getAll().subscribe(p => {
        this.productos = p;
        this.productosShow = [];
        for (let entry of p) {
          if (entry.subproductoV.length < 1) {
            entry.id_tipo_producto = this.searchTipoProdById(entry.id_tipo_producto, this.tipo_productos).desc_tipo_producto;
            this.productosShow.push(entry);
          }
        }

        this.lstProductos = [];
        if (this.productos.length > 0) {
          for (let entry of this.productos) {

            if (entry.id_tipo_producto === this.selectedTP.desc_tipo_producto)
              this.lstProductos.push(entry);
          }
        }
        let i = 0;
        for (const x of p) {
          this.productos[i].label = x.nombre;
          this.productos[i].value = x.nombre;
          i++;
        }
        localStorage.setItem('lstProductos', JSON.stringify(this.productos));
        this.sourceP = new LocalDataSource();
        this.sourceP.load(this.productos);
        this.settingsP = {
          mode: 'external',
          noDataMessage: 'No existen registros',
          columns: {
            cant_existente: {
              title: 'Stock',
              width: '7%',
              type: 'custom',
              renderComponent: PipeRenderComponent,
              filter: false
            },
            nombre: {
              title: 'Nombre',
              width: '18%',
              filter: {
                type: 'completer',
                config: {
                  completer: {
                    data: this.productos,
                    searchFields: 'nombre',
                    titleField: 'nombre'
                  },
                },
              },
            },
            contenido: {
              title: 'Contenido',
              width: '7%',
              type: 'custom',
              renderComponent: PipeRenderComponent,
              filter: false
            },
            unidad_medida: {
              title: 'UM',
              width: '7%',
              filter: false,
              valuePrepareFunction: (unidad_medida) => {
                var um = 'Unidades';
                var res = unidad_medida.split("-");
                if (res[0].localeCompare('Masa') === 0) {
                  um = 'Masa-Gramos';
                }
                if (res[0].localeCompare('Volumen') === 0) {
                  um = 'Volumen-Mililitros';
                }
                return um;
              }
            },
            precio_costo: {
              title: 'Precio Costo',
              width: '7%',
              type: 'custom',
              renderComponent: PipeRenderComponent,
              filter: false
            },
            utilidad: {
              title: 'Utilidad (%)',
              width: '7%',
              type: 'custom',
              renderComponent: PipeRenderComponent,
              filter: false
            },
            precio_venta: {
              title: 'Precio Venta',
              width: '7%',
              type: 'custom',
              renderComponent: PipeRenderComponent,
              filter: false
            },
            subproductoV: {
              title: 'Subproducto',
              width: '23%',
              filter: false,
              valuePrepareFunction: (subproductoV) => {
                let fila = '';
                for (let entry of subproductoV) {
                  fila += '-' + entry.nombre + ' ' + entry.cantidad + ' ';
                }
                return fila;
              }
            },
            id_tipo_producto: {
              title: 'Tipo Producto',
              width: '10%',
              filter: {
                type: 'list',
                config: {
                  selectText: 'Todos',
                  list: selectShow
                }
              },
              valuePrepareFunction: (id_tipo_producto) => {
                const desc = this.search(id_tipo_producto, this.tipo_productos);
                return desc;
              }
            },
            path: {
              title: 'Logotipo',
              width: '7%',
              filter: false,
              type: 'custom',
              renderComponent: ImageRenderComponent
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
        this.ngOnInitPromo();
        console.log(this.productos);
        //console.log(this.lstProductos);
        /*console.log(this.lstProductos1);
        console.log(this.lstProductosP);
        console.log(this.lstProductosR);
        console.log(this.lstProductosShow);*/
        //console.log(this.productosShow)

      }, err => {
        console.log(err);
        return false;
      });
    }, err => {
      console.log(err);
      return false;
    });

    this.ngOnInitProducto();
    this.ngOnInitTipoProducto();
    this.ngOnInitMateriaPrima();

    this.ngOnInitImp();
  }

  /* GESTION DE PRODUCTO */
  setCursorAddTP() {
    setTimeout(function () {
      document.getElementById('descTPC').focus();
      document.getElementById('filesTP').style.backgroundColor = 'lightsalmon';
      setOriginalColorsTPC();
    }, 50);
  }

  setCursorUpdateTP() {
    setTimeout(function () {
      document.getElementById('descTPU').focus();
      setOriginalColorsTPU();
    }, 500);
  }

  setCursorAddP() {
    this.selected_tipo_producto = this.tipo_productos[0];
    setTimeout(function () {
      document.getElementById('nombrePC').focus();
    }, 0);
    document.getElementById('filesC').style.backgroundColor = 'lightsalmon';
    setOriginalColorsPC();
  }

  setCursorUpdateP() {
    setTimeout(function () {
      document.getElementById('nombrePU').focus();
      setOriginalColorsPU();
    }, 0);
  }

  setCursorUpdatePro() {
    setTimeout(function () {
      document.getElementById('nombrePromoU').focus();
    }, 0);
  }

  onCreateTP(event: any) {
    this.myInputVariable2.nativeElement.value = '';
    this.ngOnInitTipoProducto();
  }

  onCreateP(event: any) {
    this.myInputVariable.nativeElement.value = '';
    this.flagProductoGasto = false;
    this.ngOnInitProducto();
  }

  onUpdateTP(event: any) {
    let lst = JSON.parse(localStorage.getItem('lstTipoProductos'));
    let prodUpdt = lst.filter(function (obj) {
      return obj._id.localeCompare(event.data._id) === 0;
    });
    this.tipoProductoUpdate = prodUpdt[0];
    this.myInputVariable3.nativeElement.value = '';
    this.oldTipoProductoUpdate = event.data;
    if (this.tipoProductoUpdate.path === undefined) {
      (<HTMLInputElement>document.getElementById('filesTPU')).value = "";
      document.getElementById('filesTPU').style.backgroundColor = 'lightsalmon';
      document.getElementById('filesTPU').style.color = 'black';
    } else {
      document.getElementById('filesTPU').style.backgroundColor = 'lightgreen';
      document.getElementById('filesTPU').style.color = 'lightgreen';
    }
  }

  oldProductoUpdate: any;
  onUpdateP(event: any) {
    let lst = JSON.parse(localStorage.getItem('lstProductos'));
    let prodUpdt = lst.filter(function (obj) {
      return obj._id.localeCompare(event.data._id) === 0;
    });
    this.productoUpdate = prodUpdt[0];
    //this.productoUpdate.id_tipo_producto = this.searchTipoProdById(this.productoUpdate.id_tipo_producto, this.tipo_productos).desc_tipo_producto;
    this.myInputVariable1.nativeElement.value = '';
    this.oldProductoUpdate = event.data;
    if (this.productoUpdate.path === undefined) {
      (<HTMLInputElement>document.getElementById('filesU')).value = "";
      document.getElementById('filesU').style.backgroundColor = 'lightsalmon';
      document.getElementById('filesU').style.color = 'black';
    } else {
      document.getElementById('filesU').style.backgroundColor = 'lightgreen';
      document.getElementById('filesU').style.color = 'lightgreen';
    }
    if (this.productoUpdate.subproductoV.length !== 0) {
      this.flagSubProdUpdate = true;
    } else {
      this.flagSubProdUpdate = false;
    }
  }

  onAddTPSubmit() {
    const tipoProducto = {
      desc_tipo_producto: this.desc_tipo_producto,
      path: this.pathLogoTP
    };
    if (!this.validateService.validateTipoProducto(tipoProducto)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    this.productoService.uploadImage(this.pathLogoTP).subscribe(tp => {
      tipoProducto.path = tp;
      console.log(tp)
      this.tipoProductoService.registerTipoProducto(tipoProducto).subscribe(data => {
        this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
        this.sourceTP.add(data);
        this.sourceTP.refresh();
        this.ngOnInitTipoProducto();
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      });
    }, err => {
      console.log(err);
    });
  }

  onAddPSubmit() {
    const producto = {
      nombre: this.nombre,
      precio_costo: this.precio_costo,
      precio_venta: this.precio_venta,
      utilidad: this.utilidad,
      cant_existente: this.cant_existente,
      cant_minima: this.cant_minima,
      subproductoV: this.subproductoV,
      id_tipo_producto: this.selected_tipo_producto._id,
      path: this.pathLogo,
      contenido: this.contenido,
      promocion: [],
      unidad_medida: this.selectedUmMat.label + '-' + this.selectedUmMat1.label,
      impuestosCompraV: this.objImp,
      impuestosVentaV: this.objImpV
    };
    //Transformar a ml/g
    producto.contenido = this.calcContenido();
    console.log(producto);
    //Producto materia prima
    if (producto.utilidad === 0) {
      if (!this.validateService.customValidateProductoGasto(producto)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
      this.productoService.registerProducto(producto).subscribe(data => {
        this.ngOnInitProducto();
        this.ngOnInit();
        this.showDialogPC = false;
        this.messageGrowlService.notify('success', 'Éxito', 'Ingreso Exitoso!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      });

    } else {
      //Producto estandar
      if (!this.validateService.customValidateProducto(producto)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
      if (producto.path !== undefined) {
        this.productoService.uploadImage(this.pathLogo).subscribe(tp => {
          producto.path = tp;
          this.productoService.registerProducto(producto).subscribe(data => {
            this.ngOnInitProducto();
            this.ngOnInit();
            this.ngOnInitImp();
            this.showDialogPC = false;
            this.messageGrowlService.notify('success', 'Éxito', 'Ingreso Exitoso!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
          });

        }, err => {
          console.log(err);
        });
      } else {
        producto.path = this.selected_tipo_producto.path;
        this.productoService.registerProducto(producto).subscribe(data => {
          this.ngOnInitProducto();
          this.ngOnInit();
          this.ngOnInitImp();
          this.showDialogPC = false;
          this.messageGrowlService.notify('success', 'Éxito', 'Ingreso Exitoso!');
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        });
      }
    }
  }

  blockFlagCont = false;
  calcContenido() {
    let nContMl = 0;
    if (this.contenido > 0) {
      if (this.selectedUmMat.value == 0) {
        if (this.selectedUmMat1.label.localeCompare('Gramos') == 0) {
          nContMl = this.contenido;
        }
        if (this.selectedUmMat1.label.localeCompare('Onza') == 0) {
          nContMl = this.fs.times(this.contenido, UM.onzaEnGr);
        }
        if (this.selectedUmMat1.label.localeCompare('Libras') == 0) {
          nContMl = this.fs.times(this.contenido, UM.lbEnGr);
        }
        if (this.selectedUmMat1.label.localeCompare('Kilogramos') == 0) {
          nContMl = this.fs.times(this.contenido, UM.kgEnGr);
        }
      } else {
        if (this.selectedUmMat.value == 1) {
          if (this.selectedUmMat1.label.localeCompare('Mililitros') == 0) {
            nContMl = this.contenido;
          }
          if (this.selectedUmMat1.label.localeCompare('Onza Liquida') == 0) {
            nContMl = this.fs.times(this.contenido, UM.onzaEnMl);
          }
          if (this.selectedUmMat1.label.localeCompare('Litros') == 0) {
            nContMl = this.fs.times(this.contenido, UM.litroEnMl);
          }
        } else {
          nContMl = 0;
        }
      }
    }
    return nContMl;
  }

  calcContenidoU() {
    let nContMl = 0;
    if (this.productoUpdate.contenido > 0) {
      const onzaEnMl = 29.5735295625;
      if (this.selectedLstContenido === 0) {
        nContMl = (this.productoUpdate.contenido * 1000);
      }
      if (this.selectedLstContenido === 1) {
        nContMl = this.productoUpdate.contenido;
      }
      if (this.selectedLstContenido === 2) {
        nContMl = (this.productoUpdate.contenido * onzaEnMl);
      }
    }
    return nContMl;
  }

  onUpdateTPSubmit() {
    const tipoProducto = {
      _id: this.tipoProductoUpdate._id,
      desc_tipo_producto: this.tipoProductoUpdate.desc_tipo_producto,
      path: this.tipoProductoUpdate.path
    };
    if (!this.validateService.validateTipoProducto(tipoProducto)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }

    if (this.pathLogoTPU === undefined) {
      this.tipoProductoService.updateTipoProducto(tipoProducto).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
        this.sourceTP.update(this.oldTipoProductoUpdate, tipoProducto);
        this.sourceTP.refresh();
        this.myInputVariable3.nativeElement.value = '';
        this.showDialogTPU = false;
        this.tipoProductoUpdate = { '_id': '', 'desc_tipo_producto': '', 'path': '' }
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      });
    } else {
      this.productoService.uploadImage(this.pathLogoTPU).subscribe(tp => {
        tipoProducto.path = tp;
        this.tipoProductoService.updateTipoProducto(tipoProducto).subscribe(data => {
          this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
          this.sourceTP.update(this.oldTipoProductoUpdate, tipoProducto);
          this.sourceTP.refresh();
          this.myInputVariable3.nativeElement.value = '';
          this.showDialogTPU = false;
          this.tipoProductoUpdate = { '_id': '', 'desc_tipo_producto': '', 'path': '' }
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        });
      }, err => {
        console.log(err);
      });
    }

  }

  onUpdatePSubmit() {
    const idTpBus = this.searchByName(this.productoUpdate.id_tipo_producto, this.tipo_productos);
    let nSp = this.productoUpdate.subproductoV;
    if (this.productoUpdate.subproductoV === "") {
      nSp = [];
    }
    const producto = {
      _id: this.productoUpdate._id,
      nombre: this.productoUpdate.nombre,
      precio_costo: parseFloat(this.productoUpdate.precio_costo),
      precio_venta: parseFloat(this.productoUpdate.precio_venta),
      utilidad: parseFloat(this.productoUpdate.utilidad),
      cant_existente: parseFloat(this.productoUpdate.cant_existente),
      contenido: parseFloat(this.productoUpdate.contenido),
      path: this.productoUpdate.path,
      subproductoV: nSp,
      id_tipo_producto: idTpBus,
      promocion: []
    };
    producto.contenido = this.calcContenidoU();
    if (producto.utilidad === 0) {
      console.log(producto)
      /*if (!this.validateService.customValidateProductoGastoU(producto)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
      this.productoService.updateProducto(producto).subscribe(data => {
        this.ngOnInit();
        this.myInputVariable1.nativeElement.value = '';
        this.showDialogPU = false;
        this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      });*/

    } else {
      if (!this.validateService.customValidateProductoU(producto)) {
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
        return false;
      }

      if (this.pathLogoU === undefined) {
        this.productoService.updateProducto(producto).subscribe(data => {
          this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        });
        this.ngOnInit();
        this.myInputVariable1.nativeElement.value = '';
        this.showDialogPU = false;
        this.productoUpdate = {
          '_id': '',
          'nombre': '',
          'precio_unitario': 0,
          'utilidad': 0,
          'cant_existente': 0,
          'subproductoV': [],
          'id_tipo_producto': '',
          'path': ''
        };
      } else {
        this.productoService.uploadImage(this.pathLogoU).subscribe(tp => {
          producto.path = tp;
          this.productoService.updateProducto(producto).subscribe(data => {
            this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');

          });
          this.ngOnInit();
          this.myInputVariable1.nativeElement.value = '';
          this.showDialogPU = false;
        }, err => {
          console.log(err);
        });
      }
    }
  }

  onDeleteTP(event): void {
    this.openDialogTP(event.data);
  }

  openDialogTP(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          this.sourceTP.remove(data);
          // remove from database
          this.tipoProductoService.deleteTipoProducto(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');
          });
        }
      }
    });
  }

  onDeleteP(event): void {
    this.openDialogP(event.data);
  }

  openDialogP(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          this.sourceP.remove(data);
          // remove from database
          this.productoService.deleteProducto(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');

          });
        }
      }
    });
  }

  deleteItem() {
    if (this.selected_prodSelec !== undefined) {
      let nombre = this.selected_prodSelec.nombre;
      //search and minus precio_compra
      let row = this.subproductoV.find(x => x.nombre === nombre);
      this.precio_costo -= parseFloat(row.precio_costo);
      let str = row.cantidad.split(" ");
      this.reCalcContenidoDelete(str[0], str[1], row.value.contenido)
      this.reCalcPrevioVenta();
      this.subproductoV = this.subproductoV.filter(function (obj) {
        return obj.nombre.localeCompare(nombre);
      });
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto de la lista de productos seleccionados!');
      this.borderStyleProdSelec = '#FE2E2E';
    }
    this.selected_prodSelec = undefined;
  }

  deleteItemU(index) {
    if (this.selected_prodSelecU !== undefined) {
      let nombre = this.selected_prodSelecU.nombre;
      //search and minus precio_compra
      let row = this.productoUpdate.subproductoV.find(x => x.nombre === nombre);
      this.productoUpdate.precio_costo -= parseFloat(row.precio_costo);
      let str = row.cantidad.split(" ");
      this.reCalcContenidoDeleteU(str[0], str[1], row.value.contenido)
      this.reCalcPrevioVentaU();
      this.productoUpdate.subproductoV = this.productoUpdate.subproductoV.filter(function (obj) {
        return obj.nombre.localeCompare(nombre);
      });
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto de la lista de productos seleccionados!');
      this.borderStyleProdSelec = '#FE2E2E';
    }
    this.selected_prodSelecU = undefined;
  }

  addItem() {
    if (this.cantSubprod !== 0) {
      if (this.selected_producto !== '') {
        this.valueChangeCantSubprod();
        const index = this.productos.findIndex(x => x.nombre === this.selected_producto);
        this.selected_producto = this.productos[index];
        //const precio_costo = 0;
        const aux = {
          nombre: this.selected_producto.nombre,
          cantidad: this.cantSubprod + ' ' + this.unidadMedidaSuproducto.code,
          label: this.selected_producto.nombre,
          value: this.selected_producto,
          precio_costo: this.costoCantSubProd
        }
        // search whether subProd already exists
        const index1 = this.subproductoV.findIndex(x => x.nombre === aux.nombre);
        if (index1 === -1) {
          this.cantSubprod = 0;
          this.subproductoV.push(aux);
        } else {
          let str = this.subproductoV[index1].cantidad.split(" ")
          if (str[1].localeCompare(this.unidadMedidaSuproducto.code) === 0) {
            let pc = this.subproductoV[index1].precio_costo;
            const npc = this.reCalcCosto(parseInt(str[0]) + this.cantSubprod);
            const aux = {
              nombre: this.selected_producto.nombre,
              cantidad: (parseInt(str[0]) + this.cantSubprod) + ' ' + this.unidadMedidaSuproducto.code,
              label: this.selected_producto.nombre,
              value: this.selected_producto,
              precio_costo: npc
            };
            this.cantSubprod = 0;
            this.subproductoV[index1] = aux;
          } else {
            this.messageGrowlService.notify('error', 'Error', 'Las unidades no coinciden, elimina el producto: ' + aux.nombre);
          }
        }
        this.precio_costo = 0;
        this.contenido = 0;
        for (let entry of this.subproductoV) {
          this.precio_costo = this.fs.add(this.precio_costo, entry.precio_costo)
          let str = entry.cantidad.split(" ");
          this.reCalcContenido(str[0], str[1], entry.value.contenido);
        }
        this.reCalcPrevioVenta();
        this.selected_producto = '';
        this.lstUnitsComp = [];
      } else {
        this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto existente!');
        this.borderStyleProdExistente = '#FE2E2E';
      }
    } else {
      this.messageGrowlService.notify('error', 'Error', 'La cantidad no puede ser 0!');
      document.getElementById('cantSubprod').style.borderColor = '#FE2E2E';
    }
  }

  addItemU() {
    if (this.cantSubProdU !== 0) {
      if (this.selected_productoU !== '') {
        this.valueChangeCantSubprodU();
        const index = this.productos.findIndex(x => x.nombre === this.selected_productoU);
        this.selected_productoU = this.productos[index];
        //const precio_costo = 0;
        const aux = {
          nombre: this.selected_productoU.nombre,
          cantidad: this.cantSubProdU + ' ' + this.unidadMedidaSuproducto.value.code,
          label: this.selected_productoU.nombre,
          value: this.selected_productoU,
          precio_costo: this.costoCantSubProd
        };
        // search wheter subProd already exists
        const index1 = this.productoUpdate.subproductoV.findIndex(x => x.nombre === aux.nombre);
        if (index1 === -1) {
          this.cantSubProdU = 0;
          this.productoUpdate.subproductoV.push(aux);
        } else {
          let str = (this.productoUpdate.subproductoV[index1].cantidad).match(/[a-z]+|\d+/ig);
          if (str[1].localeCompare(this.unidadMedidaSuproducto.value.code) === 0) {
            let pc = this.productoUpdate.subproductoV[index1].precio_costo;
            const npc = this.reCalcCostoU(parseInt(str[0]) + this.cantSubProdU);
            const aux = {
              nombre: this.selected_productoU.nombre,
              cantidad: (parseInt(str[0]) + this.cantSubprod) + ' ' + this.unidadMedidaSuproducto.value.code,
              label: this.selected_productoU.nombre,
              value: this.selected_productoU,
              precio_costo: npc
            };
            this.cantSubProdU = 0;
            this.productoUpdate.subproductoV[index1] = aux;
          } else {
            this.messageGrowlService.notify('error', 'Error', 'Las unidades no coinciden, elimina el producto: ' + aux.nombre);
          }
        }
        this.productoUpdate.precio_costo = 0;
        this.productoUpdate.contenido = 0;
        for (let entry of this.productoUpdate.subproductoV) {
          this.productoUpdate.precio_costo += entry.precio_costo;
          let str = entry.cantidad.split(" ");
          this.reCalcContenidoU(str[0], str[1], entry.value.contenido);
        }
        this.reCalcPrevioVentaU();
        this.selected_productoU = '';
        this.lstUnitsComp = [];
      } else {
        this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto existente!');
        this.borderStyleProdExistente = '#FE2E2E';
      }
    } else {
      this.messageGrowlService.notify('error', 'Error', 'La cantidad no puede ser 0!');
      document.getElementById('cantSubprodU').style.borderColor = '#FE2E2E';
    }
  }

  lstUnitsComp: any[] = [];
  loadUnits() {
    let prod = this.productos.find(x => x.nombre === this.selected_producto);
    this.lstUnitsComp = [];
    if (prod.unidad_medida.split('-')[0] == 'Masa') {
      this.lstUnitsComp.push({ label: 'Masa--Gramo', value: 4, code: 'gr' });
      this.lstUnitsComp.push({ label: 'Masa--Onza', value: 5, code: 'oz' });
      this.lstUnitsComp.push({ label: 'Masa--Libra', value: 6, code: 'lb' });
      this.lstUnitsComp.push({ label: 'Masa--Kilogramo', value: 7, code: 'kg' });
    }
    if (prod.unidad_medida.split('-')[0] == 'Volumen') {
      this.lstUnitsComp.push({ label: 'Volumen--Litro', value: 1, code: 'lt' });
      this.lstUnitsComp.push({ label: 'Volumen--Mililitro', value: 2, code: 'ml' });
      this.lstUnitsComp.push({ label: 'Volumen--Onza Líquida', value: 3, code: 'ozL' });
    }
    if (prod.unidad_medida.split('-')[0] == 'Unidades') {
      this.lstUnitsComp.push({ label: 'Unidades', value: 8, code: 'u' });
    }
    this.unidadMedidaSuproducto = this.lstUnitsComp[0];
  }

  unitShow = '';
  valueChangeCantSubprod() {
    document.getElementById('cantSubprod').style.borderColor = '';
    let prod = this.productos.find(x => x.nombre === this.selected_producto);
    if (prod !== undefined) {
      if (this.unidadMedidaSuproducto.value === 1) {//litro
        this.costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(this.cantSubprod, UM.litroEnMl), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 2) {//mililitro
        this.costoCantSubProd = this.fs.div(this.fs.times(this.cantSubprod, prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 3) {//onza liquida
        this.costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(this.cantSubprod, UM.onzaEnMl), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 4) {//gramo
        this.costoCantSubProd = this.fs.div(this.fs.times(this.cantSubprod, prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 5) {//onza
        this.costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(this.cantSubprod, UM.onzaEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 6) {//libra
        this.costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(this.cantSubprod, UM.lbEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 7) {//kilogramo
        this.costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(this.cantSubprod, UM.kgEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 8) {//unidades
        this.costoCantSubProd = this.fs.times(this.cantSubprod, prod.precio_costo);
      }
    }
  }

  valueChangeCantSubprodU() {
    document.getElementById('cantSubprodU').style.borderColor = '';
    let prod = this.productos.find(x => x.nombre === this.selected_productoU);
    if (prod !== undefined) {
      if (this.unidadMedidaSuproducto.value === 1) {//litro
        this.costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(this.cantSubProdU, UM.litroEnMl), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 2) {//mililitro
        this.costoCantSubProd = this.fs.div(this.fs.times(this.cantSubProdU, prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 3) {//onza liquida
        this.costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(this.cantSubProdU, UM.onzaEnMl), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 4) {//gramo
        this.costoCantSubProd = this.fs.div(this.fs.times(this.cantSubProdU, prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 5) {//onza
        this.costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(this.cantSubProdU, UM.onzaEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 6) {//libra
        this.costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(this.cantSubProdU, UM.lbEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 7) {//kilogramo
        this.costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(this.cantSubProdU, UM.kgEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 8) {//unidades
        this.costoCantSubProd = this.fs.times(this.cantSubProdU, prod.precio_costo);
      }
    }
  }

  reCalcContenido(cantSubprod, um, contenido) {
    cantSubprod = parseFloat(cantSubprod);
    contenido = parseFloat(contenido);
    if (um.localeCompare('lt') === 0) {
      this.contenido = this.fs.add(this.contenido, this.fs.times(cantSubprod, UM.litroEnMl));
    }
    if (um.localeCompare('ml') === 0) {
      this.contenido = this.fs.add(this.contenido, cantSubprod);
    }
    if (um.localeCompare('ozL') === 0) {
      this.contenido = this.fs.add(this.contenido, this.fs.times(cantSubprod, UM.onzaEnMl));
    }
    if (um.localeCompare('gr') === 0) {
      this.contenido = this.fs.add(this.contenido, cantSubprod);
    }
    if (um.localeCompare('oz') === 0) {
      this.contenido = this.fs.add(this.contenido, this.fs.times(cantSubprod, UM.onzaEnGr));
    }
    if (um.localeCompare('lb') === 0) {
      this.contenido = this.fs.add(this.contenido, this.fs.times(cantSubprod, UM.lbEnGr));
    }
    if (um.localeCompare('kg') === 0) {
      this.contenido = this.fs.add(this.contenido, this.fs.times(cantSubprod, UM.kgEnGr));
    }
    if (um.localeCompare('u') === 0) {
      this.contenido = this.fs.add(this.contenido, contenido);
    }
  }

  reCalcContenidoU(cantSubprod, um, contenido) {
    cantSubprod = parseFloat(cantSubprod);
    contenido = parseFloat(contenido);
    if (um.localeCompare('lt') === 0) {
      this.productoUpdate.contenido = this.fs.add(this.productoUpdate.contenido, this.fs.times(cantSubprod, UM.litroEnMl));
    }
    if (um.localeCompare('ml') === 0) {
      this.productoUpdate.contenido = this.fs.add(this.productoUpdate.contenido, cantSubprod);
    }
    if (um.localeCompare('ozL') === 0) {
      this.productoUpdate.contenido = this.fs.add(this.productoUpdate.contenido, this.fs.times(cantSubprod, UM.onzaEnMl));
    }
    if (um.localeCompare('gr') === 0) {
      this.productoUpdate.contenido = this.fs.add(this.productoUpdate.contenido, cantSubprod);
    }
    if (um.localeCompare('oz') === 0) {
      this.productoUpdate.contenido = this.fs.add(this.productoUpdate.contenido, this.fs.times(cantSubprod, UM.onzaEnGr));
    }
    if (um.localeCompare('lb') === 0) {
      this.productoUpdate.contenido = this.fs.add(this.productoUpdate.contenido, this.fs.times(cantSubprod, UM.lbEnGr));
    }
    if (um.localeCompare('kg') === 0) {
      this.productoUpdate.contenido = this.fs.add(this.productoUpdate.contenido, this.fs.times(cantSubprod, UM.kgEnGr));
    }
    if (um.localeCompare('u') === 0) {
      this.productoUpdate.contenido = this.fs.add(this.productoUpdate.contenido, contenido);
    }
  }

  reCalcCosto(cantSubprod) {
    let prod = this.productos.find(x => x.nombre === this.selected_producto.nombre);
    let costoCantSubProd = 0;
    if (prod !== undefined) {
      if (this.unidadMedidaSuproducto.value === 1) {//litro
        costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(cantSubprod, UM.litroEnMl), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 2) {//mililitro
        costoCantSubProd = this.fs.div(this.fs.times(cantSubprod, prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 3) {//onza liquida
        costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(cantSubprod, UM.onzaEnMl), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 4) {//gramo
        costoCantSubProd = this.fs.div(this.fs.times(cantSubprod, prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 5) {//onza
        costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(cantSubprod, UM.onzaEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 6) {//libra
        costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(cantSubprod, UM.lbEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 7) {//kilogramo
        costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(cantSubprod, UM.kgEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 8) {//unidades
        costoCantSubProd = this.fs.times(cantSubprod, prod.precio_costo);
      }
    }
    return costoCantSubProd;
  }

  reCalcCostoU(cantSubprod) {
    let prod = this.productos.find(x => x.nombre === this.selected_productoU.nombre);
    let costoCantSubProd = 0;
    if (prod !== undefined) {
      if (this.unidadMedidaSuproducto.value === 1) {//litro
        costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(cantSubprod, UM.litroEnMl), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 2) {//mililitro
        costoCantSubProd = this.fs.div(this.fs.times(cantSubprod, prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 3) {//onza liquida
        costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(cantSubprod, UM.onzaEnMl), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 4) {//gramo
        costoCantSubProd = this.fs.div(this.fs.times(cantSubprod, prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 5) {//onza
        costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(cantSubprod, UM.onzaEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 6) {//libra
        costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(cantSubprod, UM.lbEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 7) {//kilogramo
        costoCantSubProd = this.fs.div(this.fs.times(this.fs.times(cantSubprod, UM.kgEnGr), prod.precio_costo), prod.contenido);
      }
      if (this.unidadMedidaSuproducto.value === 8) {//unidades
        costoCantSubProd = this.fs.times(cantSubprod, prod.precio_costo);
      }
    }
    return costoCantSubProd;
  }

  reCalcPrevioVenta() {
    const gain = this.fs.add(this.fs.div(this.utilidad, 100), 1);
    this.precio_venta = this.fs.times(this.precio_costo, gain);
  }

  reCalcPrevioVentaU() {
    const gain = this.fs.add(this.fs.div(this.productoUpdate.utilidad, 100), 1);
    this.productoUpdate.precio_venta = this.fs.times(this.productoUpdate.precio_costo, gain);
  }

  reCalcContenidoDelete(cantSubprod, um, contenido) {
    cantSubprod = parseFloat(cantSubprod);
    contenido = parseFloat(contenido);
    if (um.localeCompare('lt') === 0) {
      this.contenido = this.fs.sub(this.contenido, this.fs.times(cantSubprod, UM.litroEnMl));
    }
    if (um.localeCompare('ml') === 0) {
      this.contenido = this.fs.sub(this.contenido, cantSubprod);
    }
    if (um.localeCompare('ozL') === 0) {
      this.contenido = this.fs.sub(this.contenido, this.fs.times(cantSubprod, UM.onzaEnMl))
    }
    if (um.localeCompare('gr') === 0) {
      this.contenido = this.fs.sub(this.contenido, cantSubprod);
    }
    if (um.localeCompare('oz') === 0) {
      this.contenido = this.fs.sub(this.contenido, this.fs.times(cantSubprod, UM.onzaEnGr));
    }
    if (um.localeCompare('lb') === 0) {
      this.contenido = this.fs.sub(this.contenido, this.fs.times(cantSubprod, UM.lbEnGr));
    }
    if (um.localeCompare('kg') === 0) {
      this.contenido = this.fs.sub(this.contenido, this.fs.times(cantSubprod, UM.kgEnGr));
    }
    if (um.localeCompare('u') === 0) {
      this.contenido = this.fs.sub(this.contenido, contenido);
    }
  }

  reCalcContenidoDeleteU(cantSubprod, um, contenido) {
    cantSubprod = parseFloat(cantSubprod);
    contenido = parseFloat(contenido);
    if (um.localeCompare('lt') === 0) {
      this.productoUpdate.contenido = this.fs.sub(this.productoUpdate.contenido, this.fs.times(cantSubprod, UM.litroEnMl));
    }
    if (um.localeCompare('ml') === 0) {
      this.productoUpdate.contenido = this.fs.sub(this.productoUpdate.contenido, cantSubprod);
    }
    if (um.localeCompare('ozL') === 0) {
      this.productoUpdate.contenido = this.fs.sub(this.productoUpdate.contenido, this.fs.times(cantSubprod, UM.onzaEnMl))
    }
    if (um.localeCompare('gr') === 0) {
      this.productoUpdate.contenido = this.fs.sub(this.productoUpdate.contenido, cantSubprod);
    }
    if (um.localeCompare('oz') === 0) {
      this.productoUpdate.contenido = this.fs.sub(this.productoUpdate.contenido, this.fs.times(cantSubprod, UM.onzaEnGr));
    }
    if (um.localeCompare('lb') === 0) {
      this.productoUpdate.contenido = this.fs.sub(this.productoUpdate.contenido, this.fs.times(cantSubprod, UM.lbEnGr));
    }
    if (um.localeCompare('kg') === 0) {
      this.productoUpdate.contenido = this.fs.sub(this.productoUpdate.contenido, this.fs.times(cantSubprod, UM.kgEnGr));
    }
    if (um.localeCompare('u') === 0) {
      this.productoUpdate.contenido = this.fs.sub(this.productoUpdate.contenido, contenido);
    }
  }

  flagImage = true;
  onChangeFileC(event) {
    if (event.srcElement.files.length > 0) {
      if (event.srcElement.files[0].type.includes('image')) {
        const files = event.srcElement.files[0];
        console.log(files.size);
        if (files.size <= 1000000) {
          this.flagImage = false;
          let color = '';
          if (files === undefined) {
            color = 'lightsalmon';
          } else {
            color = 'lightgreen';
          }
          this.pathLogo = files;
          document.getElementById('filesC').style.backgroundColor = color;
        } else {
          this.flagImage = true;
          (<HTMLInputElement>document.getElementById('filesC')).value = "";
          document.getElementById('filesC').style.backgroundColor = 'lightsalmon';
          this.messageGrowlService.notify('error', 'Error', 'Imagen demasiado pesada, el tamaño de la imagen es de: ' + (files.size / 1000000).toFixed(2) + " Mb.");
        }
      } else {
        this.flagImage = true;
        (<HTMLInputElement>document.getElementById('filesC')).value = "";
        document.getElementById('filesC').style.backgroundColor = 'lightsalmon';
        this.messageGrowlService.notify('error', 'Error', 'Solo se admiten imagenes!');
      }
    } else {
      this.flagImage = true;
      document.getElementById('filesC').style.backgroundColor = 'lightsalmon';
    }
  }
  flagImageU = true;
  onChangeFileU(event) {
    if (event.srcElement.files.length > 0) {
      if (event.srcElement.files[0].type.includes('image')) {
        this.colorUpdate = 'black';
        const files = event.srcElement.files[0];
        if (files.size <= 1000000) {
          this.flagImageU = false;
          let color = '';
          if (files === undefined) {
            color = 'lightsalmon';
          } else {
            color = 'lightgreen';
          }
          this.pathLogoU = files;
          document.getElementById('filesU').style.backgroundColor = color;
          document.getElementById('filesU').style.color = this.colorUpdate;
        } else {
          this.flagImageU = true;
          (<HTMLInputElement>document.getElementById('filesU')).value = "";
          document.getElementById('filesU').style.backgroundColor = 'lightsalmon';
          this.messageGrowlService.notify('error', 'Error', 'Imagen demasiado pesada, el tamaño de la imagen es de: ' + (files.size / 1000000).toFixed(2) + " Mb.");
        }
      } else {
        this.flagImageU = true;
        (<HTMLInputElement>document.getElementById('filesU')).value = "";
        document.getElementById('filesU').style.backgroundColor = 'lightsalmon';
        this.messageGrowlService.notify('error', 'Error', 'Solo se admiten imagenes!');
      }
    } else {
      this.flagImageU = true;
      document.getElementById('filesU').style.backgroundColor = 'lightsalmon';
    }
  }
  flagImageTP = true;
  onChangeFileTP(event) {
    if (event.srcElement.files.length > 0) {
      if (event.srcElement.files[0].type.includes('image')) {
        const files = event.srcElement.files[0];
        if (files.size <= 1000000) {
          this.flagImageTP = false;
          let color = '';
          if (files === undefined) {
            color = 'lightsalmon';
          } else {
            color = 'lightgreen';
          }
          this.pathLogoTP = files;
          document.getElementById('filesTP').style.backgroundColor = color;
        } else {
          this.flagImageTP = true;
          (<HTMLInputElement>document.getElementById('filesTP')).value = "";
          document.getElementById('filesTP').style.backgroundColor = 'lightsalmon';
          this.messageGrowlService.notify('error', 'Error', 'Imagen demasiado pesada, el tamaño de la imagen es de: ' + (files.size / 1000000).toFixed(2) + " Mb.");
        }
      } else {
        this.flagImageTP = true;
        (<HTMLInputElement>document.getElementById('filesTP')).value = "";
        document.getElementById('filesTP').style.backgroundColor = 'lightsalmon';
        this.messageGrowlService.notify('error', 'Error', 'Solo se admiten imagenes!');
      }
    } else {
      this.flagImageTP = true;
      document.getElementById('filesTP').style.backgroundColor = 'lightsalmon';
    }
  }
  flagImageTPU = true;
  onChangeFileTPU(event) {
    if (event.srcElement.files.length > 0) {
      if (event.srcElement.files[0].type.includes('image')) {
        this.colorUpdate = 'black';
        const files = event.srcElement.files[0];
        if (files.size <= 1500) {
          this.flagImageTPU = false;
          let color = '';
          if (files === undefined) {
            color = 'lightsalmon';
          } else {
            color = 'lightgreen';
          }
          this.pathLogoTPU = files;
          document.getElementById('filesTPU').style.backgroundColor = color;
          document.getElementById('filesTPU').style.color = this.colorUpdate;
        } else {
          this.flagImageTPU = true;
          (<HTMLInputElement>document.getElementById('filesTPU')).value = "";
          document.getElementById('filesTPU').style.backgroundColor = 'lightsalmon';
          this.messageGrowlService.notify('error', 'Error', 'Imagen demasiado pesada, el tamaño de la imagen es de: ' + (files.size / 1000000).toFixed(2) + " Mb.");
        }
      } else {
        this.flagImageTPU = true;
        (<HTMLInputElement>document.getElementById('filesTPU')).value = "";
        document.getElementById('filesTPU').style.backgroundColor = 'lightsalmon';
        this.messageGrowlService.notify('error', 'Error', 'Solo se admiten imagenes!');

      }
    } else {
      this.flagImageTPU = true;
      document.getElementById('filesTPU').style.backgroundColor = 'lightsalmon';
    }
  }

  search(id, myArray) {
    for (const entry of myArray) {
      if (entry._id === id) {
        return entry.desc_tipo_producto;
      }
    }
  }

  searchByName(nombre, myArray) {
    for (const entry of myArray) {
      if (entry.desc_tipo_producto.localeCompare(nombre) === 0) {
        return entry._id;
      }
    }
  }

  onChangeUpdtProd($event) {
    // console.log(this.productoUpdate.id_tipo_producto);
    // this.productoUpdate.id_tipo_producto = "Wiskey";
  }

  onChangeDescTPC($event) {
    this.desc_tipo_producto = this.fs.toTitleCase(this.desc_tipo_producto);
  }

  onChangeDescTPU($event) {
    this.tipoProductoUpdate.desc_tipo_producto = this.fs.toTitleCase(this.tipoProductoUpdate.desc_tipo_producto);
  }

  onChangeNombrePC($event) {
    this.nombre = this.fs.toTitleCase(this.nombre);
  }

  onChangeNombrePU($event) {
    this.productoUpdate.nombre = this.fs.toTitleCase(this.productoUpdate.nombre);
  }

  valueChangeGanancia($event) {
    const gain = this.fs.add(this.fs.div(this.utilidad, 100), 1);
    this.precio_venta = this.fs.times(this.precio_costo, gain);
    if (this.utilidad == 0) {
      this.flagProductoGasto = true;
      this.messageGrowlService.notify('info', 'Información', 'El producto NO se visualizará en el módulo de VENTAS');
      document.getElementById('filesC').style.backgroundColor = 'lightsalmon';
      document.getElementById('filesU').style.color = 'black';
    } else {
      this.flagProductoGasto = false;
    }
  }

  valueChangePrecioCompra($event) {
    /*const gain = (this.utilidad / 100) + 1;
    this.precio_venta = (this.precio_costo * gain);*/
    const gain = this.fs.add((this.fs.div(this.utilidad, 100)), 1);
    this.precio_venta = this.fs.times(this.precio_costo, gain);
  }

  valueChangePrecioVenta($event) {
    /*let dif = this.precio_venta - this.precio_costo;
    this.utilidad = (dif * 100) / this.precio_costo;*/
    const dif = this.fs.sub(this.precio_venta, this.precio_costo);
    this.utilidad = (this.fs.div(this.fs.times(dif, 100), this.precio_costo));
  }

  valueChangeGananciaU($event) {
    /*const gain = (this.productoUpdate.utilidad / 100) + 1;
    this.productoUpdate.precio_venta = this.productoUpdate.precio_costo * gain;*/
    const gain = this.fs.add(this.fs.div(this.productoUpdate.utilidad, 100), 1);
    this.productoUpdate.precio_venta = this.fs.times(this.productoUpdate.precio_costo, gain);
    if (this.productoUpdate.utilidad == 0) {
      this.flagProductoGasto = true;
      this.messageGrowlService.notify('info', 'Información', 'El producto NO se visualizará en el módulo de VENTAS');
      this.productoUpdate.id_tipo_producto = 'Producto Gasto';
      this.pathLogoU = undefined;
      document.getElementById('filesU').style.backgroundColor = 'lightsalmon';
      document.getElementById('filesU').style.color = 'black';
    } else {
      this.flagProductoGasto = false;
      this.productoUpdate.id_tipo_producto = '';
    }
  }

  valueChangePrecioCompraU($event) {
    /*const gain = (this.productoUpdate.utilidad / 100) + 1;
    this.productoUpdate.precio_venta = (this.productoUpdate.precio_costo * gain);*/
    const gain = this.fs.add((this.fs.div(this.productoUpdate.utilidad, 100)), 1);
    this.productoUpdate.precio_venta = this.fs.times(this.productoUpdate.precio_costo, gain);
  }

  valueChangePrecioVentaU($event) {
    /*let dif = this.productoUpdate.precio_venta - this.productoUpdate.precio_costo;
    this.productoUpdate.utilidad = (dif * 100) / this.productoUpdate.precio_costo;*/
    const dif = this.fs.sub(this.productoUpdate.precio_venta, this.productoUpdate.precio_costo);
    this.productoUpdate.utilidad = (this.fs.div(this.fs.times(dif, 100), this.productoUpdate.precio_costo));
  }

  controlarPrecioCosto($event) {
    if (this.flagSubProd) {
      this.contenido = 0;
      this.cant_existente = 0;
      this.cant_minima = 0;
      this.precio_costo = 0;
    }
  }

  controlarPrecioCostoU($event) {
    if (this.flagSubProdUpdate) {
      this.productoUpdate.contenido = 0;
      this.productoUpdate.cant_existente = 0;
      this.productoUpdate.cant_minima = 0;
      this.productoUpdate.precio_costo = 0;
    }
  }

  onSubmit(value: string) {
    console.log(value);
  }

  onChangeProdExistentes($event) {
    this.borderStyleProdExistente = '';
    this.loadUnits();
  }

  onChangeProdExistentesU($event) {
    this.borderStyleProdExistente = '';
    this.loadUnits();
  }

  onChangeProdSelec($event) {
    this.borderStyleProdSelec = '';
  }

  onChangeProdSelecU($event) {
    this.borderStyleProdSelec = '';
  }

  ngOnInitTipoProducto() {
    // Atributos SubProducto
    this.tipoProductoUpdate = {
      '_id': '',
      'desc_tipo_producto': '',
      'path': ''
    };
    this.desc_tipo_producto = '';
    this.pathLogoTP = undefined;
    this.pathLogoTPU = undefined;
    this.myInputVariable2.nativeElement.value = '';
    this.myInputVariable3.nativeElement.value = '';
  }

  ngOnInitProducto() {
    // Atributos Producto
    this.productoUpdate = {
      '_id': '',
      'nombre': '',
      'precio_costo': 0,
      'precio_venta': 0,
      'utilidad': 0,
      'cant_existente': 0,
      'cant_minima': 0,
      'subproductoV': [],
      'id_tipo_producto': '',
      'path': '',
      'contenido': 0
    };
    this.nombre = '';
    this.precio_costo = 0;
    this.precio_venta = 0;
    this.utilidad = 30;
    this.cant_existente = 0;
    this.cant_minima = 0;
    this.contenido = 0;
    this.contenidoMili = 0;
    this.contenidoMiliU = 0;
    this.costoCantSubProd = 0;
    this.subproductoV = [];
    this.selected_tipo_producto = '';
    this.selected_producto = '';
    this.selected_productoU = '';
    this.flagSubProd = false;
    this.flagSubProdUpdate = false;
    this.cantSubprod = 0;
    this.cantSubProdU = 0;
    this.flagListaSubProdUpdate = false;
    this.pathLogo = undefined;
    this.pathLogoU = undefined;
    this.precio_costoSubProd = 0;
    this.myInputVariable.nativeElement.value = '';
    this.myInputVariable1.nativeElement.value = '';
  }

  /* Impuestos */
  showDlgImp = false;
  showDlgImpV = false;
  choiceSet = { nombre: [], porcentaje: [], valor: [] };
  choiceSetV = { nombre: [], porcentaje: [], valor: [] };
  objIva = {
    desc: 'IVA',
    porcentaje: 12,
    valor: 0
  }
  objIce = {
    desc: 'ICE',
    porcentaje: 0,
    valor: 0
  }
  objOtro = {
    desc: 'OTRO',
    porcentaje: 0,
    valor: 0
  }
  objIvaV = {
    desc: 'IVA',
    porcentaje: 12,
    valor: 0
  }
  objIceV = {
    desc: 'ICE',
    porcentaje: 0,
    valor: 0
  }
  objOtroV = {
    desc: 'OTRO',
    porcentaje: 0,
    valor: 0
  }

  ngOnInitImp() {
    this.choiceSet.nombre = [];
    this.choiceSet.porcentaje = [];
    this.choiceSet.valor = [];
    this.choiceSetV.nombre = [];
    this.choiceSetV.porcentaje = [];
    this.choiceSetV.valor = [];
    this.objIva = {
      desc: 'IVA',
      porcentaje: 12,
      valor: 0
    }
    this.objIce = {
      desc: 'ICE',
      porcentaje: 0,
      valor: 0
    }
    this.objOtro = {
      desc: 'OTRO',
      porcentaje: 0,
      valor: 0
    }
    this.objIvaV = {
      desc: 'IVA',
      porcentaje: 12,
      valor: 0
    }
    this.objIceV = {
      desc: 'ICE',
      porcentaje: 0,
      valor: 0
    }
    this.objOtroV = {
      desc: 'OTRO',
      porcentaje: 0,
      valor: 0
    }
    this.objImp = [...this.objImp, this.objIva];
    this.objImp = [...this.objImp, this.objIce];
    this.objImp = [...this.objImp, this.objOtro];
    this.objImpV = [...this.objImpV, this.objIvaV];
    this.objImpV = [...this.objImpV, this.objIceV];
    this.objImpV = [...this.objImpV, this.objOtroV];
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  addRowImp = function () {
    this.choiceSet.nombre.push('');
    this.choiceSet.porcentaje.push('');
    this.choiceSet.valor.push('');
  };

  addRowImpV = function () {
    this.choiceSetV.nombre.push('');
    this.choiceSetV.porcentaje.push('');
    this.choiceSetV.valor.push('');
  };

  removeChoice = function (z) {
    this.choiceSet.nombre.splice(z, 1);
    this.choiceSet.porcentaje.splice(z, 1);
    this.choiceSet.valor.splice(z, 1);
  };

  removeChoiceV = function (z) {
    this.choiceSetV.nombre.splice(z, 1);
    this.choiceSetV.porcentaje.splice(z, 1);
    this.choiceSetV.valor.splice(z, 1);
  };

  objImp: any[] = [];
  objImpV: any[] = [];
  addImpuesto() {
    this.objImp = [];
    this.objImp = [...this.objImp, this.objIva];
    this.objImp = [...this.objImp, this.objIce];
    this.objImp = [...this.objImp, this.objOtro];
    let n = this.choiceSet.nombre.length;
    for (let i = 0; i < n; i++) {
      let aux = { desc: this.choiceSet.nombre[i], porcentaje: this.choiceSet.porcentaje[i], valor: this.choiceSet.valor[i] };
      this.objImp = [...this.objImp, aux];
    }
    console.log(this.objImp);
    this.messageGrowlService.notify('info', 'Información', 'Se guardaron los impuestos!');
    this.showDlgImp = false;
  }

  addImpuestoV() {
    this.objImpV = [];
    this.objImpV = [...this.objImpV, this.objIvaV];
    this.objImpV = [...this.objImpV, this.objIceV];
    this.objImpV = [...this.objImpV, this.objOtroV];
    let n = this.choiceSetV.nombre.length;
    for (let i = 0; i < n; i++) {
      let aux = { desc: this.choiceSetV.nombre[i], porcentaje: this.choiceSetV.porcentaje[i], valor: this.choiceSetV.valor[i] };
      this.objImpV = [...this.objImpV, aux];
    }
    console.log(this.objImpV);
    this.messageGrowlService.notify('info', 'Información', 'Se guardaron los impuestos!');
    this.showDlgImpV = false;
  }

  valueChangePorIva($event) {
    let porcentaje = 1 + (this.fs.div(this.objIva.porcentaje, 100));
    this.objIva.valor = this.fs.sub(this.precio_costo, (this.fs.div(this.precio_costo, porcentaje)));
  }

  valueChangePorIvaV($event) {
    let porcentaje = 1 + (this.fs.div(this.objIvaV.porcentaje, 100));
    this.objIvaV.valor = this.fs.sub(this.precio_venta, (this.fs.div(this.precio_venta, porcentaje)));
  }

  valueChangePorIce($event) {
    let porcentaje = 1 + (this.fs.div(this.objIce.porcentaje, 100));
    this.objIce.valor = this.fs.sub(this.precio_costo, (this.fs.div(this.precio_costo, porcentaje)));
  }

  valueChangePorIceV($event) {
    let porcentaje = 1 + (this.fs.div(this.objIceV.porcentaje, 100));
    this.objIceV.valor = this.fs.sub(this.precio_venta, (this.fs.div(this.precio_venta, porcentaje)));
  }

  valueChangePorOtro($event) {
    let porcentaje = 1 + (this.fs.div(this.objOtro.porcentaje, 100));
    this.objOtro.valor = this.fs.sub(this.precio_costo, (this.fs.div(this.precio_costo, porcentaje)));
  }

  valueChangePorOtroV($event) {
    let porcentaje = 1 + (this.fs.div(this.objOtroV.porcentaje, 100));
    this.objOtroV.valor = this.fs.sub(this.precio_venta, (this.fs.div(this.precio_venta, porcentaje)));
  }

  calcImp() {
    let porIva = this.fs.div(this.objIva.porcentaje, 100) + 1;
    let porIce = this.fs.div(this.objIce.porcentaje, 100) + 1;
    let porOtro = this.fs.div(this.objOtro.porcentaje, 100) + 1;
    this.objIva.valor = this.fs.sub(this.precio_costo, (this.fs.div(this.precio_costo, porIva)));
    this.objIce.valor = this.fs.sub(this.precio_costo, (this.fs.div(this.precio_costo, porIce)));
    this.objOtro.valor = this.fs.sub(this.precio_costo, (this.fs.div(this.precio_costo, porOtro)));
  }

  calcImpV() {
    let porIva = this.fs.div(this.objIvaV.porcentaje, 100) + 1;
    let porIce = this.fs.div(this.objIceV.porcentaje, 100) + 1;
    let porOtro = this.fs.div(this.objOtroV.porcentaje, 100) + 1;
    this.objIvaV.valor = this.fs.sub(this.precio_venta, (this.fs.div(this.precio_venta, porIva)));
    this.objIceV.valor = this.fs.sub(this.precio_venta, (this.fs.div(this.precio_venta, porIce)));
    this.objOtroV.valor = this.fs.sub(this.precio_venta, (this.fs.div(this.precio_venta, porOtro)));
  }

  valueChangePorGeneric(i) {
    let porcentaje = 1 + (this.fs.div(this.choiceSet.porcentaje[i], 100));
    this.choiceSet.valor[i] = this.fs.sub(this.precio_costo, (this.fs.div(this.precio_costo, porcentaje)));
  }

  valueChangePorGenericV(i) {
    let porcentaje = 1 + (this.fs.div(this.choiceSetV.porcentaje[i], 100));
    this.choiceSetV.valor[i] = this.fs.sub(this.precio_venta, (this.fs.div(this.precio_venta, porcentaje)));
  }

  onChangeDescOtroImp($event) {
    this.objOtro.desc = this.objOtro.desc.toUpperCase();
  }

  onChangeDescOtroImpV($event) {
    this.objOtroV.desc = this.objOtroV.desc.toUpperCase();
  }

  onChangeDescV(i) {
    this.choiceSet.nombre[i] = this.choiceSet.nombre[i].toUpperCase();
  }

  onChangeDescV1(i) {
    this.choiceSetV.nombre[i] = this.choiceSetV.nombre[i].toUpperCase();
  }

  /* GESTION DE PROMOCIONES */
  cantPor = 1;
  cantRecibe = 1;
  selectProdPromo;
  selected_prodP;
  selected_prodR;
  lstProductosP: any[];
  lstProductosR: any[];
  bcLstProductosP = '';
  bcLstProductosR = '';
  bcLstProductosPromo = '';
  chkTipoPromo = false;
  flagTipoPromo = false;
  flagUpdatePrize = false;
  flagTipoDesc = false;
  lstTipoProductos: any[];
  selected_tp: any;
  lstProductosShow: any[];
  lstProductos1: any[];
  selected_producto1: any;
  descPercent = 0;
  descMoney = 0;
  valorPromo = 0;
  valorNormal = 0;
  sourcePro: LocalDataSource = new LocalDataSource();
  settingsPro = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      nombre: {
        title: 'Nombre Promoción',
        width: '25%'
      },
      tipoPromo: {
        title: 'Tipo Promoción',
        width: '20%'
      },
      productosV: {
        title: 'Productos',
        width: '55%'
      }
    },
    actions: {
      // columnTitle: '',
      add: true,
      edit: false,
      delete: true
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  }
  showDialogPro = false;
  objPromo: any;
  objPromoUpdate: any;
  promociones: any = [];
  showDialogProU = false;

  setCursorAddPro() {
    this.bcLstProductosP = '';
    this.bcLstProductosR = '';
    this.bcLstProductosPromo = '';
    this.valorPromo = 0;
    this.valorNormal = 0;
    setTimeout(function () {
      document.getElementById('nombrePromo').focus();
    }, 0);
  }

  onUpdatePro(event: any) {
    setOriginalColorsPromoU()
    this.objPromoUpdate = event.data;
    console.log(event.data);
  }

  onChangeNombrePromo($event) {
    this.objPromo.nombre = this.fs.toTitleCase(this.objPromo.nombre);
  }

  addCantPor() {
    this.cantPor++;
  }

  lessCantPor() {
    if (this.cantPor > 1)
      this.cantPor--;
  }

  addCantRecibe() {
    this.cantRecibe++;
  }

  lessCantRecibe() {
    if (this.cantRecibe > 1)
      this.cantRecibe--;
  }

  addItemP() {
    if (this.selectProdPromo !== undefined) {
      const ind = this.lstProductosP.findIndex(x => x.value.nombre === this.selectProdPromo);
      if (ind !== -1) {
        this.lstProductosP[ind].cantidad += this.cantPor;
      } else {
        const index = this.productosShow.findIndex(x => x.value === this.selectProdPromo);
        let aux = { cantidad: this.cantPor, value: this.productosShow[index] };
        this.lstProductosP.push(aux);
      }
      this.calcTotalPor();
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto existente!');
      this.bcLstProductosPromo = '#FE2E2E';
    }
  }

  calcTotalPor() {
    this.valorNormal = 0;
    this.valorPromo = 0;
    for (let entry of this.lstProductosP) {
      this.valorNormal += entry.cantidad * entry.value.precio_venta;
      this.valorPromo += entry.cantidad * entry.value.precio_venta;
    }
  }

  deleteItemP() {
    if (this.selected_prodP !== undefined) {
      let nombre = this.selected_prodP.nombre
      this.lstProductosP = this.lstProductosP.filter(function (obj) {
        return obj.value.nombre !== nombre;
      });
      this.calcTotalPor();
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto!');
      this.bcLstProductosP = '#FE2E2E';
    }
  }

  addItemR() {
    if (this.selectProdPromo !== undefined) {
      const ind = this.lstProductosR.findIndex(x => x.value.nombre === this.selectProdPromo);
      if (ind !== -1) {
        this.lstProductosR[ind].cantidad += this.cantRecibe;
      } else {
        const index = this.productosShow.findIndex(x => x.value === this.selectProdPromo);
        let aux = { cantidad: this.cantRecibe, value: this.productosShow[index] };
        this.lstProductosR.push(aux);
      }

    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto existente!');
      this.bcLstProductosPromo = '#FE2E2E';
    }
  }

  deleteItemR() {
    if (this.selected_prodR !== undefined) {
      let nombre = this.selected_prodR.nombre
      this.lstProductosR = this.lstProductosR.filter(function (obj) {
        return obj.value.nombre !== nombre;
      });
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto!');
      this.bcLstProductosR = '#FE2E2E';
    }
  }

  valueChangeDescPercent($event) {
    if (this.descPercent > 100) {
      this.descPercent = 0;
      setTimeout(function () {
        let v = document.getElementById('descPercent');
        if (v != null) {
          v.click();
          this.descPercent = 0;
          this.descMoney = 0;
        }
      }, 0);
    } else {
      if (this.flagTipoDesc) {
        this.descMoney = ((100 - this.descPercent) * this.selected_producto1.precio_venta) / 100;
      }
    }
  }

  valueChangeDescMoney($event) {
    if (this.flagTipoDesc) {
      if (this.descMoney > this.selected_producto1.precio_venta) {
        this.descMoney = 0;
        setTimeout(function () {
          let v = document.getElementById('descMoney');
          if (v != null) {
            v.click();
            this.descMoney = 0;
            this.descPercent = 0;
          }
        }, 0);

      } else {
        if (this.flagTipoDesc) {
          this.descPercent = 100 - ((this.descMoney * 100) / this.selected_producto1.precio_venta);
        }
      }
    }
  }

  onChangelbTP($event) {
    this.lstProductosShow = [];
    for (let entry of this.lstProductos1) {
      //console.log(entry);
      if (entry.id_tipo_producto === this.selected_tp._id) {
        entry.precio_venta = parseFloat(entry.precio_venta);
        let aux = { label: entry.nombre, value: entry }
        this.lstProductosShow.push(aux);
      };
    };
    this.selected_producto1 = "";
  }

  onChangelbProd($event) {
    this.flagUpdatePrize = true;
    this.descMoney = this.selected_producto1.precio_venta;
  }

  changeFlag($event) {
    if (this.flagTipoDesc) {
      this.messageGrowlService.notify("info", "Información", "Selecciona un producto!");
      this.selected_producto1 = undefined;
    } else {
      //Grupal
      this.selected_producto1 = undefined;
      this.flagUpdatePrize = false;
    }
  }

  addNewPrice() {
    if (this.flagTipoDesc) {
      if (this.selected_producto1 !== undefined) {
        let index = this.lstProductos1.findIndex(i => i._id === this.selected_producto1._id);
        this.lstProductos1[index].precio_costo = this.descMoney;
        this.messageGrowlService.notify('info', 'Información', 'Precio actualizado!');
      } else {
        this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto!');
      }
    } else {
      let i = 0;
      for (let entry of this.lstProductos1) {
        if (entry.id_tipo_producto === this.selected_tp._id) {
          this.lstProductos1[i].precio_costo = ((100 - this.descPercent) * this.lstProductos1[i].precio_venta) / 100;
        }
        i++;
      }
      this.messageGrowlService.notify('info', 'Información', 'Precios actualizados!');
    }
  }

  updatePrice() {
    if (this.flagTipoDesc) {
      if (this.selected_producto1 !== undefined) {
        let index = this.lstProductos1.findIndex(i => i._id === this.selected_producto1._id);
        this.lstProductos1[index].precio_costo = this.descMoney;
        this.messageGrowlService.notify('info', 'Información', 'Precio actualizado!');
      } else {
        this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto!');
      }
    } else {
      let i = 0;
      for (let entry of this.lstProductos1) {
        if (entry.id_tipo_producto === this.selected_tp._id) {
          this.lstProductos1[i].precio_costo = ((100 - this.descPercent) * this.lstProductos1[i].precio_venta) / 100;
        }
        i++;
      }
      this.messageGrowlService.notify('info', 'Información', 'Precios actualizados!');
    }
  }

  onAddPromoSubmit() {
    if (!this.validateService.validatePromocion(this.objPromo)) {
      return false;
    }
    if (this.flagTipoPromo) {
      if (this.filterProdPromo().length > 0) {
        this.objPromo.productosV = [];
        this.objPromo.tipoPromo = 'DP';
        for (let entry of this.filterProdPromo()) {
          let aux = { id: entry._id, precio_venta: entry.precio_costo };
          this.objPromo.productosV.push(aux);
        }
        console.log(this.objPromo);
        this.promocionService.register(this.objPromo).subscribe(data => {
          this.messageGrowlService.notify('success', 'Exito', 'Ingreso Exitoso!');
          this.sourcePro.add(data);
          this.sourcePro.refresh();
          this.showDialogPro = false;
          setOriginalColorsPromo();
          this.ngOnInitPromo();
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        })
      } else {
        this.messageGrowlService.notify('error', 'Error', 'No se ha modificado el precio de ningun producto!');
      }
    } else {
      if (this.lstProductosP.length > 0 && this.lstProductosR.length > 0) {
        this.objPromo.productosV = [];
        this.objPromo.tipoPromo = 'AP';
        //Productos Por
        let aux1 = { p: [] };
        let lst1: any = [];
        for (let entry of this.lstProductosP) {
          let a = { cantidad: entry.cantidad, id: entry.value._id };
          lst1.push(a);
        }
        aux1.p = lst1;
        this.objPromo.productosV.push(aux1);
        //Productos Recibe
        let aux2 = { r: [] };
        let lst2: any = [];
        for (let entry of this.lstProductosR) {
          let a = { cantidad: entry.cantidad, id: entry.value._id };
          lst2.push(a);
        }
        aux2.r = lst2;
        this.objPromo.productosV.push(aux2);
        let aux3 = { v: this.valorPromo };
        this.objPromo.productosV.push(aux3);
        console.log(this.objPromo);
        this.promocionService.register(this.objPromo).subscribe(data => {
          this.messageGrowlService.notify('success', 'Exito', 'Ingreso Exitoso!');
          this.sourcePro.add(data);
          this.sourcePro.refresh();
          this.showDialogPro = false;
          setOriginalColorsPromo();
          this.ngOnInitPromo();
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        })
      } else {
        this.messageGrowlService.notify('error', 'Error', 'No se ha modificado el precio de ningun productoss!');
      }
    }

  }

  onUpdatePromoSubmit() {
    if (!this.validateService.validatePromocionU(this.objPromoUpdate)) {
      return false;
    }
    this.promocionService.update(this.objPromoUpdate).subscribe(data => {
      this.messageGrowlService.notify('success', 'Exito', 'Modificación Exitosa!');
      this.sourcePro.update(this.objPromoUpdate, this.objPromoUpdate);
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    })
    this.showDialogProU = false;
    setOriginalColorsPromoU();
  }

  filterProdPromo() {
    let newLst: any = [];
    for (let entry of this.lstProductos1) {
      if (entry.precio_costo !== entry.precio_venta) {
        newLst.push(entry)
      }
    }
    return newLst;
  }

  onDeletePro(event): void {
    this.openDialogPromo(event.data);
  }

  openDialogPromo(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          // remove from database
          this.promocionService.delete(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
            this.ngOnInitPromo();
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');

          });
        }
      }
    });
  }

  ngOnInitPromo() {
    this.lstProductosP = [];
    this.lstProductosR = [];
    this.lstTipoProductos = [];
    this.lstProductos1 = [];
    this.lstProductosShow = [];
    this.tipoProductoService.getAll().subscribe(data => {
      for (let entry of data) {
        let aux = { label: entry.desc_tipo_producto, value: entry }
        this.lstTipoProductos.push(aux);
      }
      this.selected_tp = this.lstTipoProductos[0].value;
      this.productoService.getAll().subscribe(data => {
        for (let entry of data) {
          entry.precio_venta = parseFloat(entry.precio_venta);
          entry.precio_costo = parseFloat(entry.precio_venta);
          this.lstProductos1.push(entry);
          if (entry.id_tipo_producto === this.selected_tp._id) {
            let aux = { label: entry.nombre, value: entry }
            this.lstProductosShow.push(aux);
          }
        }
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
    });
    //fill table promos
    this.promocionService.getAll().subscribe(data => {
      let lst: any = [];
      for (let entry of data) {
        let aux = { _id: entry._id, nombre: entry.nombre, tipoPromo: entry.tipoPromo, productosV: entry.productosV };
        if (entry.tipoPromo.localeCompare('AP') === 0) {
          let filaP = '';
          for (let p of entry.productosV[0].p) {
            filaP += '-' + p.cantidad + ' ' + this.searchDescProd(p.id, this.productos) + ' ';
          }
          let filaR = '';
          for (let r of entry.productosV[1].r) {
            filaR += '-' + r.cantidad + ' ' + this.searchDescProd(r.id, this.productos) + ' ';
          }
          aux.productosV = 'POR: ' + filaP + ' RECIBE: ' + filaR + 'PRECIO: $' + entry.productosV[2].v;
        } else {
          let fila = '';
          for (let prod of entry.productosV) {
            fila += '-' + this.searchDescProd(prod.id, this.productos) + ' $' + this.decimalPipe.transform(prod.precio_venta, '1.2-2') + ' ';
          }
          aux.productosV = fila;
        }
        lst.push(aux);

      }
      this.sourcePro = new LocalDataSource();
      this.sourcePro.load(lst);
    }, err => {
      console.log(err);
    });
  }

  /* GESTION DE COMPRAS */

  /* GESTION DE KARDEX */
  public getDate(): number {
    return this.dt && this.dt.getTime() || new Date().getTime();
  }

  ngOnInitKardex() {
    /*this.kardex = {
      'fecha': '',
      'desc_producto': '',
      'proveedor': '',
      'cantidad': 0,
      'total': 0,
      'num_factura': '',
      'contenido': 0
    };
    this.kardex.fecha = this.todayDate;
    this.validRuc = true;
    this.showDialogK = false;
    this.showDialogKU = false;*/
  }

  /*saveKardexOp() {

    if (!this.checkedC) {
      console.log('producto');
    } else {
      console.log('materia');
    }
  }

  saveKardex() {
    if (this.flagProdC === true) {
      if (!this.validateService.validateKardex(this.kardex)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
    } else {
      if (!this.validateService.validateKardex1(this.kardex)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
    }
    //new product
    if (this.flagProdC === true) {
      const producto = {
        nombre: this.kardex.desc_producto,
        precio_costo: this.kardex.total / this.kardex.cantidad,
        precio_venta: 0,
        utilidad: 30,
        cant_existente: this.kardex.cantidad,
        subproductoV: [],
        id_tipo_producto: this.selectedTP._id,
        path: this.selectedTP.path,
        contenido: this.kardex.contenido,
        promocion: []
      };
      producto.precio_venta = this.calcPrecioVentaKardex(producto.precio_costo, producto.utilidad);
      this.productoService.registerProducto(producto).subscribe(data => {
        this.kardex.desc_producto = data._id;
        this.kardexService.register(this.kardex).subscribe(dataP => {
          this.sourceK.add(dataP);
          this.sourceK.refresh();
          this.ngOnInit();
          this.ngOnInitKardex();
          this.messageGrowlService.notify('info', 'Información', 'Se ha ingresado un nuevo producto, revisa sus datos antes de que pasen al modulo de VENTAS!');
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        })
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      });
      setOriginalColorsKardex();
    } else {
      //update product
      let prod: any;
      prod = this.kardex.desc_producto;
      const producto = {
        nombre: prod.nombre,
        precio_costo: (parseFloat(prod.precio_costo) + (this.kardex.total / this.kardex.cantidad)) / 2,
        precio_venta: 0,
        utilidad: prod.utilidad,
        cant_existente: prod.cant_existente + this.kardex.cantidad,
        subproductoV: prod.subproductoV,
        id_tipo_producto: this.selectedTP._id,
        path: prod.path,
        contenido: prod.contenido,
        promocion: prod.promocion,
        _id: prod._id
      };
      producto.precio_venta = this.calcPrecioVentaKardex(producto.precio_costo, producto.utilidad);
      this.productoService.updateProducto(producto).subscribe(data => {
        this.kardex.desc_producto = producto._id;
        this.kardexService.register(this.kardex).subscribe(dataP => {
          this.sourceK.add(dataP);
          this.sourceK.refresh();
          this.ngOnInit();
          this.ngOnInitKardex();
          this.messageGrowlService.notify('info', 'Información', 'Se ha actualizada el producto, revisa sus datos antes de que pasen al modulo de VENTAS!');
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        })

      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      })
      setOriginalColorsKardex1();
    }
  }

  saveKardexM() {
    if (this.flagProdC === true) {
      if (!this.validateService.validateKardex(this.kardex)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
    } else {
      if (!this.validateService.validateKardex1(this.kardex)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
    }
    //new product
    if (this.flagProdC === true) {

      const materia = {
        nombre: this.kardex.desc_producto,
        precio_costo: this.kardex.total / this.kardex.cantidad,
        cant_existente: this.kardex.cantidad,
        contenido: this.kardex.contenido,
        unidad_medida: 'vacio'
      };
      this.materiaPrimaService.register(materia).subscribe(data => {
        this.kardex.desc_producto = data._id;
        this.kardexService.register(this.kardex).subscribe(dataP => {
          this.sourceK.add(dataP);
          this.sourceK.refresh();
          this.ngOnInit();
          this.ngOnInitKardex();
          this.messageGrowlService.notify('info', 'Información', 'Se ha ingresado un nuevo producto, revisa sus datos antes de que pasen al modulo de VENTAS!');
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        })
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      });
      setOriginalColorsKardex();
    } else {
      //update product
      let prod: any;
      prod = this.kardex.desc_producto;
      const producto = {
        nombre: prod.nombre,
        precio_costo: (parseFloat(prod.precio_costo) + (this.kardex.total / this.kardex.cantidad)) / 2,
        precio_venta: 0,
        utilidad: prod.utilidad,
        cant_existente: prod.cant_existente + this.kardex.cantidad,
        subproductoV: prod.subproductoV,
        id_tipo_producto: this.selectedTP._id,
        path: prod.path,
        contenido: prod.contenido,
        promocion: prod.promocion,
        _id: prod._id
      };
      producto.precio_venta = this.calcPrecioVentaKardex(producto.precio_costo, producto.utilidad);
      this.productoService.updateProducto(producto).subscribe(data => {
        this.kardex.desc_producto = producto._id;
        this.kardexService.register(this.kardex).subscribe(dataP => {
          this.sourceK.add(dataP);
          this.sourceK.refresh();
          this.ngOnInit();
          this.ngOnInitKardex();
          this.messageGrowlService.notify('info', 'Información', 'Se ha actualizada el producto, revisa sus datos antes de que pasen al modulo de VENTAS!');
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        })

      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      })
      setOriginalColorsKardex1();
    }
  }*/

  calcPrecioVentaKardex(precio_costo, utilidad) {
    precio_costo = (precio_costo * 100) / 100;
    const gain = (utilidad / 100) + 1;
    return (precio_costo * gain);
  }

  showProveK() {
    /*this.showDialogProve = true;
    this.setCursorAddProve();*/
  }

  /*onClickSelectButtonU(event) {
    if (this.selectedIeProd.localeCompare('Existente') == 0) {
      this.flagProdC = false;
      //this.kardexU.desc_producto = this.lstProductos[0];
      let a: any;
      a = this.kardexU.desc_producto
      this.newProd = a;
      this.kardexU.contenido = this.newProd.contenido;
    } else {
      this.flagProdC = true;
      this.kardexU.desc_producto = '';
      setTimeout(function () {
        document.getElementById('desc_productoKU').focus();
        setOriginalColorsKardex();
      }, 0);
    }
  }*/

  setCursorUpdateK(event: any) {
    /*let lst = JSON.parse(localStorage.getItem('lstKardex'));
    let prodUpdt = lst.filter(function (obj) {
      return obj._id.localeCompare(event.data._id) === 0;
    });
    this.kardexU = prodUpdt[0];
    this.selectedIeProd = 'Existente';
    this.flagProdC = false;
    setTimeout(function () {
      setOriginalColorsKardex1U();
    }, 0);
    let typeProd = typeof (this.kardexU.desc_producto);
    if (typeProd.localeCompare('string') === 0) {
      this.kardexU.proveedor = this.searchProveByDesc(this.kardexU.proveedor, this.lstProveedoresK);
      let prod = this.searchProdByDesc(this.kardexU.desc_producto, this.productos);
      this.selectedTP = this.searchTipoProdByDesc(prod.id_tipo_producto, this.tipo_productos);
      this.onChangelstTPU();
      this.kardexU.desc_producto = prod;
    } else {
      let aux: any;
      aux = this.kardexU.desc_producto;
      this.selectedTP = this.searchTipoProdByDesc(aux.id_tipo_producto, this.tipo_productos);
      this.onChangelstTPU();
      this.kardexU.desc_producto = aux;
    }*/
  }

  onChangelstTP($event) {
    this.lstProductos = [];
    for (let entry of this.productos) {
      if (entry.id_tipo_producto.localeCompare(this.selectedTP.desc_tipo_producto) === 0) {
        this.lstProductos.push(entry);
      }
    }
    //this.kardex.desc_producto = this.lstProductos[0];
    let a: any;
    a = this.kardex.desc_producto
    this.newProd = a;
    this.kardex.contenido = this.newProd.contenido;
  }

  onChangelstTPU() {
    this.lstProductos = [];
    for (let entry of this.productos) {
      if (entry.id_tipo_producto.localeCompare(this.selectedTP.desc_tipo_producto) === 0) {
        this.lstProductos.push(entry);
      }
    }
    //this.kardexU.desc_producto = this.lstProductos[0];
    let a: any;
    a = this.kardexU.desc_producto
    this.newProd = a;
    this.kardexU.contenido = this.newProd.contenido;
  }

  onChangeProdK($event) {
    let a: any;
    a = this.kardex.desc_producto
    this.newProd = a;
    this.kardex.contenido = this.newProd.contenido;
  }

  onChangeProdKU($event) {
    let a: any;
    a = this.kardexU.desc_producto
    this.newProd = a;
    this.kardexU.contenido = this.newProd.contenido;
  }

  onChangeUnidades($event) {
    if (this.kardex.total !== 0 && this.kardex.cantidad !== 0)
      this.prizeKardex = this.kardex.total / this.kardex.cantidad
  }

  onChangeTotalK($event) {
    if (this.kardex.total !== 0 && this.kardex.cantidad !== 0)
      this.prizeKardex = this.kardex.total / this.kardex.cantidad
  }

  onChangeUnidadesU($event) {
    if (this.kardexU.total !== 0 && this.kardexU.cantidad !== 0)
      this.prizeKardex = this.kardexU.total / this.kardexU.cantidad
  }

  onChangeTotalKU($event) {
    if (this.kardexU.total !== 0 && this.kardexU.cantidad !== 0)
      this.prizeKardex = this.kardexU.total / this.kardexU.cantidad
  }

  searchDescProve(id, myArray) {
    for (const entry of myArray) {
      if (entry._id === id) {
        return entry.nombre_proveedor;
      }
    }
  }

  searchProveByDesc(desc, myArray) {
    for (const entry of myArray) {
      if (entry.nombre_proveedor === desc) {
        return entry;
      }
    }
  }

  searchProdByDesc(desc, myArray) {
    for (const entry of myArray) {
      if (entry.nombre === desc) {
        return entry;
      }
    }
  }

  searchTipoProdByDesc(desc, myArray) {
    for (const entry of myArray) {
      if (entry.desc_tipo_producto === desc) {
        return entry;
      }
    }
  }

  searchTipoProdById(id, myArray) {
    for (const entry of myArray) {
      if (entry._id === id) {
        return entry;
      }
    }
  }

  searchDescProd(id, myArray) {
    for (const entry of myArray) {
      if (entry._id === id) {
        return entry.nombre;
      }
    }
  }

  searchOldProdK(id, callback: (d) => void) {
    this.kardexService.getById(id).subscribe(data => {
      return this.productoService.getById(data[0].desc_producto).subscribe(res => {
        callback(res);
      }, err => {
        console.error(err);
      });
    }, err => {
      console.log(err);
    })
  }

  /*updateKardex() {
    if (this.flagProdC === true) {
      if (!this.validateService.validateKardexU(this.kardexU)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
    } else {
      if (!this.validateService.validateKardex1U(this.kardexU)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
    }
    if (this.flagProdC === true) {

      let prodToUpd: any;
      let a: any = this.kardexU;
      //Update old producto
      this.searchOldProdK(a._id, (data) => {
        prodToUpd = data;
        this.kardexService.getById(a._id).subscribe(dataK => {
          let cantToDrop = parseFloat(dataK[0].cantidad);
          prodToUpd[0].cant_existente -= cantToDrop;
          this.productoService.updateProducto(prodToUpd[0]).subscribe(res => {
            this.ngOnInit();
            this.ngOnInitKardex();
          }, err => {
            console.error(err);
          });
        }, err => {
          console.log(err);
        })
      });
      //Insert new producto
      const producto = {
        nombre: this.kardexU.desc_producto,
        precio_costo: this.kardexU.total / this.kardexU.cantidad,
        precio_venta: 0,
        utilidad: 30,
        cant_existente: this.kardexU.cantidad,
        subproductoV: [],
        id_tipo_producto: this.selectedTP._id,
        path: '',
        contenido: this.kardexU.contenido,
        promocion: []
      };
      producto.precio_venta = this.calcPrecioVentaKardex(producto.precio_costo, producto.utilidad);
      this.productoService.registerProducto(producto).subscribe(data => {
        this.kardexU.desc_producto = data._id;
        this.kardexService.update(this.kardexU).subscribe(dataP => {
          this.ngOnInit();
          this.ngOnInitKardex();
          this.messageGrowlService.notify('info', 'Información', 'Se ha ingresado un nuevo producto, revisa sus datos antes de que pasen al modulo de VENTAS!');
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        })
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      });
      setOriginalColorsKardex();
    } else {
      //Verificar si se cambio de producto existente
      let prod_actual: any = this.kardexU.desc_producto;
      let a: any = this.kardexU;
      this.kardexService.getById(a._id).subscribe(dataK => {
        let idProdKardex = dataK[0].desc_producto;
        if (prod_actual._id === idProdKardex) {
          let cant1 = parseFloat(prod_actual.cant_existente);
          let cant2 = this.kardexU.cantidad;
          let cant3 = parseFloat(dataK[0].cantidad);
          let promCant = (cant1 - cant3) + cant2;
          console.log(promCant);
          let pc1 = prod_actual.precio_costo;
          let pc2 = this.kardexU.total / this.kardexU.cantidad;
          let pc3 = dataK[0].total / dataK[0].cantidad;
          let pcAnt = (pc1 * 2) - pc3;
          let promPC = (pc2 + pcAnt) / 2
          console.log(promPC);
          const producto = {
            nombre: prod_actual.nombre,
            precio_costo: promPC,
            precio_venta: 0,
            utilidad: prod_actual.utilidad,
            cant_existente: promCant,
            subproductoV: prod_actual.subproductoV,
            id_tipo_producto: this.selectedTP._id,
            path: prod_actual.path,
            contenido: prod_actual.contenido,
            promocion: prod_actual.promocion,
            _id: prod_actual._id
          };
          producto.precio_venta = this.calcPrecioVentaKardex(producto.precio_costo, producto.utilidad);
          this.productoService.updateProducto(producto).subscribe(data => {
            this.kardexU.desc_producto = data._id;
            this.kardexService.update(this.kardexU).subscribe(dataP => {
              this.ngOnInit();
              this.ngOnInitKardex();
              this.messageGrowlService.notify('info', 'Información', 'Se ha cambiado el producto, revisa sus datos antes de que pasen al modulo de VENTAS!');
            }, err => {
              console.log(err);
              this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
            })
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
          })
        } else {
          let cant1 = parseFloat(prod_actual.cant_existente);
          let cant2 = parseFloat(this.kardexU.cantidad.toString());
          let cant3 = parseFloat(dataK[0].cantidad);
          this.productoService.getById(idProdKardex).subscribe(dataP => {
            dataP[0].cant_existente -= cant3;
            this.productoService.updateProducto(dataP[0]).subscribe(dataP1 => {
              this.productoService.getById(prod_actual._id).subscribe(dataP2 => {
                let nCant = cant1 + cant2;
                dataP2[0].cant_existente = nCant;
                this.productoService.updateProducto(dataP2[0]).subscribe(dataP3 => {
                  this.kardexService.update(this.kardexU).subscribe(dataK => {
                    this.ngOnInit();
                    this.ngOnInitKardex();
                    this.messageGrowlService.notify('info', 'Información', 'Se ha cambiado el producto, revisa sus datos antes de que pasen al modulo de VENTAS!');
                  }, err => {
                    console.log(err);
                  })
                }, err => {
                  console.log(err);
                })
              }, err => {
                console.log(err);
              })
            }, err => {
              console.log(err);
            })
          }, err => {
            console.log(err);
          })
        }
      }, err => {
        console.log(err);
      })
      setOriginalColorsKardex1();
    }
  }*/

  showKardex(event: any) {
    this.showProdDialog = event.data.desc_producto;
    this.showVentasDetail = true;
  }

  onChangelstTR($event) {
    if (this.selectedTR.value === 0) {
      this.flagResumenVentas = false;
    }
    if (this.selectedTR.value === 1) {
      this.flagResumenVentas = true;
    }
  }

  onChangeFrecuencia($event) {
    console.log(this.selectedFrecuencia);
  }

  onDeleteK(event): void {
    this.openDialogK(event.data);
  }

  openDialogK(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          let resCant = parseFloat(data.cantidad);
          let prod: any = data.desc_producto;
          console.log(prod);
          // remove from database
          this.kardexService.delete(data._id).subscribe(data => {
            this.productoService.getByNombre(prod).subscribe(data => {
              //Update producto
              let cant_exis = data[0].cant_existente;
              let res = cant_exis - resCant;
              data[0].cant_existente = res;
              this.productoService.updateProducto(data[0]).subscribe(data => {
                this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
                this.ngOnInit();
                this.ngOnInitKardex();
                this.sourceK.remove(data);
                this.sourceK.refresh();
              }, err => {
                console.log(err);
                this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');
              });
            }, err => {
              console.log(err);
              this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');
            });
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');
          });
        }
      }
    });
  }

  onChangeNombrePK($event) {
    this.kardex.desc_producto = this.fs.toTitleCase(this.kardex.desc_producto);
  }

  onChangeNombrePKU($event) {
    this.kardexU.desc_producto = this.fs.toTitleCase(this.kardexU.desc_producto);
  }

  /* GESTION DE PROVEEDORES */
  //Representante

  /* GESTION DE PROMOCIONES */
  sourceMat: LocalDataSource = new LocalDataSource();
  settingsMat = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      cant_existente: {
        title: 'Cant. Existente',
        width: '15%'
      },
      nombre: {
        title: 'Nombre',
        width: '40%'
      },
      precio_costo: {
        title: 'Precio Costo',
        width: '15%'
      },
      unidad_medida: {
        title: 'Unidad de Medida',
        width: '15%'
      },
      contenido: {
        title: 'Contenido',
        width: '15%'
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
  objMat = {
    nombre: '',
    cant_existente: 0,
    precio_costo: 0,
    unidad_medida: 0,
    contenido: 0
  };
  showDialogMat = false;
  showDialogMatU = false;
  lstUnidadMedida: any = [];
  lstUnidadMedida1: any = [];
  flagUnits = true;
  selectedUmMat: any;
  selectedUmMat1: any;
  idMatUpdate: any;

  setCursorAddMat() {
    setTimeout(function () {
      document.getElementById('nombreMat').focus();
      setOriginalColorsMat();
    }, 0);
    this.setDvMat();
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
      this.blockFlagCont = false;
    }
    if (this.selectedUmMat.value === 1) {
      this.flagUnits = true;
      this.lstUnidadMedida1 = [];
      this.lstUnidadMedida1.push({ label: 'Mililitros', value: 0 });
      this.lstUnidadMedida1.push({ label: 'Onza Liquida', value: 1 });
      this.lstUnidadMedida1.push({ label: 'Litros', value: 2 });
      this.selectedUmMat1 = this.lstUnidadMedida1[0];
      this.blockFlagCont = false;
    }
    if (this.selectedUmMat.value === 2) {
      this.flagUnits = false;
      this.lstUnidadMedida1 = [];
      this.objMat.contenido = 0;
      this.blockFlagCont = true;
      this.contenido = 0;
    }
  }

  onChangeNombreMat($event) {
    this.objMat.nombre = this.fs.toTitleCase(this.objMat.nombre);
  }

  setDvMat() {
    this.objMat = {
      nombre: '',
      cant_existente: 0,
      precio_costo: 0,
      unidad_medida: 0,
      contenido: 0
    };
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

  onAddMatSubmit() {
    if (this.selectedUmMat.value !== 2) {
      this.objMat.unidad_medida = this.selectedUmMat1.label;
    } else {
      this.objMat.unidad_medida = this.selectedUmMat.label;
    }

    if (!this.validateService.customValidateMateria(this.objMat)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }

    this.materiaPrimaService.register(this.objMat).subscribe(data => {
      this.showDialogMat = false;
      setOriginalColorsMat();
      this.ngOnInitMateriaPrima();
      this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
  }

  setCursorUpdateMat(event: any) {
    setTimeout(function () {
      document.getElementById('nombreMatU').focus();
      setOriginalColorsMat();
    }, 0);
    this.setDvMat();
  }

  onUpdateMatSubmit() {
    if (this.selectedUmMat.value !== 2) {
      this.objMat.unidad_medida = this.selectedUmMat1.label;
    } else {
      this.objMat.unidad_medida = this.selectedUmMat.label;
    }

    console.log(this.objMat);

    if (!this.validateService.customValidateMateriaU(this.objMat)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    this.objMat['_id'] = this.idMatUpdate;
    this.materiaPrimaService.update(this.objMat).subscribe(data => {
      this.showDialogMatU = false;
      setOriginalColorsMatU();
      this.ngOnInitMateriaPrima();
      this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
  }

  onUpdateMat(event: any) {
    this.objMat.cant_existente = event.data.cant_existente;
    this.objMat.contenido = event.data.contenido;
    this.objMat.nombre = event.data.nombre;
    this.objMat.precio_costo = event.data.precio_costo;
    this.objMat.unidad_medida = event.data.unidad_medida;
    this.idMatUpdate = event.data._id;
    this.searchUm(event.data.unidad_medida)
  }

  searchUm(value: any) {
    if (value.localeCompare('Unidades') === 0) {
      let result = this.lstUnidadMedida.filter(function (obj) {
        return obj.label.localeCompare(value) === 0;
      });
      this.selectedUmMat = result[0];
      this.flagUnits = false;
      this.lstUnidadMedida1 = [];
      this.objMat.contenido = 0;
    } else {

      if (value.localeCompare('Gramos') || value.localeCompare('Onza') || value.localeCompare('Libras') || value.localeCompare('Kilogramos')) {

        this.lstUnidadMedida1 = [];
        this.lstUnidadMedida1.push({ label: 'Gramos', value: 0 });
        this.lstUnidadMedida1.push({ label: 'Onza', value: 1 });
        this.lstUnidadMedida1.push({ label: 'Libras', value: 2 });
        this.lstUnidadMedida1.push({ label: 'Kilogramos', value: 3 });

        let result = this.lstUnidadMedida.filter(function (obj) {
          return obj.value === 0;
        });
        this.selectedUmMat = result[0];

        let result1 = this.lstUnidadMedida1.filter(function (obj) {
          return obj.label.localeCompare(value) === 0;
        });
        this.selectedUmMat1 = result1[0];

      }
      if (value.localeCompare('Mililitros') || value.localeCompare('Onza Liquida') || value.localeCompare('Litros')) {

        this.lstUnidadMedida1 = [];
        this.lstUnidadMedida1.push({ label: 'Gramos', value: 0 });
        this.lstUnidadMedida1.push({ label: 'Onza', value: 1 });
        this.lstUnidadMedida1.push({ label: 'Libras', value: 2 });
        this.lstUnidadMedida1.push({ label: 'Kilogramos', value: 3 });

        let result = this.lstUnidadMedida.filter(function (obj) {
          return obj.value === 0;
        });
        this.selectedUmMat = result[0];

        let result1 = this.lstUnidadMedida1.filter(function (obj) {
          return obj.label.localeCompare(value) === 0;
        });
        this.selectedUmMat1 = result1[0];

      }
    }
  }

  onDeleteMat(event): void {
    this.openDialogMat(event.data);
  }

  openDialogMat(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          // remove from database
          this.materiaPrimaService.delete(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
            this.ngOnInitMateriaPrima();
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');

          });
        }
      }
    });
  }

  ngOnInitMateriaPrima() {
    this.setDvMat();
    this.materiaPrimaService.getAll().subscribe(data => {
      //console.log(data);
      this.sourceMat = data;
    }, err => {
      console.log(err);
    });
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

function setOriginalColorsPC() {
  // border Color #dadad2
  // readonly Color #f8f5f0
  // error Color FE2E2E
  document.getElementById("nombrePC").style.borderColor = "";
  document.getElementById("pcPC").style.borderColor = "";
  document.getElementById("pvPC").style.borderColor = "";
  document.getElementById("tipoPC").style.borderColor = "";
  document.getElementById("contPC").style.borderColor = "";
}

function setOriginalColorsPU() {
  document.getElementById('nombrePU').style.borderColor = '';
  document.getElementById("pcPU").style.borderColor = "";
  document.getElementById("pvPU").style.borderColor = "";;
  document.getElementById('tipoPU').style.borderColor = '';
  document.getElementById('contPU').style.borderColor = '';
}

function setOriginalColorsTPC() {
  document.getElementById('descTPC').style.borderColor = '';
  document.getElementById('filesTP').style.borderColor = '';
}

function setOriginalColorsTPU() {
  document.getElementById('descTPU').style.borderColor = '';
  document.getElementById('filesTPU').style.borderColor = '';
}

function setOriginalColorsPromo() {
  document.getElementById("nombrePromo").style.borderColor = "";
}

function setOriginalColorsPromoU() {
  document.getElementById("nombrePromoU").style.borderColor = "";
  document.getElementById("desdePromoU").style.borderColor = "";
  document.getElementById("hastaPromoU").style.borderColor = "";
}

function setOriginalColorsKardex() {
  document.getElementById("desc_productoK").style.borderColor = "";
  document.getElementById("num_facturaK").style.borderColor = "";
  document.getElementById("fechaK").style.borderColor = "";
  document.getElementById("selectProve").style.borderColor = "";
  document.getElementById("cantK").style.borderColor = "";
  document.getElementById("totalK").style.borderColor = "";
}

function setOriginalColorsKardex1() {
  document.getElementById("desc_productoK1").style.borderColor = "";
  document.getElementById("num_facturaK").style.borderColor = "";
  document.getElementById("fechaK").style.borderColor = "";
  document.getElementById("selectProve").style.borderColor = "";
  document.getElementById("cantK").style.borderColor = "";
  document.getElementById("totalK").style.borderColor = "";
}

function setOriginalColorsKardexU() {
  document.getElementById("desc_productoKU").style.borderColor = "";
  document.getElementById("num_facturaKU").style.borderColor = "";
  document.getElementById("fechaKU").style.borderColor = "";
  document.getElementById("selectProve").style.borderColor = "";
  document.getElementById("cantKU").style.borderColor = "";
  document.getElementById("totalKU").style.borderColor = "";
}

function setOriginalColorsKardex1U() {
  document.getElementById("num_facturaKU").style.borderColor = "";
  document.getElementById("cantKU").style.borderColor = "";
  document.getElementById("totalKU").style.borderColor = "";
}

function setOriginalColorsMat() {
  document.getElementById("nombreMat").style.borderColor = "";
}

function setOriginalColorsMatU() {
  document.getElementById("nombreMatU").style.borderColor = "";
}