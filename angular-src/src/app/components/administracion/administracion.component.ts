import { Component, OnInit, Directive } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ValidateService } from '../../services/validate.service';
import { TipoProductoService } from '../../services/tipo-producto.service';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ProductoService } from '../../services/producto.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ViewChild } from '@angular/core';
import { ImageRenderComponent } from '../image-render/image-render.component';
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

  colorUpdate = '';
  auxSubprod;
  sourceTP: LocalDataSource = new LocalDataSource();
  sourceP: LocalDataSource = new LocalDataSource();
  showDialogTPC = false;
  showDialogTPU = false;
  showDialogPC = false;
  showDialogPU = false;
  flagUpdateTP: boolean;
  flagCreateTP: boolean;
  flagUpdateP: boolean;
  flagCreateP: boolean;
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
  flagListaSubProd;
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
  selectedLstContenido: String[] = ['Litros'];
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
    this.flagCreateTP = false;
    this.flagUpdateTP = false;
    this.flagCreateP = false;
    this.flagUpdateP = false;
    this.id_mostar = 0;
    this.pathLogo = undefined;
    this.lstUnidades = [];
    this.lstUnidades.push({ label: 'Unidades', value: { id: 1, name: 'Unidades', code: 'u' } });
    this.lstUnidades.push({ label: 'Mililitros', value: { id: 2, name: 'Mililitros', code: 'ml' } });
    this.lstUnidades.push({ label: 'Onzas', value: { id: 3, name: 'Onzas', code: 'oz' } });
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
          this.productos[i].precio_costo = this.productos[i].precio_costo.toFixed(2);
          this.productos[i].precio_venta = this.productos[i].precio_venta.toFixed(2);
          this.productos[i].utilidad = this.productos[i].utilidad.toFixed(2);
          if (x.subproductoV !== '') {
            let fila = '';
            for (const entry of x.subproductoV) {
              fila += '-' + entry.nombre + ' ' + entry.cantidad + ' ';
              this.productos[i].subproductoV = fila;
            }
          }
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
              width: '7%'
            },
            utilidad: {
              title: 'Utilidad (%)',
              width: '7%'
            },
            precio_venta: {
              title: 'Precio Venta',
              width: '7%'
            },
            contenido: {
              title: 'Contenido',
              width: '7%'
            },
            cant_existente: {
              title: 'Cant. Exis.',
              width: '7%'
            },
            subproductoV: {
              title: 'Subproducto',
              width: '27%'
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
    this.desc_tipo_producto = '';
    this.pathLogoTP = '';
    this.id_mostar = '';
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
    this.subproductoV = [];
    this.selected_tipo_producto = '';
    this.selected_producto = '';
    this.selected_productoU = '';
    this.flagSubProd = false;
    this.flagSubProdUpdate = false;

    this.cantSubprod = 1;
    this.cantSubProdU = 1;
    this.flagListaSubProd = false;
    this.flagListaSubProdUpdate = false;

    this.promocionService.getAll().subscribe(data => {
      this.sourcePro.load(data);
    }, err => {
      console.log(err);
    })

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
    this.flagCreateTP = true;
    this.desc_tipo_producto = '';
    this.pathLogoTP = '';
    setOriginalColorsTPC();
  }

  onCreateP(event: any) {
    // console.log("before: "+this.myInputVariable.nativeElement.value)
    this.myInputVariable.nativeElement.value = '';
    this.flagCreateP = true;
    this.nombre = '';
  }

  onUpdateTP(event: any) {
    this.flagUpdateTP = true;
    this.id_mostar = event.data._id;
    this.desc_tipo_producto = event.data.desc_tipo_producto;
    console.log(event.data);
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
    this.flagUpdateP = true;
    this.productoUpdate = event.data;
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
    // bug 2 click edit
    if (typeof (event.data.subproductoV) === 'object') {
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
      this.flagListaSubProd = true;
      if (this.productoUpdate.subproductoV.length > 0) {

        const a = this.productoUpdate.subproductoV.toString().replace(/ +(?= )/g, '');
        this.productoUpdate.subproductoV = [];
        this.productoUpdate.subproductoV.push(a);
        // console.log(this.productoUpdate.subproductoV);
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
            const cant = vec[n - 2];
            for (let i = 1; i < n; i++) {
              if (vec[i + 1] !== '') {
                nombre += ' ' + vec[i];
              }
            }
            // set subproducto to ul format
            const aux = { nombre: nombre, cantidad: cant };
            this.productoUpdate.subproductoV.push(aux);
            index++;
          }
        }
      }
    }
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
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');

      });
      this.ngOnInit();
      this.myInputVariable.nativeElement.value = '';
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
      //contenido: this.contenido + this.selectedLstContenido,
      contenido: this.contenido,
      promocion: []
    };
    console.log(producto);
    /*if (!this.validateService.customValidateProducto(producto)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    this.productoService.uploadImage(this.pathLogo).subscribe(tp => {
      producto.path = tp;
      this.productoService.registerProducto(producto).subscribe(data => {
        this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');

      });
      this.ngOnInit();
      this.myInputVariable.nativeElement.value = '';
    }, err => {
      console.log(err);
    });*/
  }

  onAddPromoSubmit() {
    if (!this.validateService.validatePromocion(this.objPromo)) {
      return false;
    }
    this.promocionService.register(this.objPromo).subscribe(data => {
      this.messageGrowlService.notify('success', 'Exito', 'Ingreso Exitoso!');
      this.sourcePro.add(data)
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    })
    this.showDialogPro = false;
    setOriginalColorsPromo();
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
      precio_costo: this.productoUpdate.precio_costo,
      precio_venta: this.productoUpdate.precio_venta,
      utilidad: this.productoUpdate.utilidad,
      cant_existente: this.productoUpdate.cant_existente,
      path: "",
      subproductoV: nSp,
      id_tipo_producto: idTpBus,
      promocion: []
    };
    if (!this.validateService.customValidateProductoU(producto)) {
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      return false;
    }
    console.log(producto)
    /*this.productoService.updateProducto(producto).subscribe(data => {
      this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
    this.ngOnInit();
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
    };*/

    /*this.productoService.uploadImage(this.pathLogo).subscribe(tp => {
      producto.path = tp;
      this.productoService.registerProducto(producto).subscribe(data => {
        this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');

      });
      this.ngOnInit();
      this.myInputVariable.nativeElement.value = '';
    }, err => {
      console.log(err);
    });*/
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

  fuPorcentaje() {
    // document.getElementById("iconUsd").style.backgroundColor = "#ffffff";
    // document.getElementById("iconPercent").style.backgroundColor = "#2196F3";
    this.medidaUtilidad = '%';
  }

  fuMoneda() {
    // document.getElementById('iconPercent').style.backgroundColor = "#ffffff";
    // document.getElementById("iconUsd").style.backgroundColor = "#2196F3";
    this.medidaUtilidad = '$';
  }

  deleteItem(index) {
    if (index > -1) {
      this.subproductoV.splice(index, 1);
    }
  }

  deleteItemU(index) {
    if (index > -1) {
      this.productoUpdate.subproductoV.splice(index, 1);
    }
  }

  addItem() {
    if (this.selected_producto !== '') {
      const index = this.productos.findIndex(x => x.nombre === this.selected_producto);
      this.selected_producto = this.productos[index];
      this.flagListaSubProd = true;
      const precio_costo = 0;
      const aux = {
        nombre: this.selected_producto.nombre,
        antidad: this.cantSubprod + this.unidadMedidaSuproducto.value.code,
        label: this.selected_producto.nombre,
        value: this.selected_producto, precio_costo: ''
      };
      // search wheter subProd already exists
      const index1 = this.subproductoV.findIndex(x => x.nombre === aux.nombre);
      if (index1 === -1) {
        this.subproductoV.push(aux);
      } else {
        let str = this.subproductoV[index1].cantidad;
        str = str.replace(/[^0-9]+/ig, '');
        const aux = {
          nombre: this.selected_producto.nombre,
          cantidad: (parseInt(str) + this.cantSubprod) + this.unidadMedidaSuproducto.value.code,
          label: this.selected_producto.nombre,
          value: this.selected_producto
        };
        this.subproductoV[index1] = aux;
      }

      this.selected_producto = '';
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto existente!');
      document.getElementById('prodExistente').style.borderColor = '#FE2E2E';
    }
  }

  addItemU() {
    if (this.selected_productoU !== '') {

      const index = this.productos.findIndex(x => x.nombre === this.selected_productoU);
      this.selected_productoU = this.productos[index];
      this.flagListaSubProdUpdate = true;
      let aux = {
        nombre: this.selected_productoU.nombre,
        cantidad: this.cantSubProdU + this.unidadMedidaSuproducto.value.code,
        label: this.selected_productoU.nombre, value: this.selected_productoU
      };
      if (this.productoUpdate.subproductoV.length === 0) {
        this.productoUpdate.subproductoV = [];
      }
      // search wheter subProd already exists
      const index1 = this.productoUpdate.subproductoV.findIndex(x => x.nombre === aux.nombre);
      if (index1 === -1) {
        this.productoUpdate.subproductoV.push(aux);
      } else {
        let str = this.productoUpdate.subproductoV[index1].cantidad;
        str = str.replace(/[^0-9]+/ig, '');
        const aux = {
          nombre: this.selected_producto.nombre,
          cantidad: (parseInt(str) + this.cantSubprod) + this.unidadMedidaSuproducto.value.code,
          label: this.selected_producto.nombre,
          value: this.selected_producto
        };
        this.productoUpdate.subproductoV[index1] = aux;
      }


      this.productoUpdate.subproductoV.push(aux);
      this.selected_producto = '';
    } else {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un producto existente!')

      setTimeout(function () {
        document.getElementById('prodExistenteU').style.color = '#FE2E2E';
      }, 50);
      // this.setColorError();
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
    console.log(this.pathLogo);
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
    console.log(this.pathLogoTP);
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

  addCant() {
    this.cantSubprod++;
  }

  lessCant() {
    if (this.cantSubprod > 1) {
      this.cantSubprod--;
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
    this.precio_venta = parseFloat((this.precio_costo * gain).toFixed(2));
  }

  valueChangePrecioCompra($event) {
    this.precio_costo = parseFloat(((this.precio_costo * 100) / 100).toFixed(2));
    const gain = (this.utilidad / 100) + 1;
    this.precio_venta = parseFloat((this.precio_costo * gain).toFixed(2));
  }

  valueChangePrecioVenta($event) {
    const gain = 1 - (this.utilidad / 100);
    this.precio_costo = parseFloat((this.precio_venta * gain).toFixed(2));
  }

  valueChangeGananciaU($event) {
    const gain = (this.utilidad / 100) + 1;
    this.precio_venta = parseFloat((this.precio_costo * gain).toFixed(2));
  }

  valueChangePrecioCompraU($event) {
    this.precio_costo = ((this.precio_costo * 100) / 100).toFixed(2);
    const gain = (this.utilidad / 100) + 1;
    this.precio_venta = parseFloat((this.precio_costo * gain).toFixed(2));
  }

  valueChangePrecioVentaU($event) {
    const gain = 1 - (this.utilidad / 100);
    this.precio_costo = parseFloat((this.precio_venta * gain).toFixed(2));
  }

  controlarPrecioCosto($event) {
    if (this.flagSubProd) {
      this.precio_costo = 0;
    }
  }

  setColorError() {
    /*console.log("in")
    if (this.selected_productoU != "") {
      return "#FE2E2E";
    } else {
      return "#DADAD2";
    }*/
  }

  onSubmit(value: string) {
    console.log(value);
  }

  calculatePortion(cantidad, precio, unidad) {
    const onzaEnMl = 29.5735;
    if (unidad.localeCompare('u')) {

    }
    if (unidad.localeCompare('ml')) {

    }
    if (unidad.localeCompare('oz')) {

    }
    const aux = '';
    const costoProporcional = '';

  }

  /* GESTION DE PROMOCIONES */
  /* GESTION DE CONFIGURACIONES */
}

function setOriginalColorsPC() {
  // border Color #dadad2
  // readonly Color #f8f5f0
  // error Color FE2E2E
  document.getElementById('nombrePC').style.borderColor = '#DADAD2';
  // document.getElementById("puPC").style.borderColor = "#DADAD2";
  // document.getElementById("utilidadPC").style.borderColor = "#DADAD2";
  document.getElementById('cantPC').style.borderColor = '#DADAD2';
  document.getElementById('tipoPC').style.borderColor = '#DADAD2';
  document.getElementById('tipoP').style.borderColor = '#DADAD2';
  document.getElementById('filesC').style.borderColor = '#DADAD2';
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