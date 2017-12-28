import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-coverprod-render',
  template: `{{ renderValue }}`
})
export class CoverprodRenderComponent implements OnInit {

  public renderValue;
  @Input() value;

  constructor() { }

  ngOnInit() {
    this.renderValue = [];
    let fila = '';
    for (let entry of this.value) {
      fila += '-' + entry.cantidad + ' ' + entry.label + ' ';
      this.renderValue = fila;
    }
  }

}
