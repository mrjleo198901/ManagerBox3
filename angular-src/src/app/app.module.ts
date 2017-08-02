import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
/*My Components*/
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CardComponent } from './components/card/card.component';
import { DialogComponent } from './components/dialogLogin/dialog.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { PersonalComponent } from './components/personal/personal.component';
import { AdministracionComponent } from './components/administracion/administracion.component';
/*Services*/
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { TipoProductoService } from './services/tipo-producto.service';
import { ProductoService } from './services/producto.service';
/*angular-2-ui-framework*/
import { TabsModule } from './com/tabs/tabs.module';
import { DatepickerModule } from './com/datepicker/datepicker.module';
/*Libraries*/
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2CompleterModule } from 'ng2-completer';
import { Angular2FontawesomeModule } from 'angular2-fontawesome'

import { AppComponent } from './app.component';

/*Navigation*/
const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'card', component: CardComponent, canActivate: [AuthGuard] },
  { path: 'facturacion', component: FacturacionComponent, canActivate: [AuthGuard] },
  { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] },
  { path: 'personal', component: PersonalComponent, canActivate: [AuthGuard] },
  { path: 'administracion', component: AdministracionComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    CardComponent,
    DialogComponent,
    FacturacionComponent,
    ClientesComponent,
    PersonalComponent,
    AdministracionComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    TabsModule,
    DatepickerModule,
    Angular2FontawesomeModule,
    Ng2SmartTableModule,
    Ng2CompleterModule,
  ],
  providers: [ValidateService, AuthService, AuthGuard, TipoProductoService, ProductoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
