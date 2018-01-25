import { Component, OnInit } from '@angular/core';
import { MessageGrowlService } from '../../services/message-growl.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ValidateService } from '../../services/validate.service';
import { Message, SelectItem } from 'primeng/primeng';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs/Subject';
import * as jsPDF from 'jspdf';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  msgs: Message[] = [];
  userform: FormGroup;
  submitted: boolean;
  genders: SelectItem[];
  description: string;
  nombre;
  public static updateUserStatus: Subject<boolean> = new Subject();

  constructor(
    private messageGrowlService: MessageGrowlService,
    private formBuilder: FormBuilder,
    private validateService: ValidateService,
    private productoService: ProductoService) {
    InventarioComponent.updateUserStatus.subscribe(res => {
      console.log("entrooooooo")
    });

    var x = window.innerWidth;
    this.onRzOnInit(x);

    var x = window.innerWidth;
    this.onRzOnInit(x);
  }

  ngOnInit() {
    this.userform = this.formBuilder.group({
      'firstname': new FormControl('', Validators.required),
      'lastname': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      'description': new FormControl(''),
      'gender': new FormControl('', Validators.required)
    });

    this.genders = [];
    this.genders.push({ label: 'Select Gender', value: '' });
    this.genders.push({ label: 'Male', value: 'Male' });
    this.genders.push({ label: 'Female', value: 'Female' });

    this.ngOnInitProds();
  }

  onSubmit(value: string) {
    console.log(value)
    this.submitted = true;
    this.msgs = [];
    this.msgs.push({ severity: 'info', summary: 'Success', detail: 'Form Submitted' });
  }

  get diagnostic() {
    return JSON.stringify(this.userform.value);
  }

  showInfo() {
    this.messageGrowlService.notify('info', 'some component', 'ngOnInit was called!');
  }

  showWarn() {
    this.messageGrowlService.notify('warn', 'some component', 'ngOnInit was called!');
  }

  showError() {
    this.messageGrowlService.notify('error', 'some component', 'ngOnInit was called!');
  }

  showSuccess() {
    this.messageGrowlService.notify('success', 'some component', 'ngOnInit was called!');
  }


  //dynamic Tabs
  public angular2TabsExample: Array<any> = [
    { title: 'Angular Tab 1', content: 'Angular 2 Tabs are navigable windows, each window (called tab) contains content', disabled: false, removable: true },
    { title: 'Angular Tab 2', content: 'generally we categorize contents depending on the theme', disabled: false, removable: true },
    { title: 'Angular Tab (disabled) X', content: 'Angular 2 Tabs Content', disabled: true, removable: true }
  ];
  //on select a tab do something
  public doOnTabSelect(currentTab: any) {
    console.log("doOnTabSelect" + currentTab);
  };
  //on remove Tab do something
  public removeThisTabHandler(tab: any) {
    console.log('Remove Tab handler' + tab);
  };

  openCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_oi0sKPJYLGjdvOXOM8tE8cMa',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    handler.open({
      name: 'ManagerBox',
      description: 'Pago en Línea',
      amount: 20
    });

  }
  /* REPORTE DE PRODUCTOS*/
  tipo_reportes: any
  lstProds: any[];
  keyNames: any[];
  selecTipoReporte: any;
  lstLabels: any[];
  lstProdsActive: any[];

  download() {
    let name = "Prueba";
    var doc = new jsPDF({
      unit: "mm",
      format: "letter"
    });
    let margins = {
      top: 20,
      bottom: 60,
      left: 20,
      width: 522
    };
    doc.setFontSize(20);
    doc.setTextColor(12, 86, 245);
    doc.text(20, 20, 'Reporte de Productos');
    //doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let source = '<table>' +
      '<tr>' +
      '<th>' + name + '</th>' +
      '<th>Last name</th>' +
      '</tr>' +
      '<tr>' +
      '<td>John</td>' +
      '<td>Doe</td>' +
      '</tr>' +
      '<tr>' +
      '<td>Jane</td>' +
      '<td>Doe</td>' +
      '</tr>' +
      '</table>'


    doc.fromHTML(
      source,
      margins.left,
      margins.top, {
        'width': margins.width
      },
      function (dispose) {
        //doc.save('Test.pdf');
      }, margins);
    var data = doc.output('datauristring')
    document.getElementById('iFramePDF').setAttribute('src', data);
  }

  generatePDF() {
    this.productoService.getAll().subscribe(data => {
      this.designTable(data);
    }, err => {
      console.log(err)
    });
    console.log(this.lstLabels)
  }

  designTable(data) {
    this.lstProds = [];
    console.log(data);
    this.lstProds = data;
    var doc = new jsPDF();
    var x = 10;
    var y = 20;
    doc.setFontSize(20);
    doc.setTextColor(12, 86, 245);
    doc.text(20, 20, 'Reporte de Productos');

    this.keyNames = Object.keys(data[0]);
    console.log(this.keyNames);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.rect(20, 30, 170, 10, 'S')
    let spc = 10;
    for (let entry of this.keyNames) {
      doc.text(entry, x + spc, 35);
      spc += 20;
    }

    /*doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.rect(x + 10, y + 47.5, 88, 60, 'S')
    doc.line(x + 10, y + 52.5, x + 98, y + 52.5)
    doc.line(x + 10, y + 57.5, x + 98, y + 57.5)
    doc.line(x + 10, y + 62.5, x + 98, y + 62.5)
    doc.line(x + 10, y + 67.5, x + 98, y + 67.5)
    doc.line(x + 10, y + 72.5, x + 98, y + 72.5)
    doc.line(x + 10, y + 77.5, x + 98, y + 77.5)
    doc.line(x + 10, y + 82.5, x + 98, y + 82.5)
    doc.line(x + 10, y + 87.5, x + 98, y + 87.5)
    doc.line(x + 10, y + 92.5, x + 98, y + 92.5)
    doc.line(x + 10, y + 97.5, x + 98, y + 97.5)
    doc.line(x + 10, y + 102.5, x + 98, y + 102.5)
    //verticales
    doc.line(x + 20, y + 47.5, x + 20, y + 107.5)
    doc.line(x + 68, y + 47.5, x + 68, y + 133)
    doc.line(x + 83, y + 47.5, x + 83, y + 133)
    doc.setFontSize(8);
    doc.setFontType("bold");
    doc.text("Nombre", x + 11, y + 51.5);
    doc.text("Apellido", x + 36, y + 51.5);
    doc.text("Ciudad", x + 69, y + 51.5);
    doc.text("Telefono", x + 84, y + 51.5);*/


    var data = doc.output('datauristring')

    document.getElementById('iFramePDF').setAttribute('src', data);
  }

  fillParameters($event) {
    this.lstLabels = [];
    this.lstProdsActive = [];
    if (this.selecTipoReporte.value === 1) {

      this.productoService.getAll().subscribe(data => {
        this.keyNames = [];
        this.lstProds = [];
        this.keyNames = Object.keys(data[0]);
        this.lstProds = data;
        let index = this.keyNames.findIndex(x => x === '__v');
        if (index > -1) {
          this.keyNames.splice(index, 1);
        }
        for (let entry of this.keyNames) {
          let aux = { label: entry, active: false, name: entry }
          aux.name = aux.name.replace(/[_-]/g, " ");
          aux.name = aux.name.trim();
          aux.name = aux.name.charAt(0).toUpperCase() + aux.name.slice(1);
          if (aux.label.localeCompare('id_tipo_producto') === 0) {
            aux.name = 'Tipo producto';
          }
          this.lstLabels.push(aux);
        }
      }, err => {
        console.log(err)
      })

    }
  }

  changeLabel(c){
//console.log(c)
  }

  ngOnInitProds() {
    this.tipo_reportes = [];
    this.tipo_reportes = [
      { label: 'Selecciona un tipo...', value: 0 },
      { label: 'Productos', value: 1 },
      { label: 'Clientes', value: 2 },
      { label: 'Personal', value: 3 }];
    this.selecTipoReporte = this.tipo_reportes[0];
  }
  //Width detection
  textAlignTitle = 'left';

  onResize(event) {
    let x = event.target.innerWidth;
    //console.log(x)
    if (x < 768) {
      this.textAlignTitle = 'center';
    } else {
      this.textAlignTitle = 'left';
    }
  }

  onRzOnInit(x) {
    if (x < 768) {
      this.textAlignTitle = 'center';
    } else {
      this.textAlignTitle = 'left';
    }
  }

}
