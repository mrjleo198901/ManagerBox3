import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
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

}
