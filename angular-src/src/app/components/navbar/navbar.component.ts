import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageGrowlService } from '../../services/message-growl.service';
import { PersonalService } from '../../services/personal.service';
import { Subject } from 'rxjs/Subject';
import { CajaService } from '../../services/caja.service';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public user;
  public static updateUserStatus: Subject<boolean> = new Subject();
  public permissions=[];
  public personal;
  public atencion;
  public administracion;
  public clientes;
  public productos;
  public reportes;
  public ventas;
  constructor(
    public authService: AuthService,
    private router: Router,
    private messageGrowlService: MessageGrowlService,
    private personalService: PersonalService,
    private cajaService: CajaService) {

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
        console.log("2")
        if (data.length > 0) {
          let nombres = data[0].nombres.split(' ');
          let apellidos = data[0].apellidos.split(' ');
          this.user = nombres[0] + ' ' + apellidos[0];
        }
      }, err => {
        console.log(err)
      })
    })


    //console.log(this.permissions);


  }

  ngOnInit() {
    this.permissions=JSON.parse(localStorage.getItem('permisos'));
    if(this.permissions!==null){

      this.personal=this.permissions[3].checked;
      this.atencion=this.permissions[1].checked;
      this.administracion=this.permissions[0].checked;
      this.clientes=this.permissions[2].checked;
      this.productos=this.permissions[4].checked;
      this.reportes=this.permissions[5].checked;
      this.ventas=this.permissions[6].checked;
    }
  }

  onLogOutClick() {
    let us = JSON.parse(localStorage.getItem('user'));
    this.authService.logout();
    localStorage.removeItem('permisos');
    this.router.navigate(['/login']);
   /* this.cajaService.getActiveCajaById('open', us.idPersonal).subscribe(data => {
      console.log(data);
      if (data.length > 0) {
        CardComponent.checkOpenCaja.next(true);
      }


      this.messageGrowlService.notify('info', 'Información', 'Saliste!');
      this.router.navigate(['/login']);
      return false;
    }, err => {
      console.log(err)
    })*/
  }
}
