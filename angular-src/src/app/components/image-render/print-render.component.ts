import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { DecimalPipe, DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-print-render',
  template: `<i (click)="print()" class="fa fa-print fa-lg" style="color: #1E6AC0; cursor:pointer;"
             tooltip='Imprimir Factura' tooltipPlacement="top" aria-hidden="true"></i>`
})
export class PrintRenderComponent implements OnInit {

  public renderValue: any;
  position = 'below';
  @Input() value;
  lstConsumo: any[] = [];
  totalPagar = 0;

  constructor(
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private slicePipe: SlicePipe) { }

  ngOnInit() {
    this.renderValue = this.value;
  }

  print() {
    console.log(this.renderValue);
    this.fillLstConsumo(this.renderValue.detalleFacturaV);
    this.fillFP(this.renderValue.formaPago);
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open(' ', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    let html = `
    <html>
    <head>
      <style>
        @page { size: auto;  margin: 0mm;};
      </style>
    </head>
    <body onload="window.print();window.close()">${printContents}
    <br><br><br>
    <p style="font-family: Calibri; text-align:center">Documento sin valor tributario</p>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr><td style="padding-left: 20px">&nbsp;Cliente:</td><td>`+ this.renderValue.nombre + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;CI/RUC:</td><td>`+ this.renderValue.ruc + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Teléfono:</td><td>`+ this.renderValue.telefono + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Dirección:</td><td>`+ this.renderValue.direccion + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Cajero:</td><td>JFlores</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Fecha:</td><td>`+ this.renderValue.fecha_emision + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Hora:</td><td>`+ this.renderValue.fecha_emision + `</td></tr>
    </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr colspan="4">====================================</tr>
      <thead>
            <th style="text-align:center;padding-left: 7px; font-weight: normal;">Cant.</th>
            <th style="text-align:left; font-weight: normal;">Detalle</th>
            <th style="text-align:left; font-weight: normal;">Pu.</th>
            <th style="text-align:left; font-weight: normal;">Total</th>
      </thead> 
      <td colspan="4">=========================================</td>
      <tbody>
        `;

    for (let c of this.lstConsumo) {
      html += `<tr><td style="padding-left: 10px; text-align:center;">` + c.cantidad + `</td>
          <td style="margin-right: -10px">`+ this.slicePipe.transform(c.descripcion, 0, 13) + `</td>
          <td style="margin-right: -10px">`+ this.decimalPipe.transform(c.precio_venta, '1.2-2') + `</td>
          <td style="margin-right: -10px">`+ this.decimalPipe.transform(c.total, '1.2-2') + `</td></tr>`
    }

    html += ` 
      </tbody>
    </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr colspan="4">====================================</tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal 12% IVA:</td><td style="padding-right: 120px">`+ this.decimalPipe.transform(this.totalPagar / 1.12, '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal 0% IVA:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal Excento IVA:</td><td>`+ this.decimalPipe.transform(this.totalPagar / 1.12, '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal No Obj. IVA:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Descuento:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Subtotal:</td><td>`+ this.decimalPipe.transform(this.totalPagar / 1.12, '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;ICE:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;IVA 12%:</td><td>`+ this.decimalPipe.transform(this.totalPagar - (this.totalPagar / 1.12), '1.2-2') + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Propina:</td><td>0.00</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Valor Total:</td><td>`+ this.decimalPipe.transform(this.totalPagar, '1.2-2') + `</td></tr>
    </table>
    <td colspan="4">====================================</td>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">`;
    let i = 0;
    for (let c of this.formasPagoFact) {
      html += `<tr>`;
      if (i == 0) {
        html += `<td style="padding-left: 20px">Forma de pago:</td>`;
      } else {
        html += `<td style="padding-left: 20px">&nbsp;</td>`;
      }
      html += `<td>` + c.desc + `</td>
                <td style="text-align: right; padding-right: 20px">` + this.decimalPipe.transform(c.valor, '1.2-2') + `</td>
              </tr>`
      i++;
    }

    html += ` </table>
    <table cellpadding="0" class="table table-striped" style="width:100%;font-family: Calibri;">
      <tr><td style="padding-left: 20px">&nbsp;Total items:</td><td>`+ this.lstConsumo.length + `</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Caja Nro.:</td><td>2</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Id. Transacción:</td><td style="font-size: 13px">5a8786bf49dd4d323c28d26a</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Impresor:</td><td>Epson TM-U220D</td></tr>
      <tr><td style="padding-left: 20px">&nbsp;Serie Nro.:</td><td>P3QF303046</td></tr>
      
    </table>
    <td colspan="4">====================================</td>
    <p style="font-family: Calibri; text-align:center; padding-left: 20px; padding-right: 20px">
      Revisa tu factura electrónica ingresando
      a la siguiente dirección:
      www.riobytes.com/managerbox<br>
      User: 0502926819<br>
      Pass: 0502926819<br>
      Gracias por tu compra
    </p>
    <td colspan="4">====================================</td>

    </body>

    </html>`;
    popupWin.document.write(html);
    popupWin.document.close();


  }

  fillLstConsumo(detalleFacturaV) {
    this.lstConsumo = [];
    this.totalPagar = 0;
    for (let entry of detalleFacturaV) {
      let aux = {
        descripcion: entry.descripcion,
        precio_venta: entry.precio_venta,
        total: entry.total,
        cantidad: entry.cantidad,
        fecha: entry.fecha
      }
      this.totalPagar += parseFloat(aux.total);
      this.lstConsumo.push(aux);
    }
  }

  formasPagoFact: any[];
  fillFP(formaPago) {
    this.formasPagoFact = [];
    if (formaPago.cheque > 0) {
      let aux = { desc: 'Cheque', valor: formaPago.cheque };
      this.formasPagoFact.push(aux);
    }
    if (formaPago.credito > 0) {
      let aux = { desc: 'Crédito', valor: formaPago.credito };
      this.formasPagoFact.push(aux);
    }
    if (formaPago.efectivo > 0) {
      let aux = { desc: 'Efectivo', valor: formaPago.efectivo };
      this.formasPagoFact.push(aux);
    }
    if (formaPago.tarjeta > 0) {
      let aux = { desc: 'Tarjeta', valor: formaPago.tarjeta };
      this.formasPagoFact.push(aux);
    }
  }

}