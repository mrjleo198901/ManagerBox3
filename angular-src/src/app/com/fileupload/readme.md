#Available parameters
Parameter           	Example Value
url 	                http://localhost/myproject/upload
filterExtensions    	true/false
allowedExtensions 	    ['image/png', 'image/jpg'] or ['jpg', 'png']
calculateSpeed      	true/false
data 	                { userId: 12, isAdmin: true }
customHeaders       	{ 'custom-header': 'value' }
fieldName           	'user[avatar]'
fieldReset 	            true/false
authToken 	            012313asdadklj123123
authTokenPrefix     	'Bearer' (default)



#Basic Example

<!--app.module.ts-->
        
import { UPLOAD_DIRECTIVES } from 'ng2-uploader/ng2-uploader';
...
@NgModule({
  ...
  declarations: [
    UPLOAD_DIRECTIVES
  ],
  ...
})

------------------------------------------------------------------------------------------
<!--app.component.ts -->
import { Component } from '@angular/core';

@Component({
  selector: 'demo-app',
  templateUrl: 'app/demo.html'
})
export class DemoApp {
  uploadFile: any;
  hasBaseDropZoneOver: boolean = false;
  options: Object = {
    url: 'http://localhost/upload'
  };

  handleUpload(data): void {
    if (data && data.response) {
      data = JSON.parse(data.response);
      this.uploadFile = data;
    }
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
}
------------------------------------------------------------------------------------------
<!-- app.component.html -->
<input type="file" 
       ngFileSelect
       [options]="options"
       (onUpload)="handleUpload($event)">

<!-- drag & drop file example-->
<style>
  .file-over { border: dotted 3px red; } /* Default class applied to drop zones on over */
</style>
<div ngFileDrop
     [options]="options"
     (onUpload)="handleUpload($event)"
     [ngClass]="{'file-over': hasBaseDropZoneOver}"
     (onFileOver)="fileOverBase($event)">
</div>

<div>
Response: {{ uploadFile | json }}
</div>
------------------------------------------------------------------------------------------

#Advanced Example

<!--This example show how to use available options and progress.-->

import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html'
})
export class AppDemoComponent implements OnInit {
  private zone: NgZone;
  private options: Object;
  private progress: number = 0;
  private response: any = {};

  ngOnInit() {
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.options = {
      url: 'http://localhost/upload',
      filterExtensions: true,
      allowedExtensions: ['image/png', 'image/jpg'],
      calculateSpeed: true,
      data: {
        userId: 12,
        isAdmin: true
      },
      customHeaders: {
        'custom-header': 'value'
      },
      authToken: 'asd123b123zxc08234cxcv',
      authTokenPrefix: 'Bearer'
    };
  }

  handleUpload(data: any): void {
    this.zone.run(() => {
      this.response = data;
      this.progress = Math.floor(data.progress.percent / 100);
    });
  }
}