import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageGrowlService } from '../../services/message-growl.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageGrowlService: MessageGrowlService
  ) { }

  ngOnInit() {
  }
  onLoginSubmit() {
    //console.log(this.username);
    const user = {
      username: this.username,
      password: this.password
    }
    this.authService.authenticateUser(user).subscribe(data => {
      //console.log(data);
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.messageGrowlService.notify('info', 'Información', 'Bienvenido!');
        //this.router.navigate(['dashboard']);
        this.router.navigate(['card']);
      } else {
        this.messageGrowlService.notify('error', 'Error', data.msg);
        this.router.navigate(['login']);
      }
    });
  }
}
