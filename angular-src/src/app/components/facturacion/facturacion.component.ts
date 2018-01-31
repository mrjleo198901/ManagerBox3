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
import { PromocionService } from '../../services/promocion.service';
import { FormatterService } from '../../services/formatter.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})

export class FacturacionComponent implements OnInit {
  paths: any = [];
  pathsType: any = [];
  pathsTypePromos: any = [];
  selectedProductos = [];
  selectedProductosShow: any;
  showDialogConfirmar = false;
  cardNumber: String;
  cardNumberC: String;
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
  colorZeroStock = '';
  showProdCover = false;
  public static updateUserStatus: Subject<boolean> = new Subject();
  flagShowAlert = false;
  productosV: any[];
  selectedProdCover: any;

  constructor(
    private productoService: ProductoService,
    private tipoProductoService: TipoProductoService,
    private personalService: PersonalService,
    private authService: AuthService,
    private messageGrowlService: MessageGrowlService,
    private activeCardsService: ActiveCardsService,
    private facturaService: FacturaService,
    private validateService: ValidateService,
    private promocionService: PromocionService,
    private fs: FormatterService) {

    this.lstProductos = [];
    this.tipoProductoService.getAll().subscribe(tp => {
      let index = 0;
      for (let entry of tp) {
        let aux = { title: entry.desc_tipo_producto, content: entry.desc_tipo_producto };
        this.tabs[index] = aux;
        this.mapTP.set(index, entry._id);
        index++;
      }
      this.productoService.getAll().subscribe(p => {
        this.lstProductos = p;
        this.paths = p;
        this.pathsType = [];
        let tipo = this.mapTP.get(0);
        for (let entry of this.paths) {
          if (entry.tipoProducto === tipo) {
            this.pathsType.push(entry);
          }
        }
        this.ngOnInitPromos();
        console.log(this.paths)
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
    });

    var x = window.innerWidth;
    this.onRzOnInit(x);
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
    this.productosV = [];
    /*console.log(this.fs.add(4.275, 4.275));
    console.log(this.fs.sub(0.3, 0.1));*/
  }

  addProd(i) {
    this.selectedProductos[i].cantidad = this.selectedProductos[i].cantidad + 1;
    if (this.selectedProductos[i].promocion.length > 0) {
      this.selectedProductos[i].total = this.fs.add(this.selectedProductos[i].total, this.selectedProductos[i].promocion[0].precio_venta);
    } else {
      this.selectedProductos[i].total = this.fs.add(this.selectedProductos[i].total, this.selectedProductos[i].precio_venta);
    }
  }

  addProdPromo(i) {
    this.selectedProductos[i].cantidad = this.selectedProductos[i].cantidad + 1;
    this.selectedProductos[i].total = this.fs.add(this.selectedProductos[i].total, this.selectedProductos[i].precio_venta);
  }

  lessProd(i) {
    if (this.selectedProductos[i].cantidad > 1) {
      this.selectedProductos[i].cantidad = this.selectedProductos[i].cantidad - 1;
      if (this.selectedProductos[i].promocion.length > 0) {
        this.selectedProductos[i].total = this.fs.sub(this.selectedProductos[i].total, this.selectedProductos[i].promocion[0].precio_venta);
      } else {
        this.selectedProductos[i].total = this.fs.sub(this.selectedProductos[i].total, this.selectedProductos[i].precio_venta)
      }
    }
  }

  lessProdPromo(i) {
    if (this.selectedProductos[i].cantidad > 1) {
      this.selectedProductos[i].cantidad = this.selectedProductos[i].cantidad - 1;
      this.selectedProductos[i].total = this.fs.sub(this.selectedProductos[i].total, this.selectedProductos[i].precio_venta)
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
    if (!this.flagPrecioPromo) {
      this.flagProdSeleccionados = true;
      let aux = {
        path: this.pathsType[i].path,
        tipoProducto: this.pathsType[i].id_tipo_producto,
        nombre: this.pathsType[i].nombre,
        cantidad: 1,
        precio_venta: this.pathsType[i].precio_venta,
        total: this.pathsType[i].precio_venta,
        promocion: this.pathsType[i].promocion,
        value: this.pathsType[i].nombre
      };
      if (aux.promocion.length > 0) {
        aux.total = this.pathsType[i].promocion[0].precio_venta;
      }
      var indexOfInserted = this.selectedProductos.findIndex(i => i.nombre === aux.nombre);
      if (indexOfInserted == -1) {
        this.selectedProductos.push(aux);
      } else {
        this.addProd(indexOfInserted);
      }
    } else {
      this.flagProdSeleccionados = true;
      let aux = {
        path: '',
        tipoProducto: 'pr0m0',
        nombre: this.lstProdPromo[i].nombre,
        cantidad: 1,
        precio_venta: this.lstProdPromo[i].productosV[2].v,
        total: this.lstProdPromo[i].productosV[2].v,
        promocion: [],
        value: this.lstProdPromo[i].nombre
      };
      var indexOfInserted = this.selectedProductos.findIndex(i => i.nombre === aux.nombre);
      if (indexOfInserted == -1) {
        this.selectedProductos.push(aux);
      } else {
        this.addProdPromo(indexOfInserted);
      }
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
      if (entry.id_tipo_producto === tipo) {
        entry.cant_existente = parseFloat(entry.cant_existente.toString());
        entry.contenido = parseFloat(entry.contenido.toString());
        entry.precio_costo = parseFloat(entry.precio_costo.toString());
        entry.precio_venta = parseFloat(entry.precio_venta.toString());
        entry.utilidad = parseFloat(entry.utilidad.toString());
        this.pathsType[index] = entry;
        index++;
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
        this.flagFindCard = false;
        this.messageGrowlService.notify('warn', 'Advertencia', 'La tarjeta no pertenece a este establecimiento!');
      }
    } else {
      this.flagFindCard = false;
      document.getElementById('basic-addon2').style.backgroundColor = '#FF4B36';//soft red
      document.getElementById('basic-addon1').style.backgroundColor = '';//default color
    }
  }

  checkCard() {
    this.activeCardsService.searchByCard(this.cardNumber).subscribe(data => {
      this.idFact = data[0].idFactura;
      if (data.length > 0) {
        this.flagFindCard = true;
        document.getElementById('basic-addon1').style.backgroundColor = '#8FC941';//soft green
        document.getElementById('basic-addon2').style.backgroundColor = '';//default color
      } else {
        this.flagFindCard = false;
        document.getElementById('basic-addon2').style.backgroundColor = '#FF4B36';//soft red
        document.getElementById('basic-addon1').style.backgroundColor = '';//default color
        this.messageGrowlService.notify('error', 'Error', 'La tarjeta no ha sido activada!');
      }
    }, err => {
      console.log(err);
    })
  }

  changePass(event) {
    if (this.password.length > 0) {
      if (this.flagFindCard === true) {
        this.flagMatchPass = true;
      } else {
        this.flagMatchPass = false;
      }
    } else {
      this.flagMatchPass = false;
    }
  }

  send() {
    const user = {
      username: this.selectedMesero.cedula,
      password: this.password
    }
    this.authService.authenticateUser(user).subscribe(data => {
      if (data.success) {
        this.facturaService.getById(this.idFact).subscribe(data => {
          let updatedFact = data;
          let vecDF: any = [];
          //cambiar formato del detalle de la factura
          for (let entry of data[0].detalleFacturaV) {
            vecDF.push(entry);
          }
          for (let entry of this.selectedProductos) {
            let aux = {
              fecha: this.validateService.getDateTimeEs(),
              cantidad: entry.cantidad,
              descripcion: entry.nombre,
              total: entry.total,
              precio_venta: entry.precio_venta,
              vendedor: this.selectedMesero._id,
              promocion: entry.promocion
            }
            vecDF.push(aux);
          }
          updatedFact[0].detalleFacturaV = vecDF;
          console.log(updatedFact)
          /*this.facturaService.update(updatedFact[0]).subscribe(data => {
            this.ngOnInitConfVenta();
            this.selectedProductos = [];
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
          });*/
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
        });
      } else {
        this.messageGrowlService.notify('error', 'Error', data.msg);
      }
    });
  }

  ngOnInitConfVenta() {
    this.cardNumber = '';
    this.password = '';
    this.showDialogConfirmar = false;
    this.flagProdSeleccionados = false;
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

  insertProdCover() {

  }

  setCursorProdCover() {
    setTimeout(function () {
      document.getElementById('cardNumber1').focus();
    }, 0)
  }

  onChangeC(event) {
    this.cardNumberC = this.cardNumberC.toLowerCase();
    let finalChar = this.cardNumberC.slice(-1)
    if (this.cardNumberC.length == 9) {
      if (finalChar.localeCompare("_") == 0) {
        this.checkCardC();
      } else {
        this.flagShowAlert = false;
        this.messageGrowlService.notify('warn', 'Advertencia', 'La tarjeta no pertenece a este establecimiento!');
      }
    } else {
      this.flagShowAlert = false;
      document.getElementById('basic-addon22').style.backgroundColor = '#FF4B36';//soft red
      document.getElementById('basic-addon11').style.backgroundColor = '';//default color
    }
  }


  checkCardC() {
    this.activeCardsService.searchByCard(this.cardNumberC).subscribe(data => {
      if (data.length > 0) {
        let lst: any = this.validateService.formatSails(data[0].productosV);
        this.productosV = [...lst];
        //this.productosV = [...data[0].productosV];
        console.log(this.productosV);
        if (this.productosV.length > 0) {
          this.flagShowAlert = false;
        } else {
          this.flagShowAlert = true;
        }
        document.getElementById('basic-addon11').style.backgroundColor = '#8FC941';//soft green
        document.getElementById('basic-addon22').style.backgroundColor = '';//default color
      } else {
        document.getElementById('basic-addon22').style.backgroundColor = '#FF4B36';//soft red
        document.getElementById('basic-addon11').style.backgroundColor = '';//default color
        this.messageGrowlService.notify('error', 'Error', 'La tarjeta no ha sido activada!');
      }
    }, err => {
      console.log(err);
    })
  }

  /* PROMOS*/
  showDialogPromo = false;
  selectedProdPromo: any;
  lstProductos: any[];
  lstProdPromo: any[];
  colorPromo = '';

  selectProductPromo(prod) {
    this.selectedProdPromo = prod;
    console.log(prod)
    this.showDialogPromo = true;
  }

  searchDescProd(id, myArray) {
    for (const entry of myArray) {
      if (entry._id === id) {
        return entry.nombre;
      }
    }
  }

  searchPrecioProdPromo(id, myArray) {
    for (const entry of myArray) {
      if (entry.id === id) {
        return entry.precio_venta;
      }
    }
  }

  public ngOnInitPromos() {
    this.pathsTypePromos = [];
    this.lstProdPromo = [];
    this.promocionService.getAll().subscribe(data => {
      for (let entry of data) {
        if (entry.tipoPromo.localeCompare('AP') === 0 && entry.estado === 1) {
          for (let p of entry.productosV[0].p) {
            p.id = this.searchDescProd(p.id, this.lstProductos)
          }
          for (let r of entry.productosV[1].r) {
            r.id = this.searchDescProd(r.id, this.lstProductos)
          }
          this.lstProdPromo = [...this.lstProdPromo, entry];
        } else {
          this.pathsTypePromos = [...this.pathsTypePromos, entry];
        }
      }
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



