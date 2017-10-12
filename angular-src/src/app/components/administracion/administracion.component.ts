import { Component, OnInit, Directive,ViewChild } from '@angular/core';
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
import { PipeRenderComponent } from '../pipe-render/pipe-render.component';
import { SubprodRenderComponent } from '../subprod-render/subprod-render.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MessageGrowlService } from '../../services/message-growl.service';
import { FormatterService } from '../../services/formatter.service';
import { SelectItem } from 'primeng/primeng';
import { PromocionService } from '../../services/promocion.service';

const URL = 'http://localhost:3000/api/imagen';
@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})

export class AdministracionComponent implements OnInit {

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
  selectedLstContenido: String = 'Mililitros';
  @ViewChild('myInput')
  myInputVariable: any;
  @ViewChild('myInput1')
  myInputVariable1: any;
  settingsPro = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      _id: {
        title: 'ID',
        width: '15%',
        filter: false
      },
      nombre: {
        title: 'Nombre Promocion',
        width: '27.5%'
      },
      producto: {
        title: 'Producto asociado',
        width: '27.5%'
      },
      desde: {
        title: 'Desde',
        width: '10%'
      },
      hasta: {
        title: 'Hasta',
        width: '10%'
      },
      precio_promo: {
        title: 'Precio Promo',
        width: '10%'
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
  showDialogPro = false;
  sourcePro: LocalDataSource = new LocalDataSource();
  objPromo: any;
  objPromoUpdate: any;
  promociones: any = [];
  showDialogProU = false;
  costoCantSubProd;
  precio_costoSubProd;
  selected_prodSelec;
  selected_prodSelecU;

  constructor(
    private validateService: ValidateService,
    private tipoProductoService: TipoProductoService,
    private productoService: ProductoService,
    private authService: AuthService,
    private http: Http, public dialog: MdDialog,
    private messageGrowlService: MessageGrowlService,
    private formatterService: FormatterService,
    private formBuilder: FormBuilder,
    private promocionService: PromocionService) {
    this.id_mostar = 0;
    this.pathLogo = undefined;
    this.lstUnidades = [];
    this.lstUnidades.push({ label: 'Litros', value: { id: 1, name: 'Litros', code: 'Lts' } });
    this.lstUnidades.push({ label: 'Mililitros', value: { id: 2, name: 'Mililitros', code: 'ml' } });
    this.lstUnidades.push({ label: 'Onzas', value: { id: 3, name: 'Onzas', code: 'oz' } });
    this.lstUnidades.push({ label: 'Unidades', value: { id: 4, name: 'Onzas', code: 'u' } });
    this.unidadMedidaSuproducto = this.lstUnidades[0];
    this.lstContenido = [];
    this.lstContenido.push({ label: 'Litros', value: 'Litros' });
    this.lstContenido.push({ label: 'Mililitros', value: 'Mililitros' });
    this.lstContenido.push({ label: 'Onzas', value: 'Onzas' });
    this.objPromo = {
      nombre: '',
      producto: [],
      desde: 0,
      hasta: 0,
      precio_promo: 0
    }
    this.objPromoUpdate = {
      nombre: '',
      producto: [],
      desde: 0,
      hasta: 0,
      precio_promo: 0
    }
    //console.log((0.3 - 0.1).toFixed(2));
  }

  ngOnInit() {

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
        this.sourceP = new LocalDataSource();
        this.sourceP.load(this.productos);
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
      }, err => {
        console.log(err);
        return false;
      });
    },
      err => {
        console.log(err);
        return false;
      });
    this.promocionService.getAll().subscribe(data => {
      this.sourcePro.load(data);
    }, err => {
      console.log(err);
    })
    this.ngOnInitProducto();
    this.ngOnInitTipoProducto();
  }

  /* GESTION DE PRODUCTO */
  setCursorAddTP() {
    setTimeout(function () {
      document.getElementById('descTPC').focus();
      document.getElementById('filesTP').style.backgroundColor = 'lightsalmon';
    }, 50);
  }

  setCursorUpdateTP() {
    setTimeout(function () {
      document.getElementById('descTPU').focus();
    }, 500);
  }

  setCursorAddP() {
    setTimeout(function () {
      document.getElementById('nombrePC').focus();
      // document.getElementById("iconPercent").style.backgroundColor = "#2196F3";
      document.getElementById('filesC').style.backgroundColor = 'lightsalmon';
      // setOriginalColorsPC();
      setOriginalColorsPC();

    }, 0);
  }

  setCursorUpdateP() {
    setTimeout(function () {
      document.getElementById('nombrePU').focus();
      // document.getElementById("iconPercent").style.backgroundColor = "#2196F3";
      // setOriginalColorsPU();
    }, 0);
  }

  setCursorAddPro() {
    setTimeout(function () {
      document.getElementById('nombrePromo').focus();
    }, 0);
  }

  setCursorUpdatePro() {
    setTimeout(function () {
      document.getElementById('nombrePromoU').focus();
    }, 0);
  }

  onCreateTP(event: any) {
    this.myInputVariable.nativeElement.value = '';
    this.desc_tipo_producto = '';
    this.pathLogoTP = '';
    setOriginalColorsTPC();
    this.ngOnInitTipoProducto();
  }

  onCreateP(event: any) {
    this.myInputVariable.nativeElement.value = '';
    this.nombre = '';
    this.ngOnInitProducto();
  }

  onUpdateTP(event: any) {
    this.id_mostar = event.data._id;
    this.desc_tipo_producto = event.data.desc_tipo_producto;
    this.pathLogoTPU = event.data.path;
    setOriginalColorsTPU();
    if (this.pathLogoTPU === undefined) {
      this.colorUpdate = 'black';
      setTimeout(function () {
        document.getElementById('filesTPU').style.backgroundColor = 'lightsalmon';
      }, 50);
    } else {
      this.colorUpdate = 'lightgreen';
      setTimeout(function () {
        document.getElementById('filesTPU').style.backgroundColor = 'lightgreen';
      }, 50);
    }
  }

  onUpdateP(event: any) {
    this.myInputVariable1.nativeElement.value = '';
    this.productoUpdate = event.data;
    //console.log(this.productoUpdate)
    if (this.productoUpdate.path === undefined) {
      this.colorUpdate = 'black';
      setTimeout(function () {
        document.getElementById('filesU').style.backgroundColor = 'lightsalmon';
      }, 50);
    } else {
      this.colorUpdate = 'lightgreen';
      setTimeout(function () {
        document.getElementById('filesU').style.backgroundColor = 'lightgreen';
      }, 50);
    }
    if (this.productoUpdate.subproductoV.length !== 0) {
      this.flagSubProdUpdate = true;
    } else {
      this.flagSubProdUpdate = false;
    }
    // bug 2 click edit
    /*if (typeof (event.data.subproductoV) === 'object') {
      let fila = '';
      for (const entry of event.data.subproductoV) {
        fila += '-' + entry.nombre + ' ' + entry.cantidad + ' ';
      }
      event.data.subproductoV = fila;
    }
    if (this.productoUpdate.subproductoV.length === 0) {
      this.flagSubProdUpdate = false;
    } else {
      this.flagSubProdUpdate = true;
      if (this.productoUpdate.subproductoV.length > 0) {
        const a = this.productoUpdate.subproductoV.toString().replace(/ +(?= )/g, '');
        this.productoUpdate.subproductoV = [];
        this.productoUpdate.subproductoV.push(a);
        if (this.auxSubprod === undefined) {
          this.auxSubprod = this.productoUpdate.subproductoV;
        }
        const array = this.productoUpdate.subproductoV.toString().split('-');
        this.productoUpdate.subproductoV = [];
        let index = 0;
        for (const entry of array) {
          if (entry.length > 0) {
            const vec = entry.split(' ');
            const n = vec.length;
            let nombre = vec[0];
            const cant = vec[n - 3];
            for (let i = 1; i < n - 3; i++) {
              if (vec[i + 1] !== '') {
                nombre += ' ' + vec[i];
              }
            }
            // set subproducto to ul format
            const aux = {
              nombre: nombre,
              cantidad: cant + ' ' + vec[n - 2],
              label: nombre,
              value: '',
              precio_costo: this.costoCantSubProd
            };
            this.productoUpdate.subproductoV.push(aux);
            index++;
          }
        }
      }
    }*/
  }

  onUpdatePro(event: any) {
    setOriginalColorsPromoU()
    this.objPromoUpdate = event.data;
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
      this.tipoProductoService.registerTipoProducto(tipoProducto).subscribe(data => {
        this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
        //this.sourceTP.add(data);
        //this.sourceTP.refresh();
        this.showDialogTPC = false;
        this.ngOnInit();
        this.ngOnInitTipoProducto();
        this.myInputVariable.nativeElement.value = '';
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
    if (!this.validateService.customValidateProducto(producto)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    this.productoService.uploadImage(this.pathLogo).subscribe(tp => {
      producto.path = tp;
      this.productoService.registerProducto(producto).subscribe(data => {
        data.id_tipo_producto = this.selected_tipo_producto.desc_tipo_producto;
        this.sourceP.add(data);
        this.sourceP.refresh();
        this.ngOnInitProducto();
        this.myInputVariable.nativeElement.value = '';
        this.showDialogPC = false;
        this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      });
    }, err => {
      console.log(err);
    });
  }

  onAddPromoSubmit() {
    if (!this.validateService.validatePromocion(this.objPromo)) {
      return false;
    }
    this.promocionService.register(this.objPromo).subscribe(data => {
      this.messageGrowlService.notify('success', 'Exito', 'Ingreso Exitoso!');
      this.sourcePro.add(data);
      this.sourcePro.refresh();
      this.showDialogPro = false;
      setOriginalColorsPromo();
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    })
  }

  onUpdateTPSubmit() {
    const tipoProducto = {
      id: this.id_mostar,
      desc_tipo_producto: this.desc_tipo_producto
    };
    if (!this.validateService.validateTipoProducto(tipoProducto)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    this.tipoProductoService.updateTipoProducto(tipoProducto).subscribe(data => {
      this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
    }, err => {
      // Log errors if any
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
    this.sourceP.refresh();
    this.ngOnInit();
    this.showDialogTPU = false;
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
    console.log(producto);
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
      this.myInputVariable.nativeElement.value = '';
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
        this.myInputVariable.nativeElement.value = '';
        this.showDialogPU = false;
      }, err => {
        console.log(err);
      });
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

  onDeletePro(event): void {
    this.openDialogPromo(event.data);
  }

  openDialogPromo(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          this.sourceP.remove(data);
          // remove from database
          this.promocionService.delete(data._id).subscribe(data => {
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
          this.precio_costo += entry.precio_costo;
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
    this.desc_tipo_producto = this.formatterService.toTitleCase(this.desc_tipo_producto);
  }

  onChangeNombrePC($event) {
    this.nombre = this.formatterService.toTitleCase(this.nombre);
  }

  onChangeNombrePU($event) {
    this.productoUpdate.nombre = this.formatterService.toTitleCase(this.productoUpdate.nombre);
  }

  onChangeNombrePromo($event) {
    this.objPromo.nombre = this.formatterService.toTitleCase(this.objPromo.nombre);
  }

  valueChangeGanancia($event) {
    const gain = (this.utilidad / 100) + 1;
    this.precio_venta = this.precio_costo * gain;
  }

  valueChangePrecioCompra($event) {
    this.precio_costo = (this.precio_costo * 100) / 100;
    const gain = (this.utilidad / 100) + 1;
    this.precio_venta = (this.precio_costo * gain);
  }

  valueChangePrecioVenta($event) {
    const gain = 1 - (this.utilidad / 100);
    this.precio_costo = this.precio_venta * gain;
  }

  valueChangeGananciaU($event) {
    const gain = (this.productoUpdate.utilidad / 100) + 1;
    this.productoUpdate.precio_venta = this.productoUpdate.precio_costo * gain;
  }

  valueChangePrecioCompraU($event) {
    this.productoUpdate.precio_costo = (this.productoUpdate.precio_costo * 100) / 100;
    const gain = (this.utilidad / 100) + 1;
    this.productoUpdate.precio_venta = (this.productoUpdate.precio_costo * gain);
  }

  valueChangePrecioVentaU($event) {
    const gain = 1 - (this.productoUpdate.utilidad / 100);
    this.productoUpdate.precio_costo = this.productoUpdate.precio_venta * gain;
  }

  /*valueChangeContenidoU($event) {
    const onzaEnMl = 29.5735;
    if (this.selectedLstContenido.localeCompare('Litros') == 0) {
      this.contenidoMiliU = parseFloat((this.productoUpdate.contenidoU * 1000).toFixed(2));
    }
    if (this.selectedLstContenido.localeCompare('Onzas') == 0) {
      this.contenidoMiliU = parseFloat((this.productoUpdate.contenidoU * 29.5735).toFixed(2));
    }
    if (this.selectedLstContenido.localeCompare('Mililitros') == 0) {
      this.contenidoMiliU = parseFloat((this.productoUpdate.contenido).toFixed(2));
    }
  }*/

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
      this.contenido += (cantSubprod * 1000);
    }
    if (um.localeCompare('ml') === 0) {
      this.contenido += cantSubprod;
    }
    if (um.localeCompare('oz') === 0) {
      this.contenido += (cantSubprod * 29.5735);
    }
    if (um.localeCompare('u') === 0) {
      this.contenido += contenido;
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

  ngOnInitTipoProducto() {
    // Atributos SubProducto
    this.desc_tipo_producto = '';
    this.pathLogoTP = undefined;
    this.id_mostar = '';
    this.pathLogoTP = undefined;
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
  }

  /* GESTION DE PROMOCIONES */
  /* GESTION DE CONFIGURACIONES */
}

function setOriginalColorsPC() {
  // border Color #dadad2
  // readonly Color #f8f5f0
  // error Color FE2E2E
  document.getElementById("nombrePC").style.borderColor = "#DADAD2";
  document.getElementById("pcPC").style.borderColor = "#DADAD2";
  document.getElementById("pvPC").style.borderColor = "#DADAD2";
  document.getElementById("utilidadPC").style.borderColor = "#DADAD2";
  document.getElementById("cantPC").style.borderColor = "#DADAD2";
  document.getElementById("tipoPC").style.borderColor = "#DADAD2";
  document.getElementById("contPC").style.borderColor = "#DADAD2";
  //this.borderStyle = '#DADAD2';
}

function setOriginalColorsPU() {
  document.getElementById('nombrePU').style.borderColor = '#DADAD2';
  // document.getElementById("puPU").style.borderColor = "#DADAD2";
  // document.getElementById("utilidadPU").style.borderColor = "#DADAD2";
  document.getElementById('cantPU').style.borderColor = '#DADAD2';
  document.getElementById('tipoPU').style.borderColor = '#DADAD2';
  document.getElementById('tipoP').style.borderColor = '#DADAD2';
  document.getElementById('filesU').style.borderColor = '#DADAD2';
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
  document.getElementById("desdePromo").style.borderColor = "#DADAD2";
  document.getElementById("hastaPromo").style.borderColor = "#DADAD2";
}

function setOriginalColorsPromoU() {
  document.getElementById("nombrePromoU").style.borderColor = "#DADAD2";
  document.getElementById("desdePromoU").style.borderColor = "#DADAD2";
  document.getElementById("hastaPromoU").style.borderColor = "#DADAD2";
}