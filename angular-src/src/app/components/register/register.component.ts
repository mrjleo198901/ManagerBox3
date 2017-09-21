import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { MessageGrowlService } from '../../services/message-growl.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private messageGrowlService: MessageGrowlService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }
  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }
    //Required fields
    if (!this.validateService.validateRegister(user)) {
      this.messageGrowlService.notify('error', 'Error', 'Por favor llena todos los campos!');
      return false;
    }
    // Validate Email
    if (!this.validateService.validateEmail(user.email)) {
      return false;
    }
    // Register user
    this.authService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.messageGrowlService.notify('success', 'Exito', 'Ahora estas registrado y puedes entrar!')
        this.router.navigate(['/login']);
      } else {
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
        this.router.navigate(['/register']);
      }
    });
  }
}
