import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { TipoProductoService } from '../../services/tipo-producto.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  paths: { path: string, tipoProducto: string, nombre: string }[] = [];
  pathsType: { path: string, tipoProducto: string, nombre: string }[] = [];
  selectedProductos;
  showDialogConfirmar = false;
  cardNumber: String;
  mapTP = new Map();
  public tabs: Array<any> = [];
  flagProdSeleccionados;
  position = 'below';
  listaSize = false;

  change($event) {
    //alert($event)
  }

  constructor(
    private productoService: ProductoService,
    private tipoProductoService: TipoProductoService) {

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
          let aux = { path: entry.path, tipoProducto: entry.id_tipo_producto, nombre: entry.nombre };
          this.paths[index] = aux;
          index++;
        }

        this.pathsType = [];
        let tipo = this.mapTP.get(0);
        let ind = 0;
        for (let entry of this.paths) {
          if (entry.tipoProducto === tipo) {
            let aux = { path: entry.path, tipoProducto: entry.tipoProducto, nombre: entry.nombre };
            this.pathsType[ind] = aux;
            ind++;
          }
        }

      }, err => {
        console.log(err);
      });


    }, err => {
      console.log(err);
      return false;
    })
  }

  ngOnInit() {
    this.selectedProductos = [];
    this.flagProdSeleccionados = false;
  }

  addProd(i) {
    this.selectedProductos[i].cantidad = this.selectedProductos[i].cantidad + 1;
  }

  lessProd(i) {
    if (this.selectedProductos[i].cantidad > 1)
      this.selectedProductos[i].cantidad = this.selectedProductos[i].cantidad - 1;
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
    /*if (index == 0) {
      pad = "0px";
    }*/
    return pad;
  }

  eventEmitDoubleClick($event, i) {
    this.flagProdSeleccionados = true;
    let aux = {
      path: this.pathsType[i].path,
      tipoProducto: this.pathsType[i].tipoProducto,
      nombre: this.pathsType[i].nombre,
      cantidad: 1
    };
    var indexOfInserted = this.selectedProductos.findIndex(i => i.nombre === aux.nombre);
    if (indexOfInserted == -1) {
      this.selectedProductos.push(aux);
    } else {
      this.addProd(indexOfInserted);
    }
    /*let a = this.selectedProductos[i];
    if (n > 1) {
      var indexOfInserted = this.selectedProductos.findIndex(i => i.nombre === a.nombre);
      console.log(indexOfInserted)
    }*/
  }

  passIndex(i) {
    //console.log(i)
  }

  loadLogos(i) {
    this.pathsType = [];
    let tipo = this.mapTP.get(i);
    let index = 0;
    for (let entry of this.paths) {
      if (entry.tipoProducto === tipo) {
        let aux = { path: entry.path, tipoProducto: entry.tipoProducto, nombre: entry.nombre };
        this.pathsType[index] = aux;
        index++;
      }
    }
    // console.log(this.pathsType)
  }
}

