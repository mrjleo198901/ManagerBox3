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
import { FacturaService } from '../../services/factura.service';
import { DatePipe } from '@angular/common';
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
  es: any;
  fecha_desde: any;
  fecha_hasta: any;
  flagRangoFechas = false;
  mapUsers: any[] = [];

  constructor(
    private messageGrowlService: MessageGrowlService,
    private formBuilder: FormBuilder,
    private validateService: ValidateService,
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private decimalPipe: DecimalPipe,
    private tipoProductoService: TipoProductoService,
    private facturaService: FacturaService,
    private authService: AuthService,
    private datePipe: DatePipe) {
    InventarioComponent.updateUserStatus.subscribe(res => {
      console.log("entrooooooo")
    });

    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Borrar'
    }
    this.fecha_desde = this.validateService.getDateTimeEsPrimeNG1();
    this.fecha_hasta = this.validateService.getDateTimeEsPrimeNG();

    this.authService.getAll().subscribe(data => {
      this.mapUsers = data;
    }, err => {
      console.log(err);
    })

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

  doDate() {
    let s = '2018-03-12T17:11:17.353Z';
    console.log(this.validateService.isoToString(s));

    /*let cad1 = this.validateService.getTimeStampFromDate(this.fecha_desde);
    let cad2 = this.validateService.getTimeStampFromDate(this.fecha_hasta);

    let obj = { fecha_ini: cad1, fecha_fin: cad2 };
    console.log(obj);
    let obj1 = { fecha_ini: '/*' }
    this.facturaService.getByDateTime(obj).subscribe(data => {

      console.log(data);
    }, err => {
      console.log(err);
    });*/

    /*this.facturaService.getLastOne().subscribe(data => {
      console.log("in")
      console.log(data);
    }, err => {
      console.log(err);
    });*/

  }

  parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
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
  keyNames: any[];
  selecTipoReporte: any;
  lstLabels: any[];
  lstProds: any[];
  lstTipoProductos: any[];
  lstClientes: any[];
  lstVentas: any[];

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
    if (this.selecTipoReporte.value === 3) {
      this.fillPDF3();
      //console.log(this.mapUsers);
    }

  }

  data: any;

  fillPDF1() {
    var doc = new jsPDF('p', 'mm', [297, 210]);
    doc.setFontSize(20);
    doc.setTextColor(12, 86, 245);
    doc.text(14, 20, 'Reporte de Productos');
    let flagHorizontal = false;
    var cols: any[] = [];
    for (let entry of this.lstLabels) {
      if (entry.active == true)
        cols.push({ title: entry.name, dataKey: entry.name });
    };
    let flagPaddingY = false;
    if (cols.length > 6) {
      doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.setTextColor(12, 86, 245);
      doc.text(14, 20, 'Reporte de Productos');
      flagHorizontal = true;
    }
    var rows = [];
    let i = 0;
    for (let entry of this.lstProds) {
      let ele = [];
      if (this.lstLabels[0].active === true) {
        ele["ID"] = ++i;
      }
      if (this.lstLabels[1].active === true) {
        ele["Nombre"] = entry.nombre;
      }
      if (this.lstLabels[2].active === true) {
        entry.precio_costo = this.decimalPipe.transform(entry.precio_costo, '1.2-2');
        ele["Precio costo"] = '$' + entry.precio_costo;
      }
      if (this.lstLabels[3].active === true) {
        entry.precio_venta = this.decimalPipe.transform(entry.precio_venta, '1.2-2');
        ele["Precio venta"] = '$' + entry.precio_venta;
      }
      if (this.lstLabels[4].active === true) {
        entry.utilidad = this.decimalPipe.transform(entry.utilidad, '1.2-2');
        ele["Utilidad"] = entry.utilidad + '%';
      }
      if (this.lstLabels[5].active === true) {
        ele["Cant existente"] = entry.cant_existente;
      }
      if (this.lstLabels[6].active === true) {
        ele["Cant minima"] = entry.cant_minima;
      }
      if (this.lstLabels[7].active === true) {
        ele["Tipo producto"] = entry.id_tipo_producto;
      }
      if (this.lstLabels[8].active === true) {
        ele["Path"] = entry.path;
      }
      if (this.lstLabels[9].active === true) {
        ele["Contenido"] = entry.contenido + 'ml';
      }
      if (this.lstLabels[10].active === true) {
        ele["Promocion"] = entry.promocion;
      }
      if (this.lstLabels[11].active === true) {
        console.log(entry.subproductoV)
        ele["Subproductos"] = entry.subproductoV;
      }
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
      rows.push(ele);
    }

    doc.autoTable(cols, rows,
      {
        startY: 25,
        margin: { top: 16, right: 14, bottom: 20, left: 14 },
        //showHeader: 'firstPage',
        styles: { overflow: 'linebreak' },
        columnStyles: { ID: { columnWidth: 'wrap' }, Nombre: { columnWidth: 'wrap' }, Utilidad: { columnWidth: 'wrap' }, Contenido: { columnWidth: 'wrap' } }
      });
    this.setFooter(doc, flagHorizontal);
    this.data = doc.output('datauristring')
    document.getElementById('iFramePDF').setAttribute('src', this.data);
  }

  fillPDF2() {
    var doc = new jsPDF('p', 'mm', [297, 210]);
    doc.setFontSize(20);
    doc.setTextColor(12, 86, 245);
    doc.text(14, 20, 'Reporte de Clientes');
    let flagHorizontal = false;
    var cols: any[] = [];
    for (let entry of this.lstLabels) {
      if (entry.active == true)
        cols.push(entry.name)
    }
    if (cols.length > 6) {
      doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.setTextColor(12, 86, 245);
      doc.text(14, 20, 'Reporte de Clientes');
      flagHorizontal = true;
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
    doc.autoTable(cols, rows,
      {
        startY: 25,
        margin: { top: 18, right: 14, bottom: 20, left: 14 },
        styles: { overflow: 'linebreak' },
        columnStyles: { ID: { columnWidth: 'wrap' }, Nombre: { columnWidth: 'wrap' }, Utilidad: { columnWidth: 'wrap' }, Contenido: { columnWidth: 'wrap' } }
      });
    this.setFooter(doc, flagHorizontal);
    this.data = doc.output('datauristring')
    document.getElementById('iFramePDF').setAttribute('src', this.data);
  }

  fillPDF3() {
    let cad1 = this.validateService.getTimeStampFromDate(this.fecha_desde);
    let cad2 = this.validateService.getTimeStampFromDate(this.fecha_hasta);
    let obj = { fecha_ini: cad1, fecha_fin: cad2 };
    this.facturaService.getByDateTime(obj).subscribe(data => {
      this.lstVentas = data;
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.setTextColor(12, 86, 245);
      doc.text(14, 20, 'Reporte de Ventas');
      let flagHorizontal = false;
      var cols: any[] = [];
      for (let entry of this.lstLabels) {
        if (entry.active == true)
          cols.push({ title: entry.name, dataKey: entry.name })
      }
      if (cols.length > 6) {
        doc = new jsPDF('l', 'mm', [297, 210]);
        doc.setFontSize(20);
        doc.setTextColor(12, 86, 245);
        doc.text(14, 20, 'Reporte de Ventas');
        flagHorizontal = true;
      }
      var rows = [];
      let i = 0;
      for (let entry of this.lstVentas) {
        let ele = {};
        if (this.lstLabels[0].active === true) {
          ele["ID"] = ++i;
        }
        if (this.lstLabels[1].active === true) {
          ele["Cedula"] = entry.cedula;
        }
        if (this.lstLabels[2].active === true) {
          ele["Nombre"] = entry.nombre;
        }
        if (this.lstLabels[3].active === true) {
          ele["Telefono"] = entry.telefono;
        }
        if (this.lstLabels[4].active === true) {
          ele["Direccion"] = entry.direccion;
        }
        if (this.lstLabels[5].active === true) {
          ele["Fecha emision"] = this.validateService.isoToString(entry.fecha_emision);
        }
        if (this.lstLabels[6].active === true) {
          let us: any = this.mapUsers.filter(function (obj) {
            return obj._id.localeCompare(entry.cajero) === 0;
          });
          ele["Cajero"] = us[0].name;
        }
        if (this.lstLabels[7].active === true) {
          if (entry.formaPago.length > 0) {
            ele["Forma Pago"] = this.formatFP(entry.formaPago[0]);
          } else {
            ele["Forma Pago"] = '-';
          }
        }
        if (this.lstLabels[8].active === true) {
          if (entry.detalleFacturaV.length > 0) {
            ele["Monto Total"] = this.decimalPipe.transform(this.formatDetalle(entry.detalleFacturaV), '1.2-2');
          } else {
            ele["Monto Total"] = this.decimalPipe.transform(0, '1.2-2');
          }
        }
        rows.push(ele)
      }

      doc.autoTable(cols, rows,
        {
          startY: 25,
          showHeader: 'firstPage',
          styles: { overflow: 'linebreak' },
          columnStyles: { Cedula: { columnWidth: 'wrap' }, Telefono: { columnWidth: 'wrap' }, ID: { fillColor: 185, columnWidth: 'wrap' } }
        });
      this.setFooter(doc, flagHorizontal)
      this.data = doc.output('datauristring');
      document.getElementById('iFramePDF').setAttribute('src', this.data);
    }, err => {
      console.log(err);
    })
  }

  fillPDF4() {
    var cols: any[] = [];
    for (let entry of this.lstLabels) {
      if (entry.active == true)
        cols.push({ title: entry.name, dataKey: entry.name })
    }
    console.log(cols);
    var columns = [
      { title: "ID", dataKey: "id" },
      { title: "Name", dataKey: "name" },
      { title: "Country", dataKey: "country" },
    ];
    console.log(columns);
  }

  formatFP(fp) {
    let cad = '';
    if (fp.cheque > 0) {
      cad += 'Cheque:' + fp.cheque + ' ';
    }
    if (fp.credito > 0) {
      cad += 'Crédito:' + fp.credito + ' ';
    }
    if (fp.tarjeta > 0) {
      cad += 'Tarjeta:' + fp.tarjeta + ' ';
    }
    if (fp.efectivo > 0) {
      cad += 'Efectivo:' + fp.efectivo + ' ';
    }
    return cad;
  }

  formatDetalle(detalle) {
    let monto = 0;
    for (let entry of detalle) {
      monto += entry.total;
    }
    return monto;
  }

  setFooter(doc: any, flagHorizontal) {
    var pageCount = doc.internal.getNumberOfPages();
    for (let i = 0; i < pageCount; i++) {
      doc.setFontSize(7);
      doc.setTextColor(0, 0, 0);
      doc.setPage(i);
      if (!flagHorizontal) {
        doc.text(14, 283, 'Generado por ® Managerbox - Gestor de comercios. Todos los derechos reservados. ® Riobytes Solutions 2018 - www.riobytes.com/managerbox');
        doc.text(190, 283, doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount);
      } else {
        doc.text(14, 200, 'Generado por ® Managerbox - Gestor de comercios. Todos los derechos reservados. ® Riobytes Solutions 2018 - www.riobytes.com/managerbox');
        doc.text(277, 200, doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount);
      }
    }
  }

  fillParameters($event) {
    this.flagDownload = false;
    if (this.selecTipoReporte.value === 1) {
      this.flagRangoFechas = false;
      this.fillLstProductos();
    }
    if (this.selecTipoReporte.value === 2) {
      this.flagRangoFechas = false;
      this.fillLstClientes();
    }
    if (this.selecTipoReporte.value === 3) {
      this.fillHeadersVentas();
      this.flagRangoFechas = true;
    }
  }

  fillLstProductos() {
    this.lstLabels = [];
    this.productoService.getAll().subscribe(data => {
      if (data.length > 0) {
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
              cad += '-' + sub.label + " " + sub.cantidad + " ";
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
          if (aux.label.localeCompare('_id') === 0) {
            aux.name = 'ID';
          }
          if (aux.label.localeCompare('id_tipo_producto') === 0) {
            aux.name = 'Tipo producto';
          }
          if (aux.label.localeCompare('subproductoV') === 0) {
            aux.name = 'Subproductos';
          }
          this.lstLabels.push(aux);
        }
      }
    }, err => {
      console.log(err)
    })
  }

  fillLstClientes() {
    this.lstLabels = [];
    this.clienteService.getAll().subscribe(data => {
      if (data.length > 0) {
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
      }
    }, err => {
      console.log(err)
    });
  }

  fillHeadersVentas() {
    this.lstLabels = [];
    this.facturaService.getLastOne().subscribe(data => {
      if (data !== null) {
        this.keyNames = [];
        this.keyNames = Object.keys(data);
        let index = this.keyNames.findIndex(x => x === '__v');
        if (index > -1) {
          this.keyNames.splice(index, 1);
        }
        for (let entry of this.keyNames) {
          if (entry.localeCompare('num_factura') !== 0 && entry.localeCompare('num_autorizacion') !== 0 && entry.localeCompare('ruc') !== 0) {
            let aux = { label: entry, active: false, name: entry }
            aux.name = aux.name.replace(/[_-]/g, " ");
            aux.name = aux.name.trim();
            aux.name = aux.name.charAt(0).toUpperCase() + aux.name.slice(1);
            if (aux.label.localeCompare('_id') === 0) {
              aux.name = 'ID';
            }
            if (aux.label.localeCompare('formaPago') === 0) {
              aux.name = 'Forma Pago';
            }
            if (aux.label.localeCompare('detalleFacturaV') === 0) {
              aux.name = 'Monto Total';
            }
            this.lstLabels.push(aux);
          }
        }
      }
    }, err => {

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