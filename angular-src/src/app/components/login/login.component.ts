import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageGrowlService } from '../../services/message-growl.service';
import { ValidateService } from '../../services/validate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;
  chckRememberme;
  display = false;
  correoRecuperacion;
  flagCorreo = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageGrowlService: MessageGrowlService,
    private validateService: ValidateService
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
        if (this.chckRememberme) {
          localStorage.setItem('rememberMe', JSON.stringify(user));
        } else {
          localStorage.removeItem('rememberMe');
        }
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
      document.getElementById('correo').focus();
    }, 0)
  }

  onChangeCorreo() {
    let a = this.validateService.validateEmail(this.correoRecuperacion);
    if (a) {
      this.flagCorreo = true;
    } else {
      this.flagCorreo = false;
    }
  }

  sendEmail(){
    const user = {
      username: this.username,
      password: this.password,
      email: this.correoRecuperacion
    }
    this.authService.sendEmail(user).subscribe(data => {
      console.log(data);
    });
  }
}
