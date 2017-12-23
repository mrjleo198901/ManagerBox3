import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PersonalService } from '../../services/personal.service';
import { MessageGrowlService } from '../../services/message-growl.service';
import { CargoPersonalService } from '../../services/cargo-personal.service';
import { ValidateService } from '../../services/validate.service';
import { FormatterService } from '../../services/formatter.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  flagChangePass = false;
  color = 'primary';
  _id;
  cedula;
  fn;
  cargo;
  nombres;
  apellidos;
  telefono;
  pass;
  npass;
  rnpass;
  email;
  user: any;
  flagShowError = false;
  flagShowSuccess = true;
  flagSubmit = false;
  lstCargos;
  newPersonal: any;

  constructor(private personalService: PersonalService,
    private messageGrowlService: MessageGrowlService,
    private authService: AuthService,
    private cargoPersonalService: CargoPersonalService,
    private validateService: ValidateService,
    private formatterService: FormatterService) {

    var x = window.innerWidth;
    this.onRzOnInit(x);

  }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('user'));
    this.cedula = this.user.username;
    this.personalService.getByCedula(this.user.username).subscribe(data => {
      this.newPersonal = data[0];
      this.cargoPersonalService.getAll().subscribe(data1 => {
        this.lstCargos = data1;
        this.fn = data[0].fecha_nacimiento;
        this.email = data[0].email;
        this.cargo = this.searchDescCargo(data[0].id_cargo, this.lstCargos);
        this.nombres = data[0].nombres;
        this.apellidos = data[0].apellidos;
        this.telefono = data[0].telefono;
        this.pass = this.user.password;
        this._id = this.user.id;
      }, err => {
        console.log(err);
      })
    }, err => {
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!')
      console.log(err);
    })
    this.npass = '';
    this.rnpass = '';
    this.flagShowError = false;
    this.flagShowSuccess = true;
    this.flagSubmit = false;
    this.flagChangePass = false;
    document.getElementById("cedula").style.borderColor = "";
    document.getElementById("nombres").style.borderColor = "";
    document.getElementById("apellidos").style.borderColor = "";
    document.getElementById("telefono").style.borderColor = "";
    document.getElementById("email").style.borderColor = "";
  }

  showPass($event) {
    if (this.flagChangePass) {
      this.flagShowSuccess = false;

    } else {
      this.flagShowSuccess = true;

    }
  }

  onLoginSubmit() {
    if (this.flagChangePass) {
      this.pass = this.npass;
    } else {
      this.pass = this.user.password;
    }
    let nUser = {
      _id: this.user.id,
      name: this.removeSpaces(this.nombres + " " + this.apellidos),
      username: this.user.username,
      email: this.email,
      npass: this.pass
    }

    this.newPersonal.email = this.email;
    this.newPersonal.nombres = this.removeSpaces(this.nombres);
    this.newPersonal.apellidos = this.removeSpaces(this.apellidos);
    this.newPersonal.telefono = this.removeSpaces(this.telefono);

    //Required fields
    if (!this.validateService.validatePersonalU(this.newPersonal)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacíos!');
      return false;
    }

    if (this.flagChangePass) {
      this.authService.updateUser(nUser).subscribe(data => {
        this.user.password = data.password;
        localStorage.setItem('user', JSON.stringify(this.user));
        let remember = JSON.parse(localStorage.getItem('rememberMe'));
        remember.password = this.npass;
        localStorage.setItem('rememberMe', JSON.stringify(remember));
        this.messageGrowlService.notify('info', 'Información', 'Se actualizaron tus datos!');
        this.personalService.updatePersonal(this.newPersonal).subscribe(data => {
          this.ngOnInit();
          this.messageGrowlService.notify('info', 'Información', 'Se actualizaron tus datos!');
        }, err => {
          console.log(err);
          this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
        });
      }, err => {
        console.log(err)
      })
    } else {
      this.personalService.updatePersonal(this.newPersonal).subscribe(data => {
        this.ngOnInit();
        this.messageGrowlService.notify('info', 'Información', 'Se actualizaron tus datos!');
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      });
    }
  }

  changePass($event) {
    if (this.npass !== '') {
      if (this.npass !== this.rnpass) {
        this.flagShowError = true;
        this.flagShowSuccess = false;
      } else {
        this.flagShowError = false;
        this.flagShowSuccess = true;
      }
    } else {
      this.flagShowError = false;
      this.flagShowSuccess = false;
    }

  }

  changeNpass($event) {
    if (this.rnpass !== '') {
      if (this.npass !== this.rnpass) {
        this.flagShowError = true;
        this.flagShowSuccess = false;
      } else {
        this.flagShowError = false;
        this.flagShowSuccess = true;
      }
    } else {
      this.flagShowError = false;
      this.flagShowSuccess = false;
    }
  }

  changeMail($event) {
    if (!this.validateService.validateEmail(this.email)) {
      document.getElementById('email').style.borderColor = '#FE2E2E';//soft red
    } else {
      document.getElementById('email').style.borderColor = '#6ce600';//soft green
    }
  }

  onChangeNombres($event) {
    this.nombres = this.formatterService.toTitleCase(this.nombres);
  }

  onChangeApellidos($event) {
    this.apellidos = this.formatterService.toTitleCase(this.apellidos);
  }

  searchDescCargo(id, lstCargos) {
    for (let entry of lstCargos) {
      if (entry._id === id) {
        return entry.descripcion_cargo_personal;
      }
    }
  }

  removeSpaces(cad) {
    cad = cad.trim().replace(/\s+/g, " ");
    return cad;
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
