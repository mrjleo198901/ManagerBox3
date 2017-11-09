import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { TipoProductoService } from '../../services/tipo-producto.service';
import { PersonalService } from '../../services/personal.service';
import { AuthService } from '../../services/auth.service';
import * as myGlobals from '../../components/globals';
import { Subject } from 'rxjs/Subject';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MessageGrowlService } from '../../services/message-growl.service';
import { ActiveCardsService } from '../../services/active-cards.service';
import { FacturaService } from '../../services/factura.service';
import { ValidateService } from '../../services/validate.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})

export class FacturacionComponent implements OnInit {
  paths: { path: string, tipoProducto: string, nombre: string, precio_venta: number, cant_existente: number, promocion: any }[] = [];
  pathsType: { path: string, tipoProducto: string, nombre: string, precio_venta: number, cant_existente: number, promocion: any }[] = [];
  pathsTypePromos: { path: string, tipoProducto: string, nombre: string, precio_venta: number, cant_existente: number, promocion: any }[] = [];
  selectedProductos;
  showDialogConfirmar = false;
  cardNumber: String;
  mapTP = new Map();
  public tabs: Array<any> = [];
  flagProdSeleccionados;
  position = 'below';
  listaSize = false;
  validCard: String;
  listMeseros: any;
  selectedProd: any;
  displayDialog: boolean;
  checked: boolean = false;
  password;
  public tabindex = false;
  flagPrecioPromo = true;
  flagFindCard = false;
  flagMatchPass = false;
  selectedMesero: any;
  idFact;

  public static updateUserStatus: Subject<boolean> = new Subject();

  constructor(
    private productoService: ProductoService,
    private tipoProductoService: TipoProductoService,
    private personalService: PersonalService,
    private authService: AuthService,
    private messageGrowlService: MessageGrowlService,
    private activeCardsService: ActiveCardsService,
    private facturaService: FacturaService,
    private validateService: ValidateService) {

    this.tipoProductoService.getAll().subscribe(tp => {
      let index = 0;
      for (let entry of tp) {
        let aux = { title: entry.desc_tipo_producto, content: entry.desc_tipo_producto };
        this.tabs[index] = aux;
        this.mapTP.set(index, entry._id);
        index++;
      }

      this.productoService.getAll().subscribe(p => {
        let index = 0;
        for (let entry of p) {
          let aux = { path: entry.path, tipoProducto: entry.id_tipo_producto, nombre: entry.nombre, precio_venta: entry.precio_venta, cant_existente: entry.cant_existente, promocion: entry.promocion };
          this.paths[index] = aux;
          index++;
        }

        this.pathsType = [];
        let tipo = this.mapTP.get(0);
        let ind = 0;
        for (let entry of this.paths) {
          if (entry.tipoProducto === tipo) {
            let aux = { path: entry.path, tipoProducto: entry.tipoProducto, nombre: entry.nombre, precio_venta: entry.precio_venta, cant_existente: entry.cant_existente, promocion: entry.promocion };
            this.pathsType[ind] = aux;
            ind++;
          }
        }
        this.ngOnInitPromos();
      }, err => {
        console.log(err);
      });

    }, err => {
      console.log(err);
      return false;
    })

    FacturacionComponent.updateUserStatus.subscribe(res => {
      console.log("entro");
      this.ngOnInitPromos();
    })
  }

  ngOnInit() {
    this.selectedProductos = [];
    this.flagProdSeleccionados = false;
    let idCargo = "59937c6337eac33cd4819873";
    this.personalService.getByTipo(idCargo).subscribe(p => {
      this.listMeseros = p;
      if (this.listMeseros.length > 0) {
        this.selectedMesero = this.listMeseros[0];
      }
    }, err => {
      console.log(err);
    });
  }

  public ngOnInitPromos() {
    this.pathsTypePromos = [];
    for (let entry of this.paths) {
      if (entry.promocion.length > 0) {
        this.pathsTypePromos.push(entry);
      }
    }
  }

  addProd(i) {
    this.selectedProductos[i].cantidad = this.selectedProductos[i].cantidad + 1;
    this.selectedProductos[i].total += this.pathsType[i].precio_venta;
  }

  lessProd(i) {
    if (this.selectedProductos[i].cantidad > 1) {
      this.selectedProductos[i].cantidad = this.selectedProductos[i].cantidad - 1;
      this.selectedProductos[i].total -= this.pathsType[i].precio_venta;
    }
  }

  removeProd(i) {
    let nombreProd = this.selectedProductos[i].nombre;
    this.selectedProductos = this.selectedProductos.filter(function (obj) {
      return obj.nombre !== nombreProd;
    });
  }

  setBorder(index) {
    let color = "solid red";
    if (index == 0) {
      color = "solid blue";
    }
    return color
  }

  setPadding(index) {
    let pad = "65px";
    return pad;
  }

