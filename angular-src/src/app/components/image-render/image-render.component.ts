import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-image-render',
  /*template: `<div class="example-tooltip-host" mdTooltip={{renderValue}} [mdTooltipPosition]="position">
                  <img [src]="renderValue" style= "width:50%"/>
             </div>`*/
  //template: `<img src={{renderValue}} width="100%"/>`
  template: `<ng-template #toolTipTemplate><img src={{renderValue}} width="100%"/></ng-template>
             <a href="#" [tooltipHtml]="toolTipTemplate" tooltipPlacement="top" tooltipAnimation=false>
                <i class="fa fa-picture-o fa-lg" aria-hidden="true"></i>
             </a>`
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

