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

const URL = 'http://localhost:3000/api/imagen';
@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})

export class AdministracionComponent implements OnInit {

  colorUpdate = "";
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
  //Atributos Tipo Producto
  desc_tipo_producto;
  id_mostar;
  pathLogoTP;
  pathLogoTPU;
  //Atributos Producto
  productoUpdate;
  nombre;
  precio_costo;
  precio_venta;
  utilidad;
  cant_existente;
  subproductoV;
  selected_tipo_producto;
  pathLogo;
  //Add product dialog
  selected_producto;
  selected_productoU;
  lista_subProductos: any = [];
  medidaUtilidad;

  cantSubprod: number;
  cantSubProdU: number;
  productos: any = [];
  //Otras
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
      //columnTitle: '',
      add: true,
      edit: true,
      delete: true
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  };
  settingsP = {}
  position = 'below';
  color = 'primary';
  checked = false;
  lstUnidades: SelectItem[];
  unidadMedidaSuproducto: any;
  userform: FormGroup;

  constructor(
    private validateService: ValidateService,
    private tipoProductoService: TipoProductoService,
    private productoService: ProductoService,
    private authService: AuthService,
    private http: Http, public dialog: MdDialog,
    private messageGrowlService: MessageGrowlService,
    private formatterService: FormatterService,
    private formBuilder: FormBuilder) {
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
  }

  ngOnInit() {

    this.productos = {
      "label": "",
      "value": "",
      "cant_existente": 0,
      "id_tipo_producto": "",
      "nombre": "",
      "path": "",
      "precio_unitario": 0,
      "subproductoV": [],
      "utilidad": 0,
      "_id": "5993c0a775758c27cccd88ee"
    }
    /* Get Tipo Productos*/
    this.tipoProductoService.getAll().subscribe(tp => {
      this.tipo_productos = tp;
      this.sourceTP = new LocalDataSource();
      this.sourceTP.load(this.tipo_productos);
      const selectShow: { value: string, title: string }[] = [];
      let ind = 0;
      for (let entry of tp) {
        let aux = { value: entry.desc_tipo_producto, title: entry.desc_tipo_producto };
        selectShow[ind] = aux;
        ind++;
      }
      /* Get Productos*/
      this.productoService.getAll().subscribe(p => {
        this.productos = p;
        let i = 0;
        for (let x of p) {
          let desc = this.search(x.id_tipo_producto, this.tipo_productos);
          this.productos[i].id_tipo_producto = desc;
          this.productos[i].label = x.nombre;
          this.productos[i].value = x.nombre;
          this.productos[i].precio_costo = this.productos[i].precio_costo.toFixed(2);
          this.productos[i].precio_venta = this.productos[i].precio_venta.toFixed(2);
          this.productos[i].utilidad = this.productos[i].utilidad.toFixed(2);
          if (x.subproductoV != "") {
            let fila = "";
            for (let entry of x.subproductoV) {
              fila += "-" + entry.nombre + " " + entry.cantidad + " ";
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
              width: '25%',
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
            cant_existente: {
              title: 'Cant. Exis.',
              width: '7%'
            },
            subproductoV: {
              title: 'Subproducto',
              width: '30%'
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
    this.desc_tipo_producto = "";
    this.id_mostar = "";
    //Atributos Producto
    this.productoUpdate = {
      "_id": "",
      "nombre": "",
      "precio_costo": 0,
      "precio_venta": 0,
      "utilidad": 0,
      "cant_existente": 0,
      "subproductoV": [],
      "id_tipo_producto": "",
      "path": ""
    };

    this.nombre = "";
    this.precio_costo = null;
    this.precio_venta = null;
    this.utilidad = "30";
    this.cant_existente = null;
    this.subproductoV = [];
    this.selected_tipo_producto = "";
    this.selected_producto = "";
    this.selected_productoU = "";
    this.flagSubProd = false;
    this.flagSubProdUpdate = false;

    this.cantSubprod = 1;
    this.cantSubProdU = 1;
    this.flagListaSubProd = false;
    this.flagListaSubProdUpdate = false;
  }

  /* GESTION DE PRODUCTO */
  changeTPC($event) {
    this.flagCreateTP = false;
  }

  changeTPU($event) {
    this.flagUpdateTP = false;
  }

  changePC($event) {
    this.flagCreateP = false;
  }

  changePU($event) {
    this.flagUpdateP = false;
  }

  setCursorAddTP() {
    setTimeout(function () {
      document.getElementById('descTPC').focus();
      document.getElementById('filesTP').style.backgroundColor = "lightsalmon";
    }, 50)
  }

  setCursorUpdateTP() {
    setTimeout(function () {
      document.getElementById('descTPU').focus();
    }, 500)
  }

  setCursorAddP() {
    setTimeout(function () {
      document.getElementById('nombrePC').focus();
      //document.getElementById("iconPercent").style.backgroundColor = "#2196F3";
      document.getElementById('filesC').style.backgroundColor = "lightsalmon";
      //setOriginalColorsPC();
    }, 50)
  }

  setCursorUpdateP() {
    setTimeout(function () {
      document.getElementById('nombrePU').focus();
      //document.getElementById("iconPercent").style.backgroundColor = "#2196F3";
      //setOriginalColorsPU();
    }, 50)
  }

  onCreateTP(event: any) {
    this.myInputVariable.nativeElement.value = "";
    this.flagCreateTP = true;
    this.desc_tipo_producto = "";
  }

  @ViewChild('myInput')
  myInputVariable: any;

  onCreateP(event: any) {
    //console.log("before: "+this.myInputVariable.nativeElement.value)
    this.myInputVariable.nativeElement.value = "";
    this.flagCreateP = true;
    this.nombre = "";
  }

  onUpdateTP(event: any) {
    this.flagUpdateTP = true;
    this.id_mostar = event.data._id;
    this.desc_tipo_producto = event.data.desc_tipo_producto;
    if (this.pathLogoTPU == undefined) {
      this.colorUpdate = "black";
      setTimeout(function () {
        document.getElementById('filesTPU').style.backgroundColor = "lightsalmon";
      }, 50)
    } else {
      this.colorUpdate = "lightgreen";
      setTimeout(function () {
        document.getElementById('filesTPU').style.backgroundColor = "lightgreen";
      }, 50)
    }
  }

  @ViewChild('myInput1')
  myInputVariable1: any;

  onUpdateP(event: any) {
    this.myInputVariable1.nativeElement.value = "";
    this.flagUpdateP = true;
    this.productoUpdate = event.data;
    if (this.productoUpdate.path == undefined) {
      this.colorUpdate = "black";
      setTimeout(function () {
        document.getElementById('filesU').style.backgroundColor = "lightsalmon";
      }, 50)
    } else {
      this.colorUpdate = "lightgreen";
      setTimeout(function () {
        document.getElementById('filesU').style.backgroundColor = "lightgreen";
      }, 50)
    }
    //bug 2 click edit
    if (typeof (event.data.subproductoV) === 'object') {
      let fila = "";
      for (let entry of event.data.subproductoV) {
        fila += "-" + entry.nombre + " " + entry.cantidad + " ";
      }
      event.data.subproductoV = fila;
    }
    if (this.productoUpdate.subproductoV.length == 0) {
      this.flagSubProdUpdate = false;
    } else {
      this.flagSubProdUpdate = true;
      this.flagListaSubProd = true;
      if (this.productoUpdate.subproductoV.length > 0) {

        let a = this.productoUpdate.subproductoV.toString().replace(/ +(?= )/g, '');
        this.productoUpdate.subproductoV = [];
        this.productoUpdate.subproductoV.push(a);
        //console.log(this.productoUpdate.subproductoV);
        if (this.auxSubprod == undefined) {
          this.auxSubprod == this.productoUpdate.subproductoV;
        }

        let array = this.productoUpdate.subproductoV.toString().split("-");
        this.productoUpdate.subproductoV = [];
        let index = 0;
        for (let entry of array) {
          if (entry.length > 0) {
            let vec = entry.split(" ");
            let n = vec.length;
            let nombre = vec[0];
            let cant = vec[n - 2];
            for (let i = 1; i < n; i++) {
              if (vec[i + 1] != "") {
                nombre += " " + vec[i];
              }
            }
            //set subproducto to ul format
            let aux = { nombre: nombre, cantidad: cant };
            this.productoUpdate.subproductoV.push(aux);
            index++;
          }
        }
      }
    }
  }

  onAddTPSubmit() {
    const tipoProducto = {
      desc_tipo_producto: this.desc_tipo_producto,
      path: this.pathLogo
    }
    //Required fields
    if (!this.validateService.validateTipoProducto(tipoProducto)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    //Register Tipo producto
    let a = this.tipoProductoService.registerTipoProducto(tipoProducto).subscribe(data => {
      this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
    }, err => {
      // Log errors if any
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
    this.ngOnInit();
    this.showDialogTPC = false;
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
      path: this.pathLogo
    }
    console.log(producto)
    //Required fields
    if (!this.validateService.customValidateProducto(producto)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    this.productoService.uploadImage(this.pathLogo).subscribe(tp => {
      //Register producto
      producto.path = tp;
      this.productoService.registerProducto(producto).subscribe(data => {
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');

      });
      this.ngOnInit();
      this.myInputVariable.nativeElement.value = "";
      //this.showDialogPC = false;
    }, err => {
      console.log(err);
    });

  }

  onUpdateTPSubmit() {
    const tipoProducto = {
      id: this.id_mostar,
      desc_tipo_producto: this.desc_tipo_producto
    }
    //Required fields
    if (!this.validateService.validateTipoProducto(tipoProducto)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    //Update Tipo producto
    this.tipoProductoService.updateTipoProducto(tipoProducto).subscribe(data => {
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
    let idTpBus = this.searchByName(this.productoUpdate.id_tipo_producto, this.tipo_productos)
    const producto = {
      _id: this.productoUpdate._id,
      nombre: this.productoUpdate.nombre,
      precio_costo: this.productoUpdate.precio_costo,
      utilidad: this.productoUpdate.utilidad,
      cant_existente: this.productoUpdate.cant_existente,
      subproductoV: this.productoUpdate.subproductoV,
      id_tipo_producto: idTpBus
    }
    console.log(producto);
    //Required fields
    if (!this.validateService.customValidateProductoU(producto)) {
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      return false;
    }
    //Update producto
    this.productoService.updateProducto(producto).subscribe(data => {
      this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
    }, err => {
      // Log errors if any
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
    this.ngOnInit();
    //console.log(this.productoUpdate.id_tipo_producto);
    this.showDialogPU = false;
    this.productoUpdate = {
      "_id": "",
      "nombre": "",
      "precio_unitario": 0,
      "utilidad": 0,
      "cant_existente": 0,
      "subproductoV": [],
      "id_tipo_producto": "",
      "path": ""
    };
  }

  onDeleteTP(event): void {
    this.openDialog(event.data);
  }

  openDialog(data) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        if (result.localeCompare("Aceptar") == 0) {
          this.sourceTP.remove(data);
          //remove from database
          this.tipoProductoService.deleteTipoProducto(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');

          })
        }
    });
  }

  onDeleteP(event): void {
    this.openDialog1(event.data);
  }

  openDialog1(data) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        if (result.localeCompare("Aceptar") == 0) {
          this.sourceTP.remove(data);
          //remove from database
          this.tipoProductoService.deleteTipoProducto(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');

          })
        }
    });
  }

  fuPorcentaje() {
    //document.getElementById("iconUsd").style.backgroundColor = "#ffffff";
    //document.getElementById("iconPercent").style.backgroundColor = "#2196F3";
    this.medidaUtilidad = "%";
  }

  fuMoneda() {
    document.getElementById("iconPercent").style.backgroundColor = "#ffffff";
    //document.getElementById("iconUsd").style.backgroundColor = "#2196F3";
    this.medidaUtilidad = "$";
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
    if (this.selected_producto != "") {
      let index = this.productos.findIndex(x => x.nombre == this.selected_producto);
      this.selected_producto = this.productos[index];
      this.flagListaSubProd = true;
      let aux = { nombre: this.selected_producto.nombre, cantidad: this.cantSubprod + this.unidadMedidaSuproducto.value.code, label: this.selected_producto.nombre, value: this.selected_producto };
      //search wheter subProd already exists
      let index1 = this.subproductoV.findIndex(x => x.nombre == aux.nombre);
      if (index1 == -1) {
        this.subproductoV.push(aux);
      } else {
        var str = this.subproductoV[index1].cantidad;
        str = str.replace(/[^0-9]+/ig, "");
        let aux = { nombre: this.selected_producto.nombre, cantidad: (parseInt(str) + this.cantSubprod) + this.unidadMedidaSuproducto.value.code, label: this.selected_producto.nombre, value: this.selected_producto };
        this.subproductoV[index1] = aux;
      }

      this.selected_producto = "";
    } else {
      this.messageGrowlService.notify("error", "Error", "Selecciona un producto existente!")
      document.getElementById("prodExistente").style.borderColor = "#FE2E2E";
    }
  }

  addItemU() {
    if (this.selected_productoU != "") {

      let index = this.productos.findIndex(x => x.nombre == this.selected_productoU);
      this.selected_productoU = this.productos[index];
      this.flagListaSubProdUpdate = true;
      let aux = { nombre: this.selected_productoU.nombre, cantidad: this.cantSubProdU + this.unidadMedidaSuproducto.value.code, label: this.selected_productoU.nombre, value: this.selected_productoU };
      if (this.productoUpdate.subproductoV.length === 0) {
        this.productoUpdate.subproductoV = [];
      }
      //search wheter subProd already exists
      //search wheter subProd already exists
      let index1 = this.productoUpdate.subproductoV.findIndex(x => x.nombre == aux.nombre);
      if (index1 == -1) {
        this.productoUpdate.subproductoV.push(aux);
      } else {
        var str = this.productoUpdate.subproductoV[index1].cantidad;
        str = str.replace(/[^0-9]+/ig, "");
        let aux = { nombre: this.selected_producto.nombre, cantidad: (parseInt(str) + this.cantSubprod) + this.unidadMedidaSuproducto.value.code, label: this.selected_producto.nombre, value: this.selected_producto };
        this.productoUpdate.subproductoV[index1] = aux;
      }


      this.productoUpdate.subproductoV.push(aux);
      this.selected_producto = "";
    } else {
      this.messageGrowlService.notify("error", "Error", "Selecciona un producto existente!")

      setTimeout(function () {
        document.getElementById("prodExistenteU").style.color = "#FE2E2E";
      }, 50)
      //this.setColorError();
    }
  }

  onChangeFileC(event) {
    var files = event.srcElement.files[0];
    let color = "";
    if (files == undefined) {
      color = "lightsalmon";
    } else {
      color = "lightgreen";
    }
    this.pathLogo = files;
    document.getElementById('filesC').style.backgroundColor = color;
  }

  onChangeFileU(event) {
    this.colorUpdate = "black";
    var files = event.srcElement.files[0];
    let color = "";
    if (files == undefined) {
      color = "lightsalmon"
    } else {
      color = "lightgreen";
    }
    this.pathLogo = files;
    document.getElementById('filesU').style.backgroundColor = color;
  }

  onChangeFileTP(event) {
    var files = event.srcElement.files[0];
    let color = "";
    if (files == undefined) {
      color = "lightsalmon";
    } else {
      color = "lightgreen";
    }
    this.pathLogoTP = files;
    document.getElementById('filesTP').style.backgroundColor = color;
  }

  onChangeFileTPU(event) {
    this.colorUpdate = "black";
    var files = event.srcElement.files[0];
    let color = "";
    if (files == undefined) {
      color = "lightsalmon";
    } else {
      color = "lightgreen";
    }
    this.pathLogoTP = files;
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
    for (let entry of myArray) {
      if (entry._id === id) {
        return entry.desc_tipo_producto;
      }
    }
  }

  searchByName(nombre, myArray) {
    for (let entry of myArray) {
      if (entry.desc_tipo_producto.localeCompare(nombre) === 0) {
        return entry._id;
      }
    }
  }

  onChangeUpdtProd($event) {
    //console.log(this.productoUpdate.id_tipo_producto);
    //this.productoUpdate.id_tipo_producto = "Wiskey";
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

  valueChangeGanancia($event) {
    let gain = (this.utilidad / 100) + 1;
    this.precio_venta = (this.precio_costo * gain).toFixed(2);
  }

  valueChangePrecioCompra($event) {
    this.precio_costo = ((this.precio_costo * 100) / 100).toFixed(2);
    let gain = (this.utilidad / 100) + 1;
    this.precio_venta = (this.precio_costo * gain).toFixed(2);
  }

  valueChangePrecioVenta($event) {
    let gain = 1 - (this.utilidad / 100);
    this.precio_costo = (this.precio_venta * gain).toFixed(2);
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
    console.log(value)
  }

  /* GESTION DE PROMOCIONES */
  /* GESTION DE CONFIGURACIONES */
}

function setOriginalColorsPC() {
  //border Color #dadad2
  //readonly Color #f8f5f0
  //error Color FE2E2E
  document.getElementById("nombrePC").style.borderColor = "#DADAD2";
  //document.getElementById("puPC").style.borderColor = "#DADAD2";
  //document.getElementById("utilidadPC").style.borderColor = "#DADAD2";
  document.getElementById("cantPC").style.borderColor = "#DADAD2";
  document.getElementById("tipoPC").style.borderColor = "#DADAD2";
  document.getElementById("tipoP").style.borderColor = "#DADAD2";
  document.getElementById("filesC").style.borderColor = "#DADAD2";
}

function setOriginalColorsPU() {
  document.getElementById("nombrePU").style.borderColor = "#DADAD2";
  //document.getElementById("puPU").style.borderColor = "#DADAD2";
  //document.getElementById("utilidadPU").style.borderColor = "#DADAD2";
  document.getElementById("cantPU").style.borderColor = "#DADAD2";
  document.getElementById("tipoPU").style.borderColor = "#DADAD2";
  document.getElementById("tipoP").style.borderColor = "#DADAD2";
  document.getElementById("filesU").style.borderColor = "#DADAD2";
}