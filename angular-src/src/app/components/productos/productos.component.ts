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
import { DecimalPipe, DatePipe } from '@angular/common';

const URL = 'http://localhost:3000/api/imagen';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})

export class ProductosComponent implements OnInit {

  tmpProd;
  borderStyleProdExistente = '#DADAD2';
  borderStyleProdSelec = '#DADAD2'
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
        width: '90px',
        filter: false
      },
      desc_tipo_producto: {
        title: 'Nombre',
        width: '350px'
      },
      path: {
        title: 'Logotipo',
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
  lstContenido: SelectItem[];
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
  types: any[];
  selectedIeProd = 'Nuevo';
  flagProdK = true;
  settingsProve = {};
  sourceProve: LocalDataSource = new LocalDataSource();
  showDialogProve = false;
  objProve = {
    nombre_proveedor: '',
    ruc: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    correo: ''
  };
  validRuc = false;
  showComprasDetail = false;
  lstComprasProve: any[];
  showProveDialog;
  oldProve: any;
  showDialogProveU = false;
  showDialogKU = false;
  lstProveedoresK: any[];
  todayDate: any;
  selectedTP: any;
  lstProductos: any[];
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
    private kardexService: KardexService) {

    this.pathLogo = undefined;
    this.lstUnidades = [];
    this.lstUnidades.push({ label: 'Litros', value: { id: 1, name: 'Litros', code: 'Lts' } });
    this.lstUnidades.push({ label: 'Mililitros', value: { id: 2, name: 'Mililitros', code: 'ml' } });
    this.lstUnidades.push({ label: 'Onzas', value: { id: 3, name: 'Onzas', code: 'oz' } });
    this.lstUnidades.push({ label: 'Unidades', value: { id: 4, name: 'Onzas', code: 'u' } });
    this.unidadMedidaSuproducto = this.lstUnidades[0];
    this.lstContenido = [];
    this.lstContenido.push({ label: 'l', value: 0 });
    this.lstContenido.push({ label: 'ml', value: 1 });
    this.lstContenido.push({ label: 'oz', value: 2 });
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
    this.lstComprasProve = [
      { desc_producto: 'Cerveza budweiser 350ml', fecha: '20/01/2017', unidades: '25', total: '5' },
      { desc_producto: 'Cerveza pilsener 350ml', fecha: '20/01/2017', unidades: '25', total: '4' },
      { desc_producto: 'Wiskey grants 1LT', fecha: '20/01/2017', unidades: '25', total: '2' },
      { desc_producto: 'Pecera jaggerboom', fecha: '20/01/2017', unidades: '25', total: '2' },
      { desc_producto: 'Pecera jaggerboom', fecha: '20/01/2017', unidades: '25', total: '2' },
      { desc_producto: 'Pecera jaggerboom', fecha: '20/01/2017', unidades: '25', total: '2' },
      { desc_producto: 'Cerveza corona pequeña', fecha: '20/01/2017', unidades: '25', total: '7' }
    ];
    //console.log((0.3 - 0.1).toFixed(2));

    var x = window.innerWidth;
    this.onRzOnInit(x);
  }

  ngOnInit() {
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
    this.types = [];
    this.types.push({ label: 'Nuevo', value: 'Nuevo' });
    this.types.push({ label: 'Existente', value: 'Existente' });
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
    this.productos = {
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
    };
    /* Get Tipo Productos*/
    this.tipoProductoService.getAll().subscribe(tp => {
      this.tipo_productos = tp;
      if (this.tipo_productos.length > 0) {
        this.selectedTP = this.tipo_productos[0]
      }
      localStorage.setItem('lstTipoProductos', JSON.stringify(this.tipo_productos));
      this.sourceTP = new LocalDataSource();
      this.sourceTP.load(this.tipo_productos);
      const selectShow: { value: string, title: string }[] = [];
      let ind = 0;
      for (const entry of tp) {
        const aux = { value: entry.desc_tipo_producto, title: entry.desc_tipo_producto };
        selectShow[ind] = aux;
        ind++;
      }
      /* Get Productos*/
      this.productoService.getAll().subscribe(p => {
        this.productos = p;
        this.productosShow = [];
        for (let entry of p) {
          if (entry.subproductoV.length < 1)
            this.productosShow.push(entry);
        }

        this.proveedorService.getAll().subscribe(data => {
          this.lstProveedoresK = data;
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
        })
        this.lstProductos = [];
        if (this.productos.length > 0) {
          for (let entry of this.productos) {
            if (entry.id_tipo_producto === this.selectedTP._id)
              this.lstProductos.push(entry);
          }
        }
        let i = 0;
        for (const x of p) {
          const desc = this.search(x.id_tipo_producto, this.tipo_productos);
          this.productos[i].id_tipo_producto = desc;
          this.productos[i].label = x.nombre;
          this.productos[i].value = x.nombre;
          this.productos[i].cant_existente = parseFloat(x.cant_existente);
          this.productos[i].contenido = parseFloat(x.contenido);
          this.productos[i].precio_costo = parseFloat(x.precio_costo);
          this.productos[i].precio_venta = parseFloat(x.precio_venta);
          this.productos[i].utilidad = parseFloat(x.utilidad);
          i++;
        }
        localStorage.setItem('lstProductos', JSON.stringify(this.productos));
        this.sourceP = new LocalDataSource();
        this.sourceP.load(this.productos);
        console.log(this.productos)
        this.settingsP = {
          mode: 'external',
          noDataMessage: 'No existen registros',
          columns: {
            nombre: {
              title: 'Nombre',
              width: '21%',
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
            contenido: {
              title: 'Contenido (ml)',
              width: '7%',
              type: 'custom',
              renderComponent: PipeRenderComponent,
              filter: false
            },
            cant_existente: {
              title: 'Cant. Exis.',
              width: '7%',
              type: 'custom',
              renderComponent: PipeRenderComponent,
              filter: false
            },
            subproductoV: {
              title: 'Subproducto',
              width: '27%',
              type: 'custom',
              renderComponent: SubprodRenderComponent,
              filter: false
            },
            id_tipo_producto: {
              title: 'Tipo Producto',
              width: '10%',
              filter: {
                type: 'list',
                config: {
                  selectText: 'Todos',
                  list: selectShow,
                },
              },
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
      }, err => {
        console.log(err);
        return false;
      });
    }, err => {
      console.log(err);
      return false;
    });

    /*this.productoService.getById('5a16324902d5772a300e6511').subscribe(data => {
      console.log(data[0].path);
    }, err => {
      console.log(err);
    });*/

    this.proveedorService.getAll().subscribe(data => {
      localStorage.setItem('lstProveedor', JSON.stringify(data));
      this.sourceProve = new LocalDataSource();
      this.sourceProve.load(data);
      this.settingsProve = {
        mode: 'external',
        noDataMessage: 'No existen registros',
        columns: {
          ruc: {
            title: 'Ruc',
            width: '14%'
          },
          nombre_proveedor: {
            title: 'Nombre',
            width: '25%'
          },
          direccion: {
            title: 'Dirección',
            width: '25%'
          },
          ciudad: {
            title: 'Ciudad',
            width: '12%'
          },
          telefono: {
            title: 'Teléfono',
            width: '12%'
          },
          compras: {
            title: 'Compras',
            width: '12%',
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
    })

    this.ngOnInitProve();
    this.ngOnInitProducto();
    this.ngOnInitTipoProducto();
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
      document.getElementById('filesTPU').style.backgroundColor = 'lightsalmon';
      document.getElementById('filesTPU').style.color = 'black';
    } else {
      document.getElementById('filesTPU').style.backgroundColor = 'lightgreen';
      document.getElementById('filesTPU').style.color = 'lightgreen';
    }
  }

  onUpdateP(event: any) {
    let lst = JSON.parse(localStorage.getItem('lstProductos'));
    let prodUpdt = lst.filter(function (obj) {
      return obj._id.localeCompare(event.data._id) === 0;
    });
    this.productoUpdate = prodUpdt[0];
    this.myInputVariable1.nativeElement.value = '';
    this.selectedLstContenido = 1;
    if (this.productoUpdate.path === undefined) {
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
      subproductoV: this.subproductoV,
      id_tipo_producto: this.selected_tipo_producto._id,
      path: this.pathLogo,
      contenido: this.contenido,
      promocion: []
    };
    producto.contenido = this.calcContenido();

    if (producto.utilidad === 0) {
      if (!this.validateService.customValidateProductoGasto(producto)) {
        this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
        return false;
      }
      this.productoService.registerProducto(producto).subscribe(data => {
        this.ngOnInitProducto();
        this.ngOnInit();
        this.showDialogPC = false;
        this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      });

    } else {
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
            this.showDialogPC = false;
            this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
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
          this.showDialogPC = false;
          this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
        });
        console.log(producto)
      }
    }
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
      let str = (row.cantidad).match(/[a-z]+|\d+/ig);
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
      let str = (row.cantidad).match(/[a-z]+|\d+/ig);
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
        const index = this.productos.findIndex(x => x.nombre === this.selected_producto);
        this.selected_producto = this.productos[index];
        //const precio_costo = 0;
        const aux = {
          nombre: this.selected_producto.nombre,
          cantidad: this.cantSubprod + ' ' + this.unidadMedidaSuproducto.value.code,
          label: this.selected_producto.nombre,
          value: this.selected_producto,
          precio_costo: this.costoCantSubProd
        };
        // search wheter subProd already exists
        const index1 = this.subproductoV.findIndex(x => x.nombre === aux.nombre);
        if (index1 === -1) {
          this.cantSubprod = 0;
          this.subproductoV.push(aux);
        } else {
          let str = (this.subproductoV[index1].cantidad).match(/[a-z]+|\d+/ig);
          if (str[1].localeCompare(this.unidadMedidaSuproducto.value.code) === 0) {
            let pc = this.subproductoV[index1].precio_costo;
            const npc = this.reCalcCosto(parseInt(str[0]) + this.cantSubprod);
            const aux = {
              nombre: this.selected_producto.nombre,
              cantidad: (parseInt(str[0]) + this.cantSubprod) + ' ' + this.unidadMedidaSuproducto.value.code,
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
          //this.precio_costo += entry.precio_costo;
          this.precio_costo = this.fs.add(this.precio_costo, this.precio_costo)
          let str = (entry.cantidad).match(/[a-z]+|\d+/ig);
          //this.contenido += parseFloat(str[0]);
          this.reCalcContenido(str[0], str[1], entry.value.contenido);
        }
        this.reCalcPrevioVenta();
        this.selected_producto = '';
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
        const index1 = this.subproductoV.findIndex(x => x.nombre === aux.nombre);
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
          let str = (entry.cantidad).match(/[a-z]+|\d+/ig);
          //this.contenido += parseFloat(str[0]);
          this.reCalcContenidoU(str[0], str[1], entry.value.contenido);
        }
        this.reCalcPrevioVenta();
        this.selected_productoU = '';
      } else {
        this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto existente!');
        this.borderStyleProdExistente = '#FE2E2E';
      }
    } else {
      this.messageGrowlService.notify('error', 'Error', 'La cantidad no puede ser 0!');
      document.getElementById('cantSubprod').style.borderColor = '#FE2E2E';
    }
  }

  onChangeFileC(event) {
    const files = event.srcElement.files[0];
    let color = '';
    if (files === undefined) {
      color = 'lightsalmon';
    } else {
      color = 'lightgreen';
    }
    this.pathLogo = files;
    //console.log(this.pathLogo);
    document.getElementById('filesC').style.backgroundColor = color;
  }

  onChangeFileU(event) {
    this.colorUpdate = 'black';
    const files = event.srcElement.files[0];
    let color = '';
    if (files === undefined) {
      color = 'lightsalmon';
    } else {
      color = 'lightgreen';
    }
    this.pathLogoU = files;
    document.getElementById('filesU').style.backgroundColor = color;
    document.getElementById('filesU').style.color = this.colorUpdate;
  }

  onChangeFileTP(event) {
    const files = event.srcElement.files[0];
    let color = '';
    if (files === undefined) {
      color = 'lightsalmon';
    } else {
      color = 'lightgreen';
    }
    this.pathLogoTP = files;
    document.getElementById('filesTP').style.backgroundColor = color;
  }

  onChangeFileTPU(event) {
    this.colorUpdate = 'black';
    const files = event.srcElement.files[0];
    let color = '';
    if (files === undefined) {
      color = 'lightsalmon';
    } else {
      color = 'lightgreen';
    }
    this.pathLogoTPU = files;
    document.getElementById('filesTPU').style.backgroundColor = color;
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

  onChangeNombrePC($event) {
    this.nombre = this.fs.toTitleCase(this.nombre);
  }

  onChangeNombrePU($event) {
    this.productoUpdate.nombre = this.fs.toTitleCase(this.productoUpdate.nombre);
  }

  valueChangeGanancia($event) {
    /*const gain = (this.utilidad / 100) + 1;
    this.precio_venta = this.precio_costo * gain;*/
    const gain = this.fs.add(this.fs.div(this.utilidad, 100), 1);
    this.precio_venta = this.fs.times(this.precio_costo, gain);
    if (this.utilidad == 0) {
      this.flagProductoGasto = true;
      this.messageGrowlService.notify('info', 'Información', 'El producto NO se visualizará en el módulo de VENTAS');
      this.selected_tipo_producto = 'Producto Gasto';
      this.pathLogo = undefined;
      document.getElementById('filesC').style.backgroundColor = 'lightsalmon';
      document.getElementById('filesU').style.color = 'black';
    } else {
      this.flagProductoGasto = false;
      this.selected_tipo_producto = '';
    }
  }

  valueChangePrecioCompra($event) {
    /*const gain = (this.utilidad / 100) + 1;
    this.precio_venta = (this.precio_costo * gain);*/
    const gain = this.fs.add((this.fs.div(this.utilidad, 100)), 1);
    this.precio_venta = this.fs.times(this.precio_costo, gain);
    console.log(this.precio_venta);
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

  reCalcPrevioVenta() {
    const gain = (this.utilidad / 100) + 1;
    this.precio_venta = this.precio_costo * gain;
  }

  reCalcPrevioVentaU() {
    const gain = (this.productoUpdate.utilidad / 100) + 1;
    this.productoUpdate.precio_venta = this.productoUpdate.precio_costo * gain;
  }

  controlarPrecioCosto($event) {
    if (this.flagSubProd) {
      this.precio_costo = 0;
    }
  }

  controlarPrecioCostoU($event) {
    if (this.flagSubProdUpdate) {
      this.productoUpdate.precio_costo = 0;
    }
  }

  onSubmit(value: string) {
    console.log(value);
  }

  valueChangeCantSubprod($event) {
    document.getElementById('cantSubprod').style.borderColor = '#DADAD2';
    const onzaEnMl = 29.5735;
    let prod = this.productos.find(x => x.nombre === this.selected_producto);
    if (prod !== undefined) {
      //litros
      if (this.unidadMedidaSuproducto.value.id == 1) {
        this.costoCantSubProd = ((this.cantSubprod * 1000) * prod.precio_costo) / prod.contenido;
      }
      //mililitros
      if (this.unidadMedidaSuproducto.value.id == 2) {
        this.costoCantSubProd = ((this.cantSubprod * prod.precio_costo) / prod.contenido);
      }
      //onzas
      if (this.unidadMedidaSuproducto.value.id == 3) {
        this.costoCantSubProd = ((this.cantSubprod * onzaEnMl) * prod.precio_costo) / prod.contenido;
      }
      //unidades
      if (this.unidadMedidaSuproducto.value.id == 4) {
        this.costoCantSubProd = parseFloat(prod.precio_costo);
      }
    }
  }

  valueChangeCantSubprodU($event) {
    document.getElementById('cantSubprod').style.borderColor = '#DADAD2';
    const onzaEnMl = 29.5735;
    let prod = this.productos.find(x => x.nombre === this.selected_productoU);
    if (prod !== undefined) {
      //litros
      if (this.unidadMedidaSuproducto.value.id == 1) {
        this.costoCantSubProd = ((this.cantSubProdU * 1000) * prod.precio_costo) / prod.contenido;
      }
      //mililitros
      if (this.unidadMedidaSuproducto.value.id == 2) {
        this.costoCantSubProd = ((this.cantSubprod * prod.precio_costo) / prod.contenido);
      }
      //onzas
      if (this.unidadMedidaSuproducto.value.id == 3) {
        this.costoCantSubProd = ((this.cantSubprod * onzaEnMl) * prod.precio_costo) / prod.contenido;
      }
      //unidades
      if (this.unidadMedidaSuproducto.value.id == 4) {
        this.costoCantSubProd = parseFloat(prod.precio_costo);
      }
    }
  }

  reCalcContenido(cantSubprod, um, contenido) {
    cantSubprod = parseFloat(cantSubprod);
    if (um.localeCompare('Lts') === 0) {
      //this.contenido += (cantSubprod * 1000);
      this.contenido = this.fs.add(this.contenido, this.fs.times(cantSubprod, 1000));
    }
    if (um.localeCompare('ml') === 0) {
      //this.contenido += cantSubprod;
      this.contenido = this.fs.add(this.contenido, cantSubprod);
    }
    if (um.localeCompare('oz') === 0) {
      ///this.contenido += (cantSubprod * 29.5735);
      this.contenido = this.fs.add(this.contenido, this.fs.times(cantSubprod, 29.5735));
    }
    if (um.localeCompare('u') === 0) {
      //this.contenido += contenido;
      this.contenido = this.fs.add(contenido, contenido);
    }
  }

  reCalcContenidoU(cantSubprod, um, contenido) {
    cantSubprod = parseFloat(cantSubprod);
    if (um.localeCompare('Lts') === 0) {
      this.productoUpdate.contenido += (cantSubprod * 1000);
    }
    if (um.localeCompare('ml') === 0) {
      this.productoUpdate.contenido += cantSubprod;
    }
    if (um.localeCompare('oz') === 0) {
      this.productoUpdate.contenido += (cantSubprod * 29.5735);
    }
    if (um.localeCompare('u') === 0) {
      this.productoUpdate.contenido += contenido;
    }
  }

  reCalcContenidoDelete(cantSubprod, um, contenido) {
    cantSubprod = parseFloat(cantSubprod);
    if (um.localeCompare('Lts') === 0) {
      this.contenido -= (cantSubprod * 1000);
    }
    if (um.localeCompare('ml') === 0) {
      this.contenido -= cantSubprod;
    }
    if (um.localeCompare('oz') === 0) {
      this.contenido -= (cantSubprod * 29.5735);
    }
    if (um.localeCompare('u') === 0) {
      this.contenido -= contenido;
    }
  }

  reCalcContenidoDeleteU(cantSubprod, um, contenido) {
    cantSubprod = parseFloat(cantSubprod);
    if (um.localeCompare('Lts') === 0) {
      this.productoUpdate.contenido -= (cantSubprod * 1000);
    }
    if (um.localeCompare('ml') === 0) {
      this.productoUpdate.contenido -= cantSubprod;
    }
    if (um.localeCompare('oz') === 0) {
      this.productoUpdate.contenido -= (cantSubprod * 29.5735);
    }
    if (um.localeCompare('u') === 0) {
      this.productoUpdate.contenido -= contenido;
    }
  }

  reCalcCosto(cantSubprod) {
    const onzaEnMl = 29.5735;
    let prod = this.productos.find(x => x.nombre === this.selected_producto.nombre);
    let costoCantSubProd = 0;
    if (prod !== undefined) {
      //litros
      if (this.unidadMedidaSuproducto.value.id == 1) {
        costoCantSubProd = ((cantSubprod * 1000) * prod.precio_costo) / prod.contenido;
      }
      //mililitros
      if (this.unidadMedidaSuproducto.value.id == 2) {
        costoCantSubProd = ((cantSubprod * prod.precio_costo) / prod.contenido);
      }
      //onzas
      if (this.unidadMedidaSuproducto.value.id == 3) {
        costoCantSubProd = ((cantSubprod * onzaEnMl) * prod.precio_costo) / prod.contenido;
      }
      //unidades
      if (this.unidadMedidaSuproducto.value.id == 4) {
        costoCantSubProd = parseFloat(prod.precio_costo);
      }
    }
    return costoCantSubProd;
  }

  reCalcCostoU(cantSubProdU) {
    const onzaEnMl = 29.5735;
    let prod = this.productos.find(x => x.nombre === this.selected_productoU.nombre);
    let costoCantSubProd = 0;
    if (prod !== undefined) {
      //litros
      if (this.unidadMedidaSuproducto.value.id == 1) {
        costoCantSubProd = ((cantSubProdU * 1000) * prod.precio_costo) / prod.contenido;
      }
      //mililitros
      if (this.unidadMedidaSuproducto.value.id == 2) {
        costoCantSubProd = ((cantSubProdU * prod.precio_costo) / prod.contenido);
      }
      //onzas
      if (this.unidadMedidaSuproducto.value.id == 3) {
        costoCantSubProd = ((cantSubProdU * onzaEnMl) * prod.precio_costo) / prod.contenido;
      }
      //unidades
      if (this.unidadMedidaSuproducto.value.id == 4) {
        costoCantSubProd = parseFloat(prod.precio_costo);
      }
    }
    return costoCantSubProd;
  }

  onChangeProdExistentes($event) {
    //this.valueChangeCantSubprod($event);
    this.borderStyleProdExistente = '#DADAD2';
  }

  onChangeProdExistentesU($event) {
    this.borderStyleProdExistente = '#DADAD2';
  }

  onChangeProdSelec($event) {
    this.borderStyleProdSelec = '#DADAD2';
  }

  onChangeProdSelecU($event) {
    this.borderStyleProdSelec = '#DADAD2';
  }

  calcContenido() {
    let nContMl = 0;
    if (this.contenido > 0) {
      const onzaEnMl = 29.5735;
      if (this.selectedLstContenido === 0) {
        nContMl = (this.contenido * 1000);
      }
      if (this.selectedLstContenido === 1) {
        nContMl = this.contenido;
      }
      if (this.selectedLstContenido === 2) {
        nContMl = (this.contenido * onzaEnMl);
      }
    }
    return nContMl;
  }

  calcContenidoU() {
    let nContMl = 0;
    if (this.productoUpdate.contenido > 0) {
      const onzaEnMl = 29.5735;
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

  /* GESTION DE KARDEX */
  public getDate(): number {
    return this.dt && this.dt.getTime() || new Date().getTime();
  }

  ngOnInitKardex() {
    this.kardex = {
      'fecha': '',
      'desc_producto': '',
      'proveedor': '',
      'cantidad': 0,
      'total': 0,
      'num_factura': '',
      'contenido': 0
    };
    this.kardex.fecha = this.todayDate;
    this.validRuc = false;
    this.showDialogK = false;
    this.showDialogKU = false;
  }

  saveKardex() {
    if (this.flagProdK === true) {
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
    if (this.flagProdK === true) {
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

  calcPrecioVentaKardex(precio_costo, utilidad) {
    precio_costo = (precio_costo * 100) / 100;
    const gain = (utilidad / 100) + 1;
    return (precio_costo * gain);
  }

  showProveK() {
    this.showDialogProve = true;
    this.setCursorAddProve();
  }

  onClickSelectButton(event) {
    if (this.selectedIeProd.localeCompare('Existente') == 0) {
      this.flagProdK = false;
      this.kardex.desc_producto = this.lstProductos[0];
      let a: any;
      a = this.kardex.desc_producto
      this.newProd = a;
      this.kardex.contenido = this.newProd.contenido;
    } else {
      this.flagProdK = true;
      this.kardex.desc_producto = '';
      this.setCursorAddK();
    }
  }

  onClickSelectButtonU(event) {
    if (this.selectedIeProd.localeCompare('Existente') == 0) {
      this.flagProdK = false;
      this.kardexU.desc_producto = this.lstProductos[0];
      let a: any;
      a = this.kardexU.desc_producto
      this.newProd = a;
      this.kardexU.contenido = this.newProd.contenido;
    } else {
      this.flagProdK = true;
      this.kardexU.desc_producto = '';
      setTimeout(function () {
        document.getElementById('desc_productoKU').focus();
        setOriginalColorsKardex();
      }, 0);
    }
  }

  setCursorAddK() {
    this.kardex.desc_producto = '';
    this.selectedIeProd = 'Nuevo';
    this.flagProdK = true;
    setTimeout(function () {
      document.getElementById('desc_productoK').focus();
      setOriginalColorsKardex();
    }, 0);
  }

  setCursorUpdateK(event: any) {
    let lst = JSON.parse(localStorage.getItem('lstKardex'));
    let prodUpdt = lst.filter(function (obj) {
      return obj._id.localeCompare(event.data._id) === 0;
    });
    this.kardexU = prodUpdt[0];
    this.selectedIeProd = 'Existente';
    this.flagProdK = false;
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
    }
  }

  onChangelstTP($event) {
    this.lstProductos = [];
    for (let entry of this.productos) {
      if (entry.id_tipo_producto.localeCompare(this.selectedTP.desc_tipo_producto) === 0) {
        this.lstProductos.push(entry);
      }
    }
    this.kardex.desc_producto = this.lstProductos[0];
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
    this.kardexU.desc_producto = this.lstProductos[0];
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

  updateKardex() {
    if (this.flagProdK === true) {
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
    if (this.flagProdK === true) {

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
  }

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

  /* GESTION DE PROVEEDORES*/
  onChangeNombreProve($event) {
    this.objProve.nombre_proveedor = this.fs.toTitleCase(this.objProve.nombre_proveedor);
  }

  onChangeEmail($event) {
    this.objProve.correo = this.objProve.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.objProve.correo)) {
      document.getElementById("correo").style.borderColor = "#5ff442";
    }
    else {
      document.getElementById("correo").style.borderColor = "#FE2E2E";
    }
  }

  onChangeEmailU($event) {
    this.objProve.correo = this.objProve.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.objProve.correo)) {
      document.getElementById("correoU").style.borderColor = "#5ff442";
    }
    else {
      document.getElementById("correoU").style.borderColor = "#FE2E2E";
    }
  }

  onChangeRuc() {
    if (this.objProve.ruc.length != 13) {
      document.getElementById("rucProve").style.borderColor = "#FE2E2E";
      this.validRuc = false;
    } else {
      if (!this.validateService.validarRucCedula(this.objProve.ruc)) {
        this.messageGrowlService.notify('error', 'Error', 'Cedula Inválida!');
        document.getElementById("rucProve").style.borderColor = "#FE2E2E";
        this.validRuc = false;
      } else {
        document.getElementById("rucProve").style.borderColor = "#5ff442";
        this.validRuc = true;
      }
    }
  }

  onChangeRucU() {
    if (this.objProve.ruc.length != 13) {
      document.getElementById("rucProveU").style.borderColor = "#FE2E2E";
      this.validRuc = false;
    } else {
      if (!this.validateService.validarRucCedula(this.objProve.ruc)) {
        this.messageGrowlService.notify('error', 'Error', 'Cedula Inválida!');
        document.getElementById("rucProveU").style.borderColor = "#FE2E2E";
        this.validRuc = false;
      } else {
        document.getElementById("rucProveU").style.borderColor = "#5ff442";
        this.validRuc = true;
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
    }, 0);
    this.objProve = {
      nombre_proveedor: '',
      ruc: '',
      direccion: '',
      ciudad: '',
      telefono: '',
      correo: ''
    };
  }

  saveProveedor() {
    if (!this.validateService.validateProveedor(this.objProve)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    this.proveedorService.register(this.objProve).subscribe(data => {
      this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
      /*this.sourceProve.add(data);
      this.sourceProve.refresh();*/
      this.lstProveedoresK.push(data);
      this.kardex.proveedor = data;
      this.ngOnInitProve();
      this.ngOnInit();
      setOriginalColorsProve();
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
  }

  showProveedor(event: any) {
    this.showProveDialog = event.data.nombre_proveedor;
    this.showComprasDetail = true;
  }

  ngOnInitProve() {
    this.objProve = {
      nombre_proveedor: '',
      ruc: '',
      direccion: '',
      ciudad: '',
      telefono: '',
      correo: ''
    };
    this.validRuc = false;
    this.showDialogProve = false;
    this.showDialogProveU = false;
  }

  setCursorUpdateProve(event: any) {
    setTimeout(function () {
      document.getElementById('nombreProveU').focus();
      setOriginalColorsProve();
    }, 0);
    this.validRuc = true;
    let lst = JSON.parse(localStorage.getItem('lstProveedor'));
    let prodUpdt = lst.filter(function (obj) {
      return obj._id.localeCompare(event.data._id) === 0;
    });
    this.objProve = prodUpdt[0];
    //this.objProve = event.data;
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
          // remove from database
          this.proveedorService.delete(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');
          });
        }
      }
    });
  }

  updateProveedor() {
    if (!this.validateService.validateProveedor(this.objProve)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    this.proveedorService.update(this.objProve).subscribe(data => {
      this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
      this.sourceProve.update(this.objProve, this.objProve);
      this.sourceProve.refresh();
      this.ngOnInitProve();
      setOriginalColorsProve();
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
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
  document.getElementById("nombrePC").style.borderColor = "#DADAD2";
  document.getElementById("pcPC").style.borderColor = "#DADAD2";
  document.getElementById("pvPC").style.borderColor = "#DADAD2";
  document.getElementById("tipoPC").style.borderColor = "#DADAD2";
  document.getElementById("contPC").style.borderColor = "#DADAD2";
}

function setOriginalColorsPU() {
  document.getElementById('nombrePU').style.borderColor = '#DADAD2';
  document.getElementById("pcPU").style.borderColor = "#DADAD2";
  document.getElementById("pvPU").style.borderColor = "#DADAD2";;
  document.getElementById('tipoPU').style.borderColor = '#DADAD2';
  document.getElementById('contPU').style.borderColor = '#DADAD2';
}

function setOriginalColorsTPC() {
  document.getElementById('descTPC').style.borderColor = '#DADAD2';
  document.getElementById('filesTP').style.borderColor = '#DADAD2';
}

function setOriginalColorsTPU() {
  document.getElementById('descTPU').style.borderColor = '#DADAD2';
  document.getElementById('filesTPU').style.borderColor = '#DADAD2';
}

function setOriginalColorsPromo() {
  document.getElementById("nombrePromo").style.borderColor = "#DADAD2";
}

function setOriginalColorsPromoU() {
  document.getElementById("nombrePromoU").style.borderColor = "#DADAD2";
  document.getElementById("desdePromoU").style.borderColor = "#DADAD2";
  document.getElementById("hastaPromoU").style.borderColor = "#DADAD2";
}

function setOriginalColorsProve() {
  document.getElementById("rucProve").style.borderColor = "";
  document.getElementById("correo").style.borderColor = "";
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