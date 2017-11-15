import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-icon-renderK',
    template: `<ng-template #toolTipTemplate>Haz click para ver detalle de ventas del produto.</ng-template>
               <a href="#" [tooltipHtml]="toolTipTemplate" tooltipPlacement="top" tooltipAnimation=false>
                  <i class="fa fa-bar-chart fa-lg" aria-hidden="true"></i>
               </a>`
  })
  export class IconRenderKComponent implements OnInit {
  
    public renderValue;
    position = 'below';
    @Input() value;
  
    constructor() { }
  
    ngOnInit() {
      this.renderValue = this.value;
    }
  
  }