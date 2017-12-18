import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageGrowlService } from '../../services/message-growl.service';
import { ValidateService } from '../../services/validate.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormatterService } from '../../services/formatter.service';
import { PersonalService } from '../../services/personal.service';
import { InventarioComponent } from '../../components/inventario/inventario.component';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;
  chckRememberme = true;
  display = false;
  correoRecuperacion;
  flagCorreo = false;
  navbar: NavbarComponent;
  cedula;
  flagFindUser = false;
  showMessages = false;
  nombres;
  displayCaja = false;
  card: CardComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageGrowlService: MessageGrowlService,
    private validateService: ValidateService,
    private formatterService: FormatterService,
    private personalService: PersonalService,
  ) { }

  ngOnInit() {
    document.getElementById('username').style.backgroundColor = '';
    document.getElementById('password').style.backgroundColor = ''
    setTimeout(function () {
      document.getElementById('username').focus();
    }, 0)
    let user: any;
    user = localStorage.getItem('rememberMe');
    if (user !== null) {
      user = JSON.parse(user);
      this.username = user.username;
      this.password = user.password;
      document.getElementById('username').style.backgroundColor = '#FAFFBF';
      document.getElementById('password').style.backgroundColor = '#FAFFBF'
    }

  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }
    this.authService.authenticateUser(user).subscribe(data => {
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.messageGrowlService.notify('info', 'Información', 'Bienvenido!');

        NavbarComponent.updateUserStatus.next(true);

        if (this.chckRememberme) {
          localStorage.setItem('rememberMe', JSON.stringify(user));
        } else {
          localStorage.removeItem('rememberMe');
        }
        //Check cajero
        this.personalService.getByCedula(user.username).subscribe(data => {

          if (data[0].id_cargo === '59a054715c0bf80b7cab502d') {
            CardComponent.updateDisplayCaja.next(true);
            this.router.navigate(['card']);
          }
          if (data[0].id_cargo === '59937c6337eac33cd4819873') {
            this.router.navigate(['facturacion']);
          }
        }, err => {
          console.log(err);
        })
        this.router.navigate(['card']);
      } else {
        this.messageGrowlService.notify('error', 'Error', data.msg);
        this.router.navigate(['login']);
      }
    });
  }

  showDialog() {
    this.display = true;
    setTimeout(function () {
      document.getElementById('ciA').focus();

    }, 50)
    //this.onChangeCI();
  }

  onChangeCorreo() {
    let a = this.validateService.validateEmail(this.correoRecuperacion);
    if (a) {
      this.flagCorreo = true;
    } else {
      this.flagCorreo = false;
    }
  }

  sendEmail() {
    const user = {
      name: this.nombres,
      email: this.correoRecuperacion,
      username: this.cedula,
      npass: this.formatterService.makeId()
    }
    this.authService.sendEmail(user).subscribe(data => {
      console.log(user.npass)
      console.log(data);
      this.authService.updateUser(user).subscribe(data => {
        console.log(data);
        this.messageGrowlService.notify('info', 'Info', 'Se ha enviado el correo con la nueva clave');
      }, err => {
        console.log(err)
      })

    });
  }

  onChangeCI() {
    if (this.cedula.length != 10) {
      document.getElementById("ciA").style.borderColor = "#FE2E2E";
      this.showMessages = false;
      this.correoRecuperacion = '';
      this.nombres = '';
      this.flagCorreo = false;
      this.flagFindUser = false;
    }
    if (this.cedula.length == 10) {
      if (!this.validateService.validarRucCedula(this.cedula)) {
        this.messageGrowlService.notify('error', 'Error', 'Cedula/Ruc Inválido!');
        document.getElementById("ciA").style.borderColor = "#FE2E2E";
      } else {
        document.getElementById("ciA").style.borderColor = "#5ff442";
        this.checkUser();
        this.showMessages = true;
      }
    }
  }

  checkUser() {
    this.personalService.getByCedula(this.cedula).subscribe(data => {
      if (data.length > 0) {
        this.correoRecuperacion = data[0].email;
        this.nombres = data[0].nombres + ' ' + data[0].apellidos;
        this.flagFindUser = true;
        this.flagCorreo = true;
      } else {
        this.correoRecuperacion = '';
        this.flagFindUser = false;
        this.flagCorreo = false;
      }
    }, err => {
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!')
      console.log(err);
    })
  }

}
