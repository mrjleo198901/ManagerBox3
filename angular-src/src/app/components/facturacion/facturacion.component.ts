import { Component, OnInit } from '@angular/core';

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

  constructor() {
    this.paths[0] = "assets/img/marcas/cervezas/1.png";
    this.paths[1] = "assets/img/marcas/cervezas/2.png";
    this.paths[2] = "assets/img/marcas/cervezas/3.png";
    this.paths[3] = "assets/img/marcas/cervezas/4.png";
    this.paths[4] = "assets/img/marcas/cervezas/5.png";
    this.paths[5] = "assets/img/marcas/cervezas/6.png";
    this.paths[6] = "assets/img/marcas/cervezas/7.png";
    this.paths[7] = "assets/img/marcas/cervezas/8.png";
    this.paths[8] = "assets/img/marcas/cervezas/9.png";
    this.paths[9] = "assets/img/marcas/cervezas/10.png";

    this.paths[10] = "assets/img/marcas/cervezas/1.png";
    this.paths[11] = "assets/img/marcas/cervezas/2.png";
    this.paths[12] = "assets/img/marcas/cervezas/3.png";
    this.paths[13] = "assets/img/marcas/cervezas/4.png";
    this.paths[14] = "assets/img/marcas/cervezas/5.png";
    this.paths[15] = "assets/img/marcas/cervezas/6.png";
    this.paths[16] = "assets/img/marcas/cervezas/7.png";
    this.paths[17] = "assets/img/marcas/cervezas/8.png";
    this.paths[18] = "assets/img/marcas/cervezas/9.png";
    this.paths[19] = "assets/img/marcas/cervezas/10.png";
  }

  ngOnInit() {
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

