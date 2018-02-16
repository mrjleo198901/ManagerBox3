import { Component, OnInit } from '@angular/core';
import { MessageGrowlService } from '../../services/message-growl.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ValidateService } from '../../services/validate.service';
import { Message, SelectItem } from 'primeng/primeng';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs/Subject';
import { ProductoService } from '../../services/producto.service';
import { ClienteService } from '../../services/cliente.service';
import { DecimalPipe } from '@angular/common';
import { TipoProductoService } from '../../services/tipo-producto.service';
import 'jspdf-autotable';
declare let jsPDF;

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
  flagDownload = false;

  constructor(
    private messageGrowlService: MessageGrowlService,
    private formBuilder: FormBuilder,
    private validateService: ValidateService,
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private decimalPipe: DecimalPipe,
    private tipoProductoService: TipoProductoService) {
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
  /* REPORTES*/
  tipo_reportes: any
  lstProds: any[];
  keyNames: any[];
  selecTipoReporte: any;
  lstLabels: any[];
  lstTipoProductos: any[];
  lstLabels1: any[];
  lstClientes: any[];

  generate() {
    var item = {
      "Name": "XYZ",
      "Age": "22",
      "Gender": "Male"
    };
    var doc = new jsPDF();
    var col = ["Details", "Values"];
    var rows = [];

    for (var key in item) {
      var temp = [key, item[key]];
      rows.push(temp);
    }

    doc.autoTable(col, rows);
    var data = doc.output('datauristring')
    document.getElementById('iFramePDF').setAttribute('src', data);

  }

  generateNew() {
    if (!this.validateService.validateTipoReport(this.selecTipoReporte.value)) {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona un tipo de reporte!');
      return false;
    }
    document.getElementById("tipoReport").style.borderColor = "";
    if (!this.validateService.validateParameters(this.lstLabels)) {
      this.messageGrowlService.notify('error', 'Error', 'Selecciona los parámetros del reporte!');
      return false;
    }
    document.getElementById("pnlParameters").style.borderColor = "";
    this.flagDownload = true;
    if (this.selecTipoReporte.value === 1) {
      this.fillPDF1();
    }
    if (this.selecTipoReporte.value === 2) {
      this.fillPDF2();
    }

  }

  data: any;

  fillPDF1() {
    var doc = new jsPDF('p', 'mm', [297, 210]);
    doc.setFontSize(20);
    doc.setTextColor(12, 86, 245);
    doc.text(14, 20, 'Reporte de Productos');
    var cols: any[] = [];
    for (let entry of this.lstLabels) {
      if (entry.active == true)
        cols.push(entry.name)
    }
    if (cols.length > 6) {
      doc = new jsPDF('l', 'mm', [297, 210]);
    }
    var rows = [];
    let i = 0;
    for (let entry of this.lstProds) {
      let ele = [];
      if (this.lstLabels[0].active === true) {
        ele.push(++i);
      }
      if (this.lstLabels[1].active === true) {
        ele.push(entry.nombre);
      }
      if (this.lstLabels[2].active === true) {
        entry.precio_costo = this.decimalPipe.transform(entry.precio_costo, '1.2-2');
        ele.push('$' + entry.precio_costo);
      }
      if (this.lstLabels[3].active === true) {
        entry.precio_venta = this.decimalPipe.transform(entry.precio_venta, '1.2-2');
        ele.push('$' + entry.precio_venta);
      }
      if (this.lstLabels[4].active === true) {
        entry.utilidad = this.decimalPipe.transform(entry.utilidad, '1.2-2');
        ele.push(entry.utilidad + '%');
      }
      if (this.lstLabels[5].active === true) {
        ele.push(entry.cant_existente);
      }
      if (this.lstLabels[6].active === true) {
        ele.push(entry.id_tipo_producto);
      }
      if (this.lstLabels[7].active === true) {
        ele.push(entry.path);
      }
      if (this.lstLabels[8].active === true) {
        entry.contenido = entry.contenido + ' ml';
        ele.push(entry.contenido);
      }
      if (this.lstLabels[9].active === true) {
        ele.push(entry.promocion);
      }
      if (this.lstLabels[10].active === true) {
        ele.push(entry.subproductoV);
      }
      rows.push(ele)
    }
    doc.autoTable(cols, rows,
      {
        startY: 25,
        showHeader: 'firstPage',
        columnStyles: { Path: { columnWidth: 'auto' } }
      });

    this.data = doc.output('datauristring')
    document.getElementById('iFramePDF').setAttribute('src', this.data);
  }

  fillPDF2() {
    console.log(this.lstClientes)
    var doc = new jsPDF('p', 'mm', [297, 210]);
    doc.setFontSize(20);
    doc.setTextColor(12, 86, 245);
    doc.text(20, 20, 'Reporte de Clientes');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    var cols: any[] = [];
    for (let entry of this.lstLabels) {
      if (entry.active == true)
        cols.push(entry.name)
    }
    if (cols.length > 6) {
      doc = new jsPDF('l', 'mm', [297, 210]);
    }
    var rows = [];
    let i = 0;
    for (let entry of this.lstClientes) {
      let ele = [];
      if (this.lstLabels[0].active === true) {
        ele.push(++i);
      }
      if (this.lstLabels[1].active === true) {
        ele.push(entry.cedula);
      }
      if (this.lstLabels[2].active === true) {
        ele.push(entry.nombre);
      }
      if (this.lstLabels[3].active === true) {
        ele.push(entry.apellido);
      }
      if (this.lstLabels[4].active === true) {
        ele.push(entry.telefono);
      }
      if (this.lstLabels[5].active === true) {
        ele.push(entry.correo);
      }
      if (this.lstLabels[6].active === true) {
        ele.push(entry.fecha_nacimiento);
      }
      if (this.lstLabels[7].active === true) {
        ele.push(entry.sexo);
      }
      if (this.lstLabels[8].active === true) {
        entry.contenido = entry.contenido + ' ml';
        ele.push(entry.id_tipo_cliente);
      }
      if (this.lstLabels[9].active === true) {
        ele.push(entry.tarjeta);
      }
      rows.push(ele)
    }
    doc.autoTable(cols, rows);
    this.data = doc.output('datauristring')
    document.getElementById('iFramePDF').setAttribute('src', this.data);
  }

  fillParameters($event) {
    this.flagDownload = false;
    if (this.selecTipoReporte.value === 1) {
      this.fillLstProductos();
    }
    if (this.selecTipoReporte.value === 2) {
      this.fillLstClientes();
    }
  }

  fillLstProductos() {
    this.lstLabels = [];
    this.productoService.getAll().subscribe(data => {
      this.keyNames = [];
      this.lstProds = [];
      this.keyNames = Object.keys(data[0]);
      for (let entry of data) {
        entry.id_tipo_producto = this.searchTipoProdById(entry.id_tipo_producto, this.lstTipoProductos)
        this.lstProds.push(entry);
        if (entry.promocion.length > 0) {
          entry.promocion = this.decimalPipe.transform(entry.promocion[0].precio_venta, '1.2-2');
        } else {
          entry.promocion = '-';
        }
        if (entry.subproductoV.length > 0) {
          let cad = "";
          for (let sub of entry.subproductoV) {
            cad += sub.cantidad + " " + sub.label;
            entry.subproductoV = cad;
          }
        } else {
          entry.subproductoV = '-';
        }
      }
      let index = this.keyNames.findIndex(x => x === '__v');
      if (index > -1) {
        this.keyNames.splice(index, 1);
      }
      for (let entry of this.keyNames) {
        let aux = { label: entry, active: false, name: entry, dataKey: entry }
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

  fillLstClientes() {
    this.lstLabels = [];
    this.clienteService.getAll().subscribe(data => {
      this.keyNames = [];
      this.lstClientes = data;
      this.keyNames = Object.keys(data[0]);

      let index = this.keyNames.findIndex(x => x === '__v');
      if (index > -1) {
        this.keyNames.splice(index, 1);
      }
      for (let entry of this.keyNames) {
        let aux = { label: entry, active: false, name: entry }
        aux.name = aux.name.replace(/[_-]/g, " ");
        aux.name = aux.name.trim();
        aux.name = aux.name.charAt(0).toUpperCase() + aux.name.slice(1);
        if (aux.label.localeCompare('id_tipo_cliente') === 0) {
          aux.name = 'Tipo Cliente';
        }
        this.lstLabels.push(aux);
      }

      console.log(this.lstLabels)
    }, err => {
      console.log(err)
    });
  }

  searchTipoProdById(id, myArray) {
    for (let entry of myArray) {
      if (entry._id === id) {
        return entry.desc_tipo_producto;
      }
    }
  }

  downloadAsPDF() {
    //this.doc.save('a4.pdf');
    console.log(this.data)
  }

  ngOnInitProds() {
    this.tipo_reportes = [];
    this.tipo_reportes = [
      { label: 'Selecciona un tipo...', value: 0 },
      { label: 'Productos', value: 1 },
      { label: 'Clientes', value: 2 },
      { label: 'Ventas', value: 3 },
      { label: 'Personal', value: 4 }];
    this.selecTipoReporte = this.tipo_reportes[0];
    this.tipoProductoService.getAll().subscribe(tp => {
      this.lstTipoProductos = tp;
    }, err => {
      console.log(err);
    });
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