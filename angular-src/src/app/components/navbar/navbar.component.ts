import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageGrowlService } from '../../services/message-growl.service';
import { PersonalService } from '../../services/personal.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public user;
  public static updateUserStatus: Subject<boolean> = new Subject();
  public static updateDisplayCaja: Subject<boolean> = new Subject();
  displayOpenCaja;

  constructor(
    public authService: AuthService,
    private router: Router,
    private messageGrowlService: MessageGrowlService,
    private personalService: PersonalService) {
    let us = JSON.parse(localStorage.getItem('user'));
    if (us !== null) {
      this.personalService.getByCedula(us.username).subscribe(data => {

        if (data.length > 0) {
          let nombres = data[0].nombres.split(' ');
          let apellidos = data[0].apellidos.split(' ');
          this.user = nombres[0] + ' ' + apellidos[0];
        }
      }, err => {
        console.log(err)
      })
    }

    NavbarComponent.updateUserStatus.subscribe(res => {
      let us = JSON.parse(localStorage.getItem('user'));
      this.personalService.getByCedula(us.username).subscribe(data => {
        if (data.length > 0) {
          let nombres = data[0].nombres.split(' ');
          let apellidos = data[0].apellidos.split(' ');
          this.user = nombres[0] + ' ' + apellidos[0];
        }
      }, err => {
        console.log(err)
      })
    })
    this.displayOpenCaja = false;
    NavbarComponent.updateDisplayCaja.subscribe(res => {
      console.log("innn")
      this.displayOpenCaja = true;
    })

  }

  ngOnInit() {

  }

  onLogOutClick() {
    this.authService.logout();
    this.messageGrowlService.notify('info', 'Información', 'Saliste!');
    this.router.navigate(['/login']);
    return false;
  }
}
