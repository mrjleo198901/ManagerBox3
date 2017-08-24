import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'app-image-render',
  /*template: `<div class="example-tooltip-host" mdTooltip={{renderValue}} [mdTooltipPosition]="position">
                  <img [src]="renderValue" style= "width:50%"/>
             </div>`,*/
  //template: `<i class="fa fa-picture-o fa-lg" aria-hidden="true" (click)="openDialog()"></i>`,
  template: `<template #toolTipTemplate><img src={{renderValue}} width="100%"/></template>
             <a href="#" [tooltipHtml]="toolTipTemplate" tooltipPlacement="top" tooltipAnimation=false>
                <i class="fa fa-picture-o fa-lg" aria-hidden="true" (click)="openDialog()"></i>
             </a>`
})
export class ImageRenderComponent implements OnInit {

  public renderValue;
  position = 'below';
  @Input() value;

  constructor(public dialog: MdDialog) { }

  ngOnInit() {
    this.renderValue = this.value;
  }
}

