import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  paths = [];
  cant1: number;
  cant2: number;
  cant3: number;
  cant4: number;
  showDialogConfirmar = false;
  cardNumber: String;

  change($event) {
    //alert($event)
  }

  constructor(private productoService: ProductoService) {
    /*this.paths[0] = "assets/img/marcas/cervezas/1.png";
    this.paths[1] = "assets/img/marcas/cervezas/2.png";*/
    this.productoService.getAll().subscribe(tp => {
      let index = 0;

      for (let entry of tp) {
        console.log("../../back-end/uploads" + entry.path)
        this.paths[index] = entry.path;
        index++;
      }
    }, err => {
      console.log(err);
      return false;
    });
  }

  ngOnInit() {
    console.log(this.paths)
    this.cant1 = 1;
    this.cant2 = 1;
    this.cant3 = 1;
    this.cant4 = 1;
  }

  addProd1() {
    this.cant1++;
  }
  addProd2() {
    this.cant2++;
  }
  addProd3() {
    this.cant3++;
  }
  addProd4() {
    this.cant4++;
  }

  lessProd1() {
    if (this.cant1 > 1)
      this.cant1--;
  }
  lessProd2() {
    if (this.cant2 > 1)
      this.cant2--;
  }
  lessProd3() {
    if (this.cant3 > 1)
      this.cant3--;
  }
  lessProd4() {
    if (this.cant4 > 1)
      this.cant4--;
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
  eventEmitDoubleClick($event) {
    console.log("asdasd")
  }
  passIndex(i) {
    console.log(i)
  }
}