  eventEmitDoubleClick($event, i) {
    this.flagProdSeleccionados = true;
    let aux = {
      path: this.pathsType[i].path,
      tipoProducto: this.pathsType[i].tipoProducto,
      nombre: this.pathsType[i].nombre,
      cantidad: 1,
      precio_venta: this.pathsType[i].precio_venta,
      total: this.pathsType[i].precio_venta
    };

    var indexOfInserted = this.selectedProductos.findIndex(i => i.nombre === aux.nombre);
    if (indexOfInserted == -1) {
      this.selectedProductos.push(aux);
    } else {
      this.addProd(indexOfInserted);
    }
  }

  public loadLogos(i) {

    if (i == 100) {
      this.flagPrecioPromo = true;
    } else {
      this.flagPrecioPromo = false;
    }
    this.pathsType = [];
    let tipo = this.mapTP.get(i);
    let index = 0;
    for (let entry of this.paths) {
      if (entry.tipoProducto === tipo) {
        let aux = {
          path: entry.path,
          tipoProducto: entry.tipoProducto,
          nombre: entry.nombre,
          precio_venta: entry.precio_venta,
          cant_existente: entry.cant_existente,
          promocion: entry.promocion
        }
        this.pathsType[index] = aux;
        index++;
      }
    }

    /*this.pathsTypePromos = [];
    let ind1 = 0;
    let promos = JSON.parse(localStorage.getItem("promosActivas"))
    if (promos !== null) {
      for (let entry of promos) {
        let aux = {
          path: entry.path,
          tipoProducto: entry.tipoProducto,
          nombre: entry.nombre,
          precio_venta: entry.precio_venta,
          cant_existente: entry.cant_existente,
          promocion: entry.promocion
        }
        this.pathsTypePromos[ind1] = aux;
        ind1++;
      }
    }*/
    this.pathsTypePromos = [];
    for (let entry of this.paths) {
      if (entry.promocion.length > 0) {
        this.pathsTypePromos.push(entry);
      }
    }

  }

  onChange(event) {
    this.cardNumber = this.cardNumber.toLowerCase();
    let finalChar = this.cardNumber.slice(-1)
    if (this.cardNumber.length == 9) {
      if (finalChar.localeCompare("_") == 0) {
        this.checkCard();
      } else {
        this.messageGrowlService.notify('warn', 'Advertencia', 'La tarjeta no pertenece al establecimiento!');
      }
    } else {
      this.flagFindCard = false;
      document.getElementById('basic-addon2').style.backgroundColor = '#FE2E2E';//soft red
      document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';//default color
    }
  }

  checkCard() {
    this.activeCardsService.searchByCard(this.cardNumber).subscribe(data => {
      this.idFact = data[0].idFactura;
      if (data.length > 0) {
        this.flagFindCard = true;
        document.getElementById('basic-addon1').style.backgroundColor = '#6ce600';//soft green
        document.getElementById('basic-addon2').style.backgroundColor = '#f8f5f0';//default color
      } else {
        this.flagFindCard = false;
        document.getElementById('basic-addon2').style.backgroundColor = '#FE2E2E';//soft red
        document.getElementById('basic-addon1').style.backgroundColor = '#f8f5f0';//default color
        this.messageGrowlService.notify('error', 'Error', 'La tarjeta no ha sido ingresada!');
      }
    }, err => {
      console.log(err);
    })
  }

  changePass(event) {
    if (this.password.length > 0) {
      this.flagMatchPass = true;
    } else {
      this.flagMatchPass = false;
    }
  }

  send() {
    console.log("pass:" + this.flagMatchPass + " card:" + this.flagMatchPass)
    const user = {
      username: this.selectedMesero.cedula,
      password: this.password
    }
    this.authService.authenticateUser(user).subscribe(data => {
      if (data.success) {
        this.facturaService.getById(this.idFact).subscribe(data => {
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
          for (let entry of this.selectedProductos) {
            let aux = {
              descripcion: entry.nombre,
              precio_venta: entry.precio_venta,
              total: entry.total,
              cantidad: entry.cantidad,
              fecha: this.validateService.getDateTime()
            }
            vecDF.push(aux)
          }
          updatedFact[0].detalleFacturaV = vecDF;
          console.log(updatedFact)
          /*this.facturaService.update(updatedFact[0]).subscribe(data => {
              this.ngOnInitConfVenta();
              this.selectedProductos = [];
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
          })*/
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
        })
      } else {
        this.messageGrowlService.notify('error', 'Error', data.msg);
      }
    });
  }

  ngOnInitConfVenta() {
    this.cardNumber = '';
    this.password = '';
    this.showDialogConfirmar = false;
    this.messageGrowlService.notify('info', 'Información', 'Se realizó la venta!');
  }

  selectProduct(prod) {
    this.selectedProd = prod;
    this.displayDialog = true;
  }

  onDialogHide() {
    this.selectedProd = null;
  }

  setCursor() {
    setTimeout(function () {
      document.getElementById('cardNumber').focus();
    }, 0)
  }
}



