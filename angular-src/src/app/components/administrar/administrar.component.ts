import { Component, OnInit, ViewChild, KeyValueDiffer, KeyValueDiffers, DoCheck } from '@angular/core';
import { FormBuilder, FormControl, NgModel, FormGroup, Validators } from '@angular/forms';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { MessageGrowlService } from '../../services/message-growl.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { CoverService } from '../../services/cover.service';
import { FormatterService } from '../../services/formatter.service';
import { ProductoService } from '../../services/producto.service';
import { ValidateService } from '../../services/validate.service';
import { SelectItem, Listbox } from 'primeng/primeng';

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
        width: '15%'
      },
      numMujeres: {
        title: 'Nro. Mujeres',
        width: '25%'
      },
      precioMujeres: {
        title: 'Precio Mujeres',
        width: '25%'
      },
      productoMujeres: {
        title: 'Producto Mujeres',
        width: '17.5%'
      },
      cantProdMujeres: {
        title: 'Cant. Prod. Mujeres',
        width: '17.5%'
      },
      numHombres: {
        title: 'Nro. Hombres',
        width: '25%'
      },
      precioHombres: {
        title: 'Precio Hombres',
        width: '25%'
      },
      productoHombres: {
        title: 'Producto Hombres',
        width: '17.5%'
      },
      cantProdHombres: {
        title: 'Cant. Prod. Hombres',
        width: '17.5%'
      }
    },
    actions: {
      // columnTitle: '',
      add: true,
      edit: true,
      delete: true
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  }
  sourceC: LocalDataSource = new LocalDataSource();
  showDialogCC = true;
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

  @ViewChild('listBox') accessor: Listbox;
  @ViewChild('listBox', { read: NgModel }) model: NgModel;
  differ: any;

  constructor(private messageGrowlService: MessageGrowlService,
    private dialog: MdDialog, private coverService: CoverService,
    private formatterService: FormatterService,
    private productoService: ProductoService,
    private differs: KeyValueDiffers,
    private validateService: ValidateService) {
    this.differ = differs.find([]).create(null);
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
            productoMujeres: entry.productoMujeres.nombre,
            cantProdMujeres: entry.cantProdMujeres,
            numHombres: entry.numHombres,
            precioHombres: parseFloat(entry.precioHombres).toFixed(2),
            productoHombres: entry.productoHombres.nombre,
            cantProdHombres: entry.cantProdHombres
          };
          this.lstCover.push(aux);
        }
        this.sourceC = new LocalDataSource();
        this.sourceC.load(this.lstCover);

        /*this.objCover.productoMujeres = this.lstProductos[0].value;
        this.objCover.productoHombres = this.lstProductos[0].value;
        this.objCoverUpdate.productoMujeres = this.lstProductos[0].value;
        this.objCoverUpdate.productoHombres = this.lstProductos[0].value;
        this.accessor.registerOnChange = (fn: (val: any) => void) => {
          this.accessor.onModelChange = (val) => {
            if (val && val.groupId === 0) {
              this.model.control.setValue(this.model.value);
              return;
            }
            return fn(val);
          };
        }*/
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err);
    });
  }

  setCursorAddC() {
    setTimeout(function () {
      document.getElementById('nombre').focus();
    }, 0);
    this.setOriginalColorsCover();
  }

  onUpdateC(event: any) {
    this.setOriginalColorsCoverU()
    this.objCoverUpdate = event.data;
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

  changeProdM($event) {
    if (!this.flagProdM) {
      this.objCover.productoMujeres = '';
      this.objCoverUpdate.productoMujeres = '';
    } else {
      if (this.lstProductos.length > 0) {
        this.objCover.productoMujeres = this.lstProductos[0].value;
        this.objCoverUpdate.productoMujeres = this.lstProductos[0].value;
      }
    }
  }

  changeProdH($event) {
    if (!this.flagProdH) {
      this.objCover.productoHombres = '';
      this.objCoverUpdate.productoHombres = '';
    } else {
      if (this.lstProductos.length > 0) {
        this.objCover.productoHombres = this.lstProductos[0].value;
        this.objCoverUpdate.productoHombres = this.lstProductos[0].value;
      }
    }
  }

  saveCover() {
    if (!this.validateService.customValidateCover(this.objCover)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    /*if (this.flagProdM) {
      let prod: any = this.objCover.producto
      this.objCover.producto = prod._id;
    }*/
    console.log(this.objCover)
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
    document.getElementById("precio").style.borderColor = "#DADAD2";
    this.borderStyleProdExistente = '#DADAD2';
  }

  setOriginalColorsCoverU() {
    document.getElementById("nombreU").style.borderColor = "#DADAD2";
    document.getElementById("precioU").style.borderColor = "#DADAD2";
    this.borderStyleProdExistente = '#DADAD2';
  }

}
