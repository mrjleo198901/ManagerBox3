import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ImageRenderComponent } from './components/image-render/image-render.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { InventarioComponent } from './components/inventario/inventario.component';
/*Services*/
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { TipoProductoService } from './services/tipo-producto.service';
import { ProductoService } from './services/producto.service';
import { ClienteService } from './services/cliente.service';
import { TipoClienteService } from './services/tipo-cliente.service';
import { CargoPersonalService } from './services/cargo-personal.service';
import { PersonalService } from './services/personal.service';
import { MessageGrowlService } from './services/message-growl.service';
import { FormatterService } from './services/formatter.service';
import { TarjetaService } from './services/tarjeta.service';
/*angular-2-ui-framework*/
import { TabsModule } from './com/tabs/tabs.module';
import { DatepickerModule } from './com/datepicker/datepicker.module';
import { TooltipModule } from './com/tooltip/tooltip.module'
/*Libraries*/
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2CompleterModule } from 'ng2-completer';
import { Angular2FontawesomeModule } from 'angular2-fontawesome'
import { CurrencyMaskModule } from "ng2-currency-mask";
import { MdTooltipModule, MdDialogModule, MdCheckboxModule, MdRadioModule, MdSlideToggleModule } from '@angular/material';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {
  GrowlModule, PanelModule, DropdownModule, ButtonModule, DataTableModule,
  ToggleButtonModule, SpinnerModule, SharedModule, CheckboxModule, TabViewModule, ListboxModule,
  CalendarModule, DataGridModule, DialogModule, BlockUIModule, SelectButtonModule, InputMaskModule
} from 'primeng/primeng';

import { AppComponent } from './app.component';
import { NotificationComponent } from './components/notification/notification.component';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';

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
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard] }
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
    AdministracionComponent,
    ImageRenderComponent,
    ConfirmDialogComponent,
    InventarioComponent,
    NotificationComponent,
    AppLoaderComponent
  ],
  entryComponents: [ImageRenderComponent, ConfirmDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    TabsModule,
    DatepickerModule,
    TooltipModule,
    Angular2FontawesomeModule,
    Ng2SmartTableModule,
    Ng2CompleterModule,
    CurrencyMaskModule,
    MdTooltipModule, MdDialogModule, MdCheckboxModule, MdRadioModule, MdSlideToggleModule,
    SimpleNotificationsModule.forRoot(),
    GrowlModule, PanelModule, DropdownModule, ButtonModule, DataTableModule, SharedModule, CheckboxModule,
    TabViewModule, CalendarModule, DataGridModule, DialogModule, ToggleButtonModule, BlockUIModule,
    SpinnerModule, SelectButtonModule, InputMaskModule, ListboxModule
  ],
  providers: [ValidateService, AuthService, AuthGuard, TipoProductoService, ProductoService, FormatterService,
    CargoPersonalService, PersonalService, ClienteService, TipoClienteService, MessageGrowlService, TarjetaService],
  bootstrap: [AppComponent]
})

export class AppModule { }
