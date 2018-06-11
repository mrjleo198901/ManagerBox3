import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ValidateService } from '../../services/validate.service';
import { FormatterService } from '../../services/formatter.service';
import { MessageGrowlService } from '../../services/message-growl.service';
import { KardexService } from '../../services/kardex.service';
import { CiudadService } from '../../services/ciudad.service';
import { ComprasService } from '../../services/compras.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../models/proveedor';
import { IconRenderComponent } from '../image-render/icon-render.component';
import { UM } from '../globals';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  constructor(
    private validateService: ValidateService,
    private http: Http,
    private messageGrowlService: MessageGrowlService,
    private fs: FormatterService,
    private decimalPipe: DecimalPipe,
    private slicePipe: SlicePipe,
    private kardexService: KardexService,
    private ciudadService: CiudadService,
    private comprasService: ComprasService,
    private proveedorService: ProveedorService,
    public dialog: MdDialog
  ) { }

  ngOnInit() {
    this.ngOnInitProve();
    this.ngOnInitCompras();
  }

  /*Proveedor*/
  settingsProve = {};
  sourceProve: LocalDataSource = new LocalDataSource();
  showDialogProve = false;
  showDialogProveU = false;
  objProve: Proveedor;
  showRepresentante = false;
  representante = {
    nombre: '',
    telefono: '',
    correo: '',
    descripcion: '',
    value: ''
  }
  filteredCiudades: any[];
  citiesEcu: any[];
  ciudad: string;
  lstProveedores: any[];
  showProveDialog;
  showComprasDetail = false;

  filterCiudad(event) {
    let query = event.query;
    this.filteredCiudades = this.filterCiudadS(query, this.citiesEcu);
  }

  filterCiudadS(query, countries: any[]): any[] {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    for (let i = 0; i < countries.length; i++) {
      let country = countries[i];
      if (country.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    return filtered;
  }

  onChangeNombreProve($event) {
    this.objProve.nombre_proveedor = this.fs.toTitleCase(this.objProve.nombre_proveedor);
  }

  validCorreo = true;
  onChangeEmail($event) {
    this.objProve.correo = this.objProve.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.objProve.correo)) {
      this.messageGrowlService.notify('success', 'Éxito', 'Correo válido!');
      document.getElementById("correo").style.borderLeft = "5px solid #42A948"; /* green */
      this.validCorreo = false;
    }
    else {
      document.getElementById("correo").style.borderLeft = "5px solid #a94442"; /* red */
      this.validCorreo = true;
    }
  }

  onChangeEmailU($event) {
    this.objProve.correo = this.objProve.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.objProve.correo)) {
      this.messageGrowlService.notify('success', 'Éxito', 'Correo válido!');
      document.getElementById("correoU").style.borderLeft = "5px solid #42A948"; /* green */
      this.validCorreo = false;
    }
    else {
      document.getElementById("correoU").style.borderLeft = "5px solid #a94442"; /* red */
      this.validCorreo = true;
    }
  }

  validRuc = true;
  onChangeRuc() {
    if (this.objProve.ruc.length != 13) {
      document.getElementById("rucProve").style.borderLeft = "5px solid #a94442"; /* red */
      this.validRuc = true;
    } else {
      if (!this.validateService.validarRucCedula(this.objProve.ruc)) {
        this.messageGrowlService.notify('error', 'Error', 'Ruc inválido!');
        document.getElementById("rucProve").style.borderLeft = "5px solid #a94442"; /* red */
        this.validRuc = true;
      } else {
        this.messageGrowlService.notify('success', 'Éxito', 'Ruc válido!');
        document.getElementById("rucProve").style.borderLeft = "5px solid #42A948"; /* green */
        this.validRuc = false;
      }
    }
  }

  onChangeRucU() {
    if (this.objProve.ruc.length != 13) {
      document.getElementById("rucProveU").style.borderLeft = "5px solid #a94442"; /* red */
      this.validRuc = true;
    } else {
      if (!this.validateService.validarRucCedula(this.objProve.ruc)) {
        this.messageGrowlService.notify('error', 'Error', 'Cedula Inválida!');
        document.getElementById("rucProveU").style.borderLeft = "5px solid #a94442"; /* red */
        this.validRuc = true;
      } else {
        this.messageGrowlService.notify('success', 'Éxito', 'Ruc válido!');
        document.getElementById("rucProveU").style.borderLeft = "5px solid #42A948"; /* green */
        this.validRuc = false;
      }
    }
  }

  onChangeCiudad($event) {
    this.objProve.ciudad = this.fs.toTitleCase(this.objProve.ciudad);
  }

  setCursorAddProve() {
    setTimeout(function () {
      document.getElementById('nombreProve').focus();
      setOriginalColorsProve();
    }, 0);
    this.setDefaultProve(1);
  }

  saveProveedor() {
    this.proveedorService.register(this.objProve).subscribe(data => {
      this.lstProveedores.push(data);
      this.sourceProve.refresh();
      this.setDefaultProve(1);
      this.showDialogProve = false;
      localStorage.setItem('lstProveedor', JSON.stringify(this.lstProveedores));
      this.messageGrowlService.notify('success', 'Existo', 'Ingreso Existoso!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
  }

  showProveedor(event: any) {
    this.showProveDialog = event.data.nombre_proveedor;
    this.showComprasDetail = true;
  }

  setCursorUpdateProve(event: any) {
    setTimeout(function () {
      document.getElementById('nombreProveU').focus();
      document.getElementById("rucProveU").style.borderLeft = "5px solid #42A948"; /* green */
      document.getElementById("correoU").style.borderLeft = "5px solid #42A948"; /* green */
    }, 0);
    let lst = JSON.parse(localStorage.getItem('lstProveedor'));
    let prov = lst.filter(function (obj) {
      return obj._id.localeCompare(event.data._id) === 0;
    });
    this.objProve = prov[0];
    this.validCorreo = false;
    this.validRuc = false;
  }
  provUpdt: Proveedor;
  searchOldProve(id) {
    let lst = JSON.parse(localStorage.getItem('lstProveedor'));
    this.provUpdt = lst.filter(function (obj) {
      return obj._id.localeCompare(id) === 0;
    });
  }

  updateProveedor() {
    this.proveedorService.update(this.objProve).subscribe(data => {
      this.searchOldProve(data._id);
      this.updateFromLocalStorage(this.objProve);
      this.sourceProve.refresh();
      this.setDefaultProve(2);
      this.showDialogProveU = false;
      this.messageGrowlService.notify('info', 'Información', 'Modificación Existosa!');
    }, err => {
      console.log(err);
      this.messageGrowlService.notify('warn', 'Advertencia', 'Algo salió mal!');
    });
  }

  onDeleteProve(event): void {
    this.openDialogProve(event.data);
  }

  openDialogProve(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          this.sourceProve.remove(data);
          this.deleteFromLocalStorage(data);
          // remove from database
          this.proveedorService.delete(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');
          });
        }
      }
    });
  }

  setDefaultProve(op) {
    this.objProve = {
      nombre_proveedor: '',
      ruc: '',
      direccion: '',
      ciudad: undefined,
      telefono: '',
      correo: '',
      comprasV: [],
      representanteV: []
    };
    this.validRuc = true;
    this.validCorreo = true;
    if (op = 1) {
      setOriginalColorsProve();
    } else {
      setOriginalColorsProveU();
    }

  }

  showRepre() {
    this.showRepresentante = true;
    setTimeout(function () {
      document.getElementById('nombreRepre').focus();
      setOriginalColorsRepre();
    }, 0);
    this.setDefaultRepre();
  }

  onChangeNombreRepre($event) {
    this.representante.nombre = this.representante.nombre.trim();
    this.representante.nombre = this.fs.toTitleCase(this.representante.nombre);
  }

  flagEmailRepre = true;
  onChangeEmailRepre($event) {
    this.representante.correo = this.representante.correo.toLocaleLowerCase();
    if (this.validateService.validateEmail(this.representante.correo)) {
      this.messageGrowlService.notify('success', 'Éxito', 'Correo válido!');
      document.getElementById("correoRepre").style.borderLeft = "5px solid #42A948"; /* green */
      this.flagEmailRepre = false;
    }
    else {
      document.getElementById("correoRepre").style.borderLeft = "5px solid #a94442"; /* red */
      this.flagEmailRepre = true;
    }
  }

  onChangeDescRepre($event) {
    this.representante.descripcion = this.representante.descripcion.trim();
  }

  addRepre() {
    this.representante.value = this.representante.nombre;
    this.objProve.representanteV = [...this.objProve.representanteV, this.representante];

    this.showRepresentante = false;
    this.representante = {
      nombre: '',
      telefono: '',
      correo: '',
      descripcion: '',
      value: ''
    }
    document.getElementById("correoRepre").style.borderLeft = "5px solid #a94442"; /* red */
    this.flagEmailRepre = true;
  }

  setDefaultRepre() {
    this.representante = {
      nombre: '',
      telefono: '',
      correo: '',
      descripcion: '',
      value: ''
    };
    this.flagEmailRepre = true;
    setOriginalColorsRepre();
  }

  deleteFromLocalStorage(element) {
    this.lstProveedores = this.lstProveedores.filter(function (el) {
      return el._id !== element._id
    });
    localStorage.setItem('lstProveedor', JSON.stringify(this.lstProveedores));
  }

  updateFromLocalStorage(data) {
    console.log(data)
    for (var i in this.lstProveedores) {
      if (this.lstProveedores[i]._id == data._id) {
        this.lstProveedores[i] = data;
        break;
      }
    }

    localStorage.setItem('lstProveedor', JSON.stringify(this.lstProveedores));
  }

  ngOnInitProve() {
    this.objProve = {
      nombre_proveedor: '',
      ruc: '',
      direccion: '',
      ciudad: undefined,
      telefono: '',
      correo: '',
      comprasV: [],
      representanteV: []
    };
    this.validRuc = true;
    this.showDialogProve = false;
    this.showDialogProveU = false;

    /* Get Proveedores*/
    this.proveedorService.getAll().subscribe(data => {
      this.lstProveedores = data;
      console.log(this.lstProveedores)
      localStorage.setItem('lstProveedor', JSON.stringify(this.lstProveedores));
      this.sourceProve = new LocalDataSource();
      this.sourceProve.load(data);
      this.settingsProve = {
        mode: 'external',
        noDataMessage: 'No existen registros',
        columns: {
          ruc: {
            title: 'Ruc',
            width: '12%'
          },
          nombre_proveedor: {
            title: 'Nombre',
            width: '20%'
          },
          direccion: {
            title: 'Dirección',
            width: '20%'
          },
          ciudad: {
            title: 'Ciudad',
            width: '12%',
            valuePrepareFunction: (ciudad) => {
              let fila = ciudad.nombre + '--' + ciudad.provincia;
              return fila;
            }
          },
          telefono: {
            title: 'Teléfono',
            width: '12%'
          },
          representanteV: {
            title: 'Representante',
            width: '14%',
            valuePrepareFunction: (representanteV) => {
              let fila = '';
              for (let entry of representanteV) {
                fila += entry.nombre + '--' + entry.telefono + ' ';
              }
              return fila;
            }
          },
          compras: {
            title: 'Compras',
            width: '10%',
            filter: false,
            type: 'custom',
            renderComponent: IconRenderComponent
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
    }, err => {
      console.log(err);
    })

    /* Get Ciudades */
    this.ciudadService.getAll().subscribe(countries => {
      this.citiesEcu = countries;
    });

    /* Get Proveedores*/
    /*this.proveedorService.getAll().subscribe(data => {

      if (this.lstProveedoresK.length > 0) {
        this.kardex.proveedor = this.lstProveedoresK[0];
      }

      this.kardexService.getAll().subscribe(data => {
        this.lstKardex = data
        let i = 0;
        for (const x of data) {
          const desc = this.searchDescProve(x.proveedor, this.lstProveedoresK);
          this.lstKardex[i].proveedor = desc;
          const desc1 = this.searchDescProd(x.desc_producto, this.productos);
          this.lstKardex[i].desc_producto = desc1;
          i++;
        }
        localStorage.setItem('lstKardex', JSON.stringify(this.lstKardex));
        this.sourceK = new LocalDataSource();
        this.sourceK.load(this.lstKardex);
        this.settingsK = {
          mode: 'external',
          noDataMessage: 'No existen registros',
          columns: {
            num_factura: {
              title: 'Número Factura',
              width: '14%'
            },
            fecha: {
              title: 'Fecha',
              width: '15%'
            },
            desc_producto: {
              title: 'Descripción Producto',
              width: '22%'
            },
            proveedor: {
              title: 'Proveedor',
              width: '22%'
            },
            cantidad: {
              title: 'Unidades',
              width: '9%'
            },
            total: {
              title: 'Total',
              width: '9%'
            },
            unidades_vendidas: {
              title: 'Unidades Vendidas',
              width: '9%',
              filter: false,
              type: 'custom',
              renderComponent: IconRenderKComponent
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
      }, err => {
        console.log(err);
      })
    }, err => {
      console.log(err);
    })*/

  }

  /*Compras*/
  objCompras: {
    num_factura: '',
    fecha: Date,
    proveedor: Proveedor,
    vendedor: '',
    productosV: any[],
    desglose: any,
    formaPago: {
      fpEfectivo: 0,
      fpTarjeta: 0,
      fpPorCobrar: 0,
      fpCheque: 0
    },
    total: number
  }
  ngOnInitCompras() {
    /*this.typesProd = [];
    this.typesProd.push({ label: 'Existente', value: 'Existente' });
    this.typesProd.push({ label: 'Nuevo', value: 'Nuevo' });
    this.lstComprasProve = [];*/
    this.objCompras = {
      num_factura: '',
      fecha: new Date(),
      proveedor: new Proveedor,
      vendedor: '',
      productosV: [],
      desglose: undefined,
      formaPago: {
        fpEfectivo: 0,
        fpTarjeta: 0,
        fpPorCobrar: 0,
        fpCheque: 0
      },
      total: 0
    };
    /*this.objProdCompras = {
      producto: new Producto,
      cantidad: 0,
      pcUnitario: 0,
      fecha: '',
      total: 0,
      impuestos: []
    }
    this.settingsC = {
      mode: 'external',
      noDataMessage: 'No existen registros',
      columns: {
        cant_existente: {
          title: 'Stock',
          width: '7%',
          type: 'custom',
          renderComponent: PipeRenderComponent,
          filter: false
        },
        nombre: {
          title: 'Nombre',
          width: '18%',
          filter: {
            type: 'completer',
            config: {
              completer: {
                data: this.productos,
                searchFields: 'nombre',
                titleField: 'nombre'
              },
            },
          },
        },
        contenido: {
          title: 'Contenido',
          width: '7%',
          type: 'custom',
          renderComponent: PipeRenderComponent,
          filter: false
        },
        unidad_medida: {
          title: 'UM',
          width: '7%',
          filter: false,
          valuePrepareFunction: (unidad_medida) => {
            var um = 'Unidades';
            var res = unidad_medida.split("-");
            if (res[0].localeCompare('Masa') === 0) {
              um = 'Masa-Gramos';
            }
            if (res[0].localeCompare('Volumen') === 0) {
              um = 'Volumen-Mililitros';
            }
            return um;
          }
        },
        precio_costo: {
          title: 'Precio Costo',
          width: '7%',
          type: 'custom',
          renderComponent: PipeRenderComponent,
          filter: false
        },
        utilidad: {
          title: 'Utilidad (%)',
          width: '7%',
          type: 'custom',
          renderComponent: PipeRenderComponent,
          filter: false
        },
        precio_venta: {
          title: 'Precio Venta',
          width: '7%',
          type: 'custom',
          renderComponent: PipeRenderComponent,
          filter: false
        },
        subproductoV: {
          title: 'Subproducto',
          width: '23%',
          filter: false,
          valuePrepareFunction: (subproductoV) => {
            let fila = '';
            for (let entry of subproductoV) {
              fila += '-' + entry.nombre + ' ' + entry.cantidad + ' ';
            }
            return fila;
          }
        },
        path: {
          title: 'Logotipo',
          width: '7%',
          filter: false,
          type: 'custom',
          renderComponent: ImageRenderComponent
        }
      },
      actions: {
        columnTitle: '',
        add: true,
        edit: true,
        delete: true
      },
      attr: {
        class: 'table-bordered table-hover table-responsive'
      }
    };*/

    //console.log(this.fs.dinamicModulo11('010520180117912875410012001011006161585281014691'));
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

function setOriginalColorsProve() {
  document.getElementById("rucProve").style.borderColor = "";
  document.getElementById("correo").style.borderColor = "";
}

function setOriginalColorsProveU() {
  document.getElementById("rucProveU").style.borderColor = "";
  document.getElementById("correoU").style.borderColor = "";
}

function setOriginalColorsRepre() {
  document.getElementById("correoRepre").style.borderColor = "";
}
