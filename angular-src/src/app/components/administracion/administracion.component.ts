import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { TipoProductoService } from '../../services/tipo-producto.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import * as moment from 'moment';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {

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
  //Atributos Producto
  productoUpdate = {
    "_id": "",
    "nombre": "",
    "precio_unitario": 0,
    "utilidad": 0,
    "cant_existente": 0,
    "subproductoV": [],
    "id_tipo_producto": ""
  };
  nombre;
  precio_unitario;
  utilidad;
  cant_existente;
  subproductoV;
  selected_tipo_producto;
  //Add product dialog
  selected_producto;
  lista_subProductos: any = [];
  medidaUtilidad;
  unidadMedidaSuproducto: number;
  cantSubprod: number;
  productos: any = [];
  //productos = new Map;
  //Otras
  tipo_productos: any = [];
  lstShow: any = [];
  flagSubProd;
  flagSubProdUpdate;
  flagListaSubProd;
  settingsTP = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      _id: {
        title: 'ID',
        width: '70px',
        filter: false
      },
      desc_tipo_producto: {
        title: 'Nombre',
        width: '450px'
      }
    },
    actions: {
      columnTitle: '',
      add: true,
      edit: true,
      delete: false
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  };
  /*settingsP = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      nombre: {
        title: 'Nombre',
        width: '280px',
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
      precio_unitario: {
        title: 'Precio Unitario',
        width: '100px'
      },
      utilidad: {
        title: 'Utilidad',
        width: '90px'
      },
      cant_existente: {
        title: 'Cantidad Existente',
        width: '90px'
      },
      subproductoV: {
        title: 'Subproducto',
        width: '350px'
      },
      id_tipo_producto: {
        title: 'Tipo Producto',
        width: '140px',
        filter: {
          type: 'list',
          config: {
            selectText: 'Todos',
            list: this.tipo_productos,
          },
        },
      },
    },
    actions: {
      columnTitle: '',
      add: true,
      edit: true,
      delete: false
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  };*/
  settingsP = {}

  constructor(
    private validateService: ValidateService,
    private flashMessagesService: FlashMessagesService,
    private tipoProductoService: TipoProductoService,
    private productoService: ProductoService,
    private authService: AuthService) {
    this.flagCreateTP = false;
    this.flagUpdateTP = false;
    this.flagCreateP = false;
    this.flagUpdateP = false;
    this.id_mostar = 0;
  }

  ngOnInit() {
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
      this.productoService.getAll().subscribe(tp => {
        this.productos = tp;
        let productosShow: any = [];
        let i = 0;
        for (let x of tp) {
          let desc = this.search(x.id_tipo_producto, this.tipo_productos);
          this.productos[i].id_tipo_producto = desc;
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
              width: '280px',
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
            precio_unitario: {
              title: 'Precio Unitario',
              width: '100px'
            },
            utilidad: {
              title: 'Utilidad',
              width: '90px'
            },
            cant_existente: {
              title: 'Cantidad Existente',
              width: '90px'
            },
            subproductoV: {
              title: 'Subproducto',
              width: '350px'
            },
            id_tipo_producto: {
              title: 'Tipo Producto',
              width: '140px',
              filter: {
                type: 'list',
                config: {
                  selectText: 'Todos',
                  list: selectShow,
                },
              },
            },
          },
          actions: {
            columnTitle: '',
            add: true,
            edit: true,
            delete: false
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
    this.nombre = "";
    this.precio_unitario = null;
    this.utilidad = null;
    this.cant_existente = null;
    this.subproductoV = [];
    this.selected_tipo_producto = undefined;
    this.selected_producto = "";
    this.flagSubProd = false;
    this.flagSubProdUpdate = false;
    this.unidadMedidaSuproducto = 2;
    this.cantSubprod = 1;
    this.flagListaSubProd = false;
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
    }, 500)
  }

  setCursorUpdateTP() {
    setTimeout(function () {
      document.getElementById('descTPU').focus();
    }, 500)
  }

  setCursorAddP() {
    setTimeout(function () {
      document.getElementById('nombrePC').focus();
      document.getElementById("iconPercent").style.backgroundColor = "#2196F3";
      setOriginalColorsPC();
    }, 500)
  }

  setCursorUpdateP() {
    setTimeout(function () {
      document.getElementById('nombrePU').focus();
    }, 500)
  }

  onCreateTP(event: any) {
    this.flagCreateTP = true;
  }

  onCreateP(event: any) {
    this.flagCreateP = true;
  }

  onUpdateTP(event: any) {
    this.flagUpdateTP = true;
    this.id_mostar = event.data._id;
    this.desc_tipo_producto = event.data.desc_tipo_producto;
    //this.ngOnInit();
  }

  onUpdateP(event: any) {
    this.flagUpdateP = true;
    this.productoUpdate = event.data;
    //let idTpBus = this.searchByName(this.productoUpdate.id_tipo_producto, this.tipo_productos)
    //this.productoUpdate.id_tipo_producto = idTpBus;
  }

  onAddTPSubmit() {
    const tipoProducto = {
      desc_tipo_producto: this.desc_tipo_producto
    }
    //Required fields
    if (!this.validateService.validateTipoProducto(tipoProducto)) {
      this.flashMessagesService.show('Campos vacios!', { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    //Register Tipo producto
    let a = this.tipoProductoService.registerTipoProducto(tipoProducto).subscribe(data => {
      this.flashMessagesService.show('Ingreso Existoso!', { cssClass: 'alert-success', timeout: 2000 });
    }, err => {
      // Log errors if any
      console.log(err);
      this.flashMessagesService.show('Algo salio mal!', { cssClass: 'alert-danger', timeout: 2000 });
    });
    this.ngOnInit();
    this.showDialogTPC = false;
  }

  onAddPSubmit() {
    const producto = {
      nombre: this.nombre,
      precio_unitario: this.precio_unitario,
      utilidad: this.utilidad,
      cant_existente: this.cant_existente,
      subproductoV: this.subproductoV,
      id_tipo_producto: this.selected_tipo_producto._id
    }
    console.log(this.selected_tipo_producto);
    console.log(producto);
    //Required fields
    if (!this.validateService.customValidateProducto(producto)) {
      this.flashMessagesService.show('Campos vacios!', { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    //Register producto
    this.productoService.registerProducto(producto).subscribe(data => {
      this.flashMessagesService.show('Ingreso Existoso!', { cssClass: 'alert-success', timeout: 2000 });

    }, err => {
      // Log errors if any
      console.log(err);
      this.flashMessagesService.show('Algo salio mal!', { cssClass: 'alert-danger', timeout: 2000 });
    });
    this.ngOnInit();
    //this.showDialogPC = false;
  }

  onUpdateTPSubmit() {
    const tipoProducto = {
      id: this.id_mostar,
      desc_tipo_producto: this.desc_tipo_producto
    }
    //Required fields
    if (!this.validateService.validateTipoProducto(tipoProducto)) {
      this.flashMessagesService.show('Campos vacios!', { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    //Update Tipo producto
    this.tipoProductoService.updateTipoProducto(tipoProducto).subscribe(data => {
      this.flashMessagesService.show('Modificacion exitosa!', { cssClass: 'alert-success', timeout: 2000 });
    }, err => {
      // Log errors if any
      console.log(err);
      this.flashMessagesService.show('Algo salio mal!', { cssClass: 'alert-danger', timeout: 2000 });
    });
    this.sourceP.refresh();
    this.ngOnInit();
    //this.showDialogTPU = false;
  }

  onUpdatePSubmit() {
    let idTpBus = this.searchByName(this.productoUpdate.id_tipo_producto, this.tipo_productos)
    const producto = {
      _id: this.productoUpdate._id,
      nombre: this.productoUpdate.nombre,
      precio_unitario: this.productoUpdate.precio_unitario,
      utilidad: this.productoUpdate.utilidad,
      cant_existente: this.productoUpdate.cant_existente,
      subproductoV: this.productoUpdate.subproductoV,
      id_tipo_producto: idTpBus
    }
    console.log(producto);
    //Required fields
    if (!this.validateService.customValidateProducto(producto)) {
      this.flashMessagesService.show('Campos vacios!', { cssClass: 'alert-danger', timeout: 2000 });
      return false;
    }
    //Update producto
    this.productoService.updateProducto(producto).subscribe(data => {
      this.flashMessagesService.show('Modificacion Existosa!', { cssClass: 'alert-success', timeout: 2000 });

    }, err => {
      // Log errors if any
      console.log(err);
      this.flashMessagesService.show('Algo salio mal!', { cssClass: 'alert-danger', timeout: 2000 });
    });
    this.ngOnInit();
    //this.showDialogPU = false;
  }

  fuPorcentaje() {
    document.getElementById("iconUsd").style.backgroundColor = "#ffffff";
    document.getElementById("iconPercent").style.backgroundColor = "#2196F3";
    this.medidaUtilidad = "%";
  }

  fuMoneda() {
    document.getElementById("iconPercent").style.backgroundColor = "#ffffff";
    document.getElementById("iconUsd").style.backgroundColor = "#2196F3";
    this.medidaUtilidad = "$";
  }

  deleteItem() {
    alert("delete");
  }

  addItem() {
    if (this.selected_producto != "") {
      this.flagListaSubProd = true;
      let unidadMedida: string;
      if (this.unidadMedidaSuproducto === 1) {
        unidadMedida = "u";
      } else {
        unidadMedida = "ml"
      }
      let nItem = this.selected_producto.nombre + " " + this.cantSubprod + unidadMedida;
      let aux = { nombre: this.selected_producto.nombre, cantidad: this.cantSubprod + unidadMedida };
      //this.lista_subProductos.push(aux);
      this.subproductoV.push(aux);
    } else {
      this.flashMessagesService.show('Selecciona un producto existente!', { cssClass: 'alert-danger', timeout: 2000 });
      document.getElementById("tipoP").style.borderColor = "#FE2E2E";
    }
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

  /* GESTION DE PROMOCIONES */
  /* GESTION DE CONFIGURACIONES */
}

function setOriginalColorsPC() {
  //border Color #dadad2
  //readonly Color #f8f5f0
  //error Color FE2E2E
  document.getElementById("nombrePC").style.borderColor = "#DADAD2";
  document.getElementById("puPC").style.borderColor = "#DADAD2";
  document.getElementById("utilidadPC").style.borderColor = "#DADAD2";
  document.getElementById("cantPC").style.borderColor = "#DADAD2";
  document.getElementById("tipoPC").style.borderColor = "#DADAD2";
  document.getElementById("tipoP").style.borderColor = "#DADAD2";

}
