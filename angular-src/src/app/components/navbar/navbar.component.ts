import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageGrowlService } from '../../services/message-growl.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    private messageGrowlService: MessageGrowlService) { }

  ngOnInit() {
  }
  onLogOutClick() {
    this.authService.logout();
    this.messageGrowlService.notify('info', 'Información', 'Saliste!');
    this.router.navigate(['/login']);
    return false;
  }
}
