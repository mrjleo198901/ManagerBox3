import { Component, OnInit, ViewChild, KeyValueDiffer, KeyValueDiffers, DoCheck } from '@angular/core';
import { FormBuilder, FormControl, NgModel, FormGroup, Validators } from '@angular/forms';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { MessageGrowlService } from '../../services/message-growl.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { CoverService } from '../../services/cover.service';
import { PersonalService } from '../../services/personal.service';
import { FormatterService } from '../../services/formatter.service';
import { ProductoService } from '../../services/producto.service';
import { ValidateService } from '../../services/validate.service';
import { SelectItem, Listbox } from 'primeng/primeng';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.component.html',
  styleUrls: ['./administrar.component.css']
})
export class AdministrarComponent implements OnInit {

  settingsC = {
    mode: 'external',
    noDataMessage: 'No existen registros',
    columns: {
      nombre: {
        title: 'Nombre',
        width: '24%'
      },
      numMujeres: {
        title: 'Nro. Mujeres',
        width: '8%'
      },
      precioMujeres: {
        title: 'Precio Mujeres',
        width: '8%'
      },
      productoMujeres: {
        title: 'Producto Mujeres',
        width: '14%'
      },
      cantProdMujeres: {
        title: 'Cant. Prod. Mujeres',
        width: '8%'
      },
      numHombres: {
        title: 'Nro. Hombres',
        width: '8%'
      },
      precioHombres: {
        title: 'Precio Hombres',
        width: '8%'
      },
      productoHombres: {
        title: 'Producto Hombres',
        width: '14%'
      },
      cantProdHombres: {
        title: 'Cant. Prod. Hombres',
        width: '8%'
      }
    },
    actions: {
      // columnTitle: '',
      add: true,
      edit: false,
      delete: true
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  }
  sourceC: LocalDataSource = new LocalDataSource();
  showDialogCC = false;
  showDialogCU = false
  objCover = {
    nombre: '',
    numMujeres: 1,
    precioMujeres: 0,
    productoMujeres: '',
    cantProdMujeres: 1,
    numHombres: 1,
    precioHombres: 0,
    productoHombres: '',
    cantProdHombres: 1
  };
  objCoverUpdate = {
    nombre: '',
    numMujeres: 1,
    precioMujeres: 0,
    productoMujeres: '',
    cantProdMujeres: 1,
    numHombres: 1,
    precioHombres: 0,
    productoHombres: '',
    cantProdHombres: 1
  };
  lstProductos: any = [];
  borderStyleProdExistente = '#DADAD2';
  flagProdM = false;
  flagProdH = false;
  sexs = [
    { "name": 'Femenino', "pseudo": "F" },
    { "name": 'Masculino', "pseudo": "M" },
    { "name": 'Ambos', "pseudo": "A" }
  ];
  color = 'primary';
  sexo: string;
  checked = false;
  cantMujeres = 1;
  cantHombres = 1;
  lstCover: any = [];
  nombreProdM;
  nombreProdH;
  widthPanel = '98%';
  onUpdateFlag = false;
  ventasTotales;
  ventasEfectivo = 750;
  ventasTarjeta = 100;
  ventasCheque = 50;
  ventasCredito = 10;
  dineroCaja;
  fondoCaja = 100;
  abonosEfectivo = 200;
  entradas = 80;
  salidas = 30;
  ganancia = 320;
  cantPersonas;
  inMujeres = 48;
  inHombres = 57;
  outMujeres = 12;
  outHombres = 28;
  selected_caja
  lstCajas: any = [];
  currentDateTime;

  @ViewChild('listBoxMU') accessor: Listbox;
  @ViewChild('listBoxMU', { read: NgModel }) model: NgModel;
  differ: any;

  constructor(private messageGrowlService: MessageGrowlService,
    private dialog: MdDialog, private coverService: CoverService,
    private formatterService: FormatterService,
    private productoService: ProductoService,
    private differs: KeyValueDiffers,
    private validateService: ValidateService,
    private personalService: PersonalService,
    private datePipe: DatePipe) {
    this.differ = differs.find([]).create(null);
    this.calcVentas();
    this.calcMoney();
    this.calcPersonas();

    var x = window.innerWidth;
    this.onRzOnInit(x);
  }

  ngOnInit() {
    this.coverService.getAll().subscribe(data => {
      this.productoService.getAll().subscribe(p => {
        this.lstProductos = [];
        for (let entry of p) {
          let aux = {
            label: entry.nombre,
            value: entry
          }
          this.lstProductos.push(aux);
        }
        this.lstCover = [];
        for (let entry of data) {
          let aux = {
            _id: entry._id,
            nombre: entry.nombre,
            numMujeres: entry.numMujeres,
            precioMujeres: parseFloat(entry.precioMujeres).toFixed(2),
            productoMujeres: entry.productoMujeres,
            cantProdMujeres: entry.cantProdMujeres,
            numHombres: entry.numHombres,
            precioHombres: parseFloat(entry.precioHombres).toFixed(2),
            productoHombres: entry.productoHombres,
            cantProdHombres: entry.cantProdHombres
          };
          if (aux.productoMujeres == undefined) {
            aux.cantProdMujeres = '';
          } else {
            aux.productoMujeres = aux.productoMujeres.nombre;
          }
          if (aux.productoHombres == undefined) {
            aux.cantProdHombres = '';
          } else {
            aux.productoHombres = aux.productoHombres.nombre;
          }
          this.lstCover.push(aux);
        }
        this.sourceC = new LocalDataSource();
        this.sourceC.load(this.lstCover);
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err);
    });

    this.currentDateTime = this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss');
    //Get Cajas
    this.personalService.getByTipo('59a054715c0bf80b7cab502d').subscribe(data => {
      if (data.length > 0) {
        this.lstCajas = data;
        console.log(this.lstCajas);
        this.selected_caja = 'Todas';
      }
    }, err => {
      console.log(err);
    })

  }

  setCursorAddC() {
    setTimeout(function () {
      document.getElementById('nombre').focus();
    }, 0);
    this.setOriginalColorsCover();
    this.checked = false;
    this.flagProdM = false;
    this.flagProdH = false;
    this.objCover = {
      nombre: '',
      numMujeres: 1,
      precioMujeres: 0,
      productoMujeres: undefined,
      cantProdMujeres: 1,
      numHombres: 1,
      precioHombres: 0,
      productoHombres: undefined,
      cantProdHombres: 1
    };
    this.widthPanel = '98%';
  }

  onUpdateC(event: any) {
    this.onUpdateFlag = true;
    this.setOriginalColorsCoverU();
    this.objCoverUpdate = event.data;
    if (this.objCoverUpdate.productoMujeres !== undefined) {
      this.flagProdM = true;
      //this.objCoverUpdate.productoMujeres = this.lstProductos[1].value;
      //console.log(this.lstProductos[1].value);
      this.productoService.getByNombre(this.objCoverUpdate.productoMujeres).subscribe(data => {
        this.objCoverUpdate.productoMujeres = data[0];
        console.log(this.objCoverUpdate);
        this.accessor.registerOnChange = (fn: (val: any) => void) => {
          this.accessor.onModelChange = (val) => {
            if (val && val.groupId === 0) {
              this.model.control.setValue(this.model.value);
              return;
            }
            return fn(val);
          };
        }

      }, err => {
        console.log(err)
      })
    }
    if (this.objCoverUpdate.productoHombres !== undefined) {
      this.flagProdH = true;
    }
    if (JSON.stringify(this.objCoverUpdate.productoMujeres) == JSON.stringify(this.objCoverUpdate.productoHombres)
      && this.objCoverUpdate.cantProdMujeres == this.objCoverUpdate.cantProdHombres
      && this.objCoverUpdate.numMujeres == this.objCoverUpdate.numHombres
      && this.objCoverUpdate.precioMujeres == this.objCoverUpdate.precioHombres) {

      this.checked = false;
      this.widthPanel = '98%';
    } else {

      this.checked = true;
      this.widthPanel = '48%';
    }
  }

  setCursorUpdateC() {
    setTimeout(function () {
      document.getElementById('nombreU').focus();
    }, 0);
  }

  onDeleteC(event): void {
    this.openDialogCover(event.data);
  }

  openDialogCover(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          this.sourceC.remove(data);
          // remove from database
          this.coverService.delete(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');
          });
        }
      }
    });
  }

  onChangeNombreCover($event) {
    this.objCover.nombre = this.formatterService.toTitleCase(this.objCover.nombre);
  }

  onChangeNombreCoverU($event) {
    this.objCoverUpdate.nombre = this.formatterService.toTitleCase(this.objCoverUpdate.nombre);
  }

  /*onChangeProdM($event) {
    this.nombreProdM = this.objCover.productoMujeres;
  }

  onChangeProdH($event) {
    this.nombreProdH = this.objCover.productoHombres;
  }*/

  onChangeCheckBox($event) {
    if (this.checked) {
      this.widthPanel = '48%';
    } else {
      this.widthPanel = '98%';
    }
  }

  changeProdM($event) {

    if (!this.flagProdM) {
      this.objCover.productoMujeres = '';
      this.objCover.cantProdMujeres = 0;
      this.objCoverUpdate.productoMujeres = '';
      this.objCoverUpdate.cantProdMujeres = 0;
    } else {
      if (this.onUpdateFlag == false) {
        console.log("inside")
        if (this.lstProductos.length > 0) {
          this.objCover.productoMujeres = this.lstProductos[0].value;
          this.objCover.cantProdMujeres = 1;
          this.objCoverUpdate.productoMujeres = this.lstProductos[1].value;
          this.objCoverUpdate.cantProdMujeres = 1;
        }
      }

    }
  }

  changeProdH($event) {
    if (!this.flagProdH) {
      this.objCover.productoHombres = '';
      this.objCover.cantProdHombres = 0;
      this.objCoverUpdate.productoHombres = '';
      this.objCoverUpdate.cantProdHombres = 0;
    } else {
      if (this.lstProductos.length > 0) {
        this.objCover.productoHombres = this.lstProductos[0].value;
        this.objCover.cantProdHombres = 1;
        this.objCoverUpdate.productoHombres = this.lstProductos[0].value;
        this.objCoverUpdate.cantProdHombres = 1;
      }
    }
  }

  saveCover() {
    console.log(this.objCover);
    if (!this.validateService.customValidateCover(this.objCover)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    if (!this.checked) {
      this.objCover.numHombres = this.objCover.numMujeres;
      this.objCover.precioHombres = this.objCover.precioMujeres;
      this.objCover.cantProdHombres = this.objCover.cantProdMujeres;
      this.objCover.productoHombres = this.objCover.productoMujeres;
    }
    this.coverService.register(this.objCover).subscribe(data => {
      this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
      this.ngOnInit();
      this.showDialogCC = false;
    }, err => {
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
      console.log(err);
    })
  }

  updateCover() {

  }

  plusMan() {
    if (this.objCover.numHombres < 100)
      this.objCover.numHombres++;
  }

  lessMan() {
    if (this.objCover.numHombres > 1)
      this.objCover.numHombres--;
  }

  plusWoman() {
    if (this.objCover.numMujeres < 100)
      this.objCover.numMujeres++;
  }

  lessWoman() {
    if (this.objCover.numMujeres > 1)
      this.objCover.numMujeres--;
  }

  plusCantProdM() {
    if (this.objCover.cantProdMujeres < 100)
      this.objCover.cantProdMujeres++;
  }

  lessCantProdM() {
    if (this.objCover.cantProdMujeres > 1)
      this.objCover.cantProdMujeres--;
  }

  plusCantProdH() {
    if (this.objCover.cantProdHombres < 100)
      this.objCover.cantProdHombres++;
  }

  lessCantProdH() {
    if (this.objCover.cantProdHombres > 1)
      this.objCover.cantProdHombres--;
  }

  setOriginalColorsCover() {
    document.getElementById("nombre").style.borderColor = "#DADAD2";
  }

  setOriginalColorsCoverU() {
    document.getElementById("nombreU").style.borderColor = "#DADAD2";
  }
  /*Corte Caja*/
  calcVentas() {
    this.ventasTotales = this.ventasEfectivo + this.ventasTarjeta + this.ventasCheque + this.ventasCredito;
  }

  calcMoney() {
    this.dineroCaja = this.fondoCaja + this.abonosEfectivo + this.entradas - this.salidas + this.ventasEfectivo;
  }

  calcPersonas() {
    this.cantPersonas = this.inMujeres + this.inHombres - this.outMujeres - this.outHombres;
  }

  onChangeCaja($event) {
    console.log(this.selected_caja)
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
