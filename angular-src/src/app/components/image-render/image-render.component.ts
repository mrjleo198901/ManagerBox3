import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-image-render',
  //template: `<img [src]="renderValue" />`,
  template: `<div class="example-tooltip-host" mdTooltip={{renderValue}} [mdTooltipPosition]="position">
  <img [src]="renderValue" /></div>`,
  styleUrls: ['./image-render.component.css']
})
export class ImageRenderComponent implements OnInit {

  public renderValue;
  position = 'below';
  @Input() value;

  constructor() { }

  ngOnInit() {
    this.renderValue = this.value;
  }

}
