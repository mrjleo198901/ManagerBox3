import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { MessageGrowlService } from '../../services/message-growl.service';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  nombres;
  flagShowSuccess;
  selectedTab: number;
  nombreComercial: string = '';
  flagNombreComercial = false;
  razonSocial: string = '';
  flagRazonSocial = false;
  ruc: string = '';
  flagRuc = true;
  nroCont: string = '';
  flagNroCont = false;
  flagCont = false;
  color = 'primary';
  numMax: number = 5;
  flagNumMax = false;
  limite: number = 60;
  flagLimite = false;
  printerName: string = '';
  flagPrinterName = false;
  numModelo: string = '';
  flagNumModelo = false;
  flagValidateRUC = false;
  nuevaCantidad: number = 0;
  flagNuevaCant = false;

  constructor(private validateService: ValidateService,
    private messageGrowlService: MessageGrowlService,
    private configurationService: ConfigurationService) {
    var x = window.innerWidth;
    this.onRzOnInit(x);
  }

  ngOnInit() {

    /*let obj = { descripcion: 'nuevaCantidad', valor: '10' };
    this.configurationService.register(obj).subscribe(data => {
      console.log(data)
    }, err => {
      console.log(err)
    });*/

    this.selectedTab = 1;
    this.configurationService.getAll().subscribe(data => {
      console.log(data);
      this.nombreComercial = data[0].valor;
      this.nombreComercial = this.nombreComercial.toUpperCase();
      this.razonSocial = data[1].valor;
      this.razonSocial = this.razonSocial.toUpperCase();
      this.ruc = data[2].valor;
      this.nroCont = data[3].valor;
      this.flagCont = data[4].valor;
      this.numMax = data[5].valor;
      this.limite = data[6].valor;
      this.printerName = data[7].valor;
      this.numModelo = data[8].valor;
      this.nuevaCantidad = data[9].valor;
    }, err => {
      console.log(err);
    });
  }

  /* INFORMACION */
  public alertMe1(st) {
    if (this.selectedTab != st && this.selectedTab > 0) {
      setTimeout(function () {
        let v = document.getElementById('nombreComercial');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 1;
  };

  public alertMe2(st) {
    if (this.selectedTab != st && this.selectedTab > 0) {
      setTimeout(function () {
        let v = document.getElementById('numMax');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 2;
  };

  public alertMe3(st) {
    if (this.selectedTab != st && this.selectedTab > 0) {
      setTimeout(function () {
        let v = document.getElementById('printerName');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 3;
  };

  public alertMe4(st) {
    if (this.selectedTab != st && this.selectedTab > 0) {
      setTimeout(function () {
        let v = document.getElementById('nuevaCantidad');
        if (v != null)
          v.click();
      }, 50);
    }
    this.selectedTab = 4;
  }

  focusFunction() {
    this.flagValidateRUC = true;
  }

  focusOutFunction() {
    this.flagValidateRUC = false;
  }

  onChangeNombreComercial() {
    if (this.nombreComercial.length > 0) {
      this.nombreComercial = this.nombreComercial.toUpperCase();
      this.flagNombreComercial = true;
    } else {
      this.flagNombreComercial = false;
    }
    if (this.razonSocial.length > 0) {
      this.razonSocial = this.razonSocial.toUpperCase();
      this.flagRazonSocial = true;
    } else {
      this.flagRazonSocial = false;
    }
    if (this.flagValidateRUC) {
      if (this.ruc.length === 13) {
        if (!this.validateService.validarRucCedula(this.ruc)) {
          this.messageGrowlService.notify('error', 'Error', 'RUC Inválido!');
          this.flagRuc = false;
        } else {
          this.messageGrowlService.notify('success', 'Éxito', 'RUC Válido!');
          this.flagRuc = true;
        }
      } else {
        this.flagRuc = false;
      }
    }
  }

  onChangeRazonSocial() {
    if (this.nombreComercial.length > 0) {
      this.nombreComercial = this.nombreComercial.toUpperCase();
      this.flagNombreComercial = true;
    } else {
      this.flagNombreComercial = false;
    }
    if (this.razonSocial.length > 0) {
      this.razonSocial = this.razonSocial.toUpperCase();
      this.flagRazonSocial = true;
    } else {
      this.flagRazonSocial = false;
    }
    if (this.flagValidateRUC) {
      if (this.ruc.length === 13) {
        if (!this.validateService.validarRucCedula(this.ruc)) {
          this.messageGrowlService.notify('error', 'Error', 'RUC Inválido!');
          this.flagRuc = false;
        } else {
          this.messageGrowlService.notify('success', 'Éxito', 'RUC Válido!');
          this.flagRuc = true;
        }
      } else {
        this.flagRuc = false;
      }
    }
  }

  onChangeRuc() {
    if (this.nombreComercial.length > 0) {
      this.nombreComercial = this.nombreComercial.toUpperCase();
      this.flagNombreComercial = true;
    } else {
      this.flagNombreComercial = false;
    }
    if (this.razonSocial.length > 0) {
      this.razonSocial = this.razonSocial.toUpperCase();
      this.flagRazonSocial = true;
    } else {
      this.flagRazonSocial = false;
    }
    if (this.flagValidateRUC) {
      if (this.ruc.length === 13) {
        if (!this.validateService.validarRucCedula(this.ruc)) {
          this.messageGrowlService.notify('error', 'Error', 'RUC Inválido!');
          this.flagRuc = false;
        } else {
          this.messageGrowlService.notify('success', 'Éxito', 'RUC Válido!');
          this.flagRuc = true;
        }
      } else {
        this.flagRuc = false;
      }
    }
  }

  onChangeNroCont() {
    if (this.nombreComercial.length > 0) {
      this.nombreComercial = this.nombreComercial.toUpperCase();
      this.flagNombreComercial = true;
    } else {
      this.flagNombreComercial = false;
    }
    if (this.razonSocial.length > 0) {
      this.razonSocial = this.razonSocial.toUpperCase();
      this.flagRazonSocial = true;
    } else {
      this.flagRazonSocial = false;
    }
    if (this.flagValidateRUC) {
      if (this.ruc.length === 13) {
        if (!this.validateService.validarRucCedula(this.ruc)) {
          this.messageGrowlService.notify('error', 'Error', 'RUC Inválido!');
          this.flagRuc = false;
        } else {
          this.messageGrowlService.notify('success', 'Éxito', 'RUC Válido!');
          this.flagRuc = true;
        }
      } else {
        this.flagRuc = false;
      }
    }
  }

  updateInfo() {
    this.configurationService.getByDesc('nombreComercial').subscribe(data => {
      data[0].valor = this.nombreComercial;
      this.configurationService.update(data[0]).subscribe(data1 => {
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err)
    });
    this.configurationService.getByDesc('razonSocial').subscribe(data => {
      data[0].valor = this.razonSocial;
      this.configurationService.update(data[0]).subscribe(data1 => {
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err)
    });
    this.configurationService.getByDesc('ruc').subscribe(data => {
      data[0].valor = this.ruc;
      this.configurationService.update(data[0]).subscribe(data1 => {
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err)
    });
    this.configurationService.getByDesc('nroCont').subscribe(data => {
      data[0].valor = this.nroCont;
      this.configurationService.update(data[0]).subscribe(data1 => {
        this.messageGrowlService.notify('info', 'Información', 'Modificación Exitosa!')
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err)
    });
  }

  onChangeNumMax() {
    if (this.numMax > 0) {
      this.flagNumMax = true;
    } else {
      this.flagNumMax = false;
    }
    if (this.limite > 0) {
      this.flagLimite = true;
    } else {
      this.flagLimite = false;
    }
  }

  onChangeLimite() {
    if (this.limite > 0) {
      this.flagLimite = true;
    } else {
      this.flagLimite = false;
    }
    if (this.numMax > 0) {
      this.flagNumMax = true;
    } else {
      this.flagNumMax = false;
    }
  }

  updateTarjeta() {
    this.configurationService.getByDesc('numMax').subscribe(data => {
      data[0].valor = this.numMax;
      this.configurationService.update(data[0]).subscribe(data1 => {
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err)
    });
    this.configurationService.getByDesc('limite').subscribe(data => {
      data[0].valor = this.limite;
      this.configurationService.update(data[0]).subscribe(data1 => {
        this.messageGrowlService.notify('info', 'Información', 'Modificación Exitosa!')
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err)
    });
  }

  onChangeNumModelo() {
    if (this.printerName.length > 0) {
      this.printerName = this.printerName.toUpperCase();
      this.flagPrinterName = true;
    } else {
      this.flagPrinterName = false;
    }
    if (this.numModelo.length > 0) {
      this.numModelo = this.numModelo.toUpperCase();
      this.flagNumModelo = true;
    } else {
      this.flagNumModelo = false;
    }
  }

  onChangePrinterName() {
    if (this.printerName.length > 0) {
      this.printerName = this.printerName.toUpperCase();
      this.flagPrinterName = true;
    } else {
      this.flagPrinterName = false;
    }
    if (this.numModelo.length > 0) {
      this.numModelo = this.numModelo.toUpperCase();
      this.flagNumModelo = true;
    } else {
      this.flagNumModelo = false;
    }
  }

  updateImpresion() {
    this.configurationService.getByDesc('numModelo').subscribe(data => {
      data[0].valor = this.numModelo;
      this.configurationService.update(data[0]).subscribe(data1 => {
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err)
    });
    this.configurationService.getByDesc('printerName').subscribe(data => {
      data[0].valor = this.printerName;
      this.configurationService.update(data[0]).subscribe(data1 => {
        this.messageGrowlService.notify('info', 'Información', 'Modificación Exitosa!');
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err)
    });
  }

  onChangeNuevaCant() {
    if (this.nuevaCantidad > 0) {
      this.flagNuevaCant = true;
    } else {
      this.flagNuevaCant = false;
    }
  }

  updateVentas() {
    this.configurationService.getByDesc('nuevaCantidad').subscribe(data => {
      data[0].valor = this.nuevaCantidad;
      this.configurationService.update(data[0]).subscribe(data1 => {
        this.messageGrowlService.notify('info', 'Información', 'Modificación Exitosa!');
      }, err => {
        console.log(err)
      });
    }, err => {
      console.log(err)
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

  onChangeNombres() {

  }
  onLoginSubmit() {

  }

}
