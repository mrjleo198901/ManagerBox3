import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-subprod-render',
  template: `{{ renderValue }}`
})
export class SubprodRenderComponent implements OnInit {

  public renderValue;
  @Input() value;

  constructor() { }

  ngOnInit() {
    this.renderValue = [];
    let fila = '';
    for (let entry of this.value) {
      fila += '-' + entry.nombre + ' ' + entry.cantidad + ' ';
      this.renderValue = fila;
    }
  }

}
