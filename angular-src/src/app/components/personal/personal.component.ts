import { Component, NgModule, OnInit, OnChanges, ElementRef, Renderer } from '@angular/core';
//import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { CargoPersonalService } from '../../services/cargo-personal.service';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { PersonalService } from '../../services/personal.service';
import { MessageGrowlService } from '../../services/message-growl.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import {FormatterService} from "../../services/formatter.service";
import {ConfigListPermissions} from '../../ModelsConfig/configListPermissions';
@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  sourcePer: LocalDataSource = new LocalDataSource();
  sourceCargoPer: LocalDataSource = new LocalDataSource();
  showDialogCargoPerAdd = false;
  showDialogCargoPerUp = false;
  showDialogPerAdd = false;
  showDialogPerUp = false;
  flagUpdateCargoPer: boolean;
  flagCreateCargoPer: boolean;
  flagUpdatePer: boolean;
  flagCreatePer: boolean;
  showDatepicker: boolean;
  banCalendar: number;
  showPersona: any;
  flagUserFound;
  modulosPersonal: { nombre: string, checked: boolean }[] = [];
  // Atributos del personal
  idPersona: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  fechaNacimiento: Date;
  fechaNacimientoString: string;
  sexo: number;
  sexoString: string;
  cargo: string;
  oldUser;
  public dt: Date = new Date();
  //Atributos del cargo personal
  idCargoPersona: string;
  descripcionCargoPersonal: string;
  estado: boolean;
  // varales como banderas
  banFechaNac: string;
  checked;
  align = 'start';
  position = 'after';
  color = 'primary';
  // Selecciones
  selectEstado;
  selectCargoPer;
  // listas
  listaEstado: any = [];
  listaCargoPersonal: any = [];
  listaPersonal: any = [];
  listaPersonal2: any = [];
  es: any;
  tags = [];
  fecha_desde: any;
  fecha_hasta: any;
  selected_user: any;
  lstUsers: any[] = [];
  descripcion;
  permission:any=[];
  tagOriginal:any;

  constructor(
    private cargoPersonalService: CargoPersonalService,
    private personalService: PersonalService,
    private authService: AuthService,
    private formatterService: FormatterService,
    private validateService: ValidateService,
    private messageGrowlService: MessageGrowlService,
    public el: ElementRef, public renderer: Renderer,
    public dialog: MdDialog) {
    renderer.listenGlobal('document', 'change', (event) => {
      //Set time in datepicker
      this.dt = moment(this.fechaNacimientoString, 'DD/MM/YYYY').toDate();
    });
    this.sexo = 1;
    this.flagCreateCargoPer = false;
    this.flagUpdateCargoPer = false;
    this.flagCreatePer = false;
    this.flagUpdatePer = false;
    this.showDatepicker = false;
    this.idCargoPersona = "";
    this.banCalendar = 1;
    this.tagOriginal=ConfigListPermissions.permissions;
    //console.log(this.tagOriginal);
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Borrar'
    }
  //  this.fecha_desde = this.validateService.getDateTimeEsPrimeNG();
   // this.fecha_hasta = this.validateService.getDateTimeEsPrimeNG();

    var x = window.innerWidth;
    this.onRzOnInit(x);

  }

  // inicializador de variables
  ngOnInit() {
 //   var initial = new Date(this.getDate()).toLocaleDateString().split("/");
  //  this.fechaNacimientoString = [initial[0], initial[1], initial[2]].join('/');
    this.sourcePer = new LocalDataSource();
    this.sourceCargoPer = new LocalDataSource();
    this.idPersona = "";
    this.sexo = 1;
    this.cedula = "";
    this.nombres = "";
    this.apellidos = "";
    this.telefono = "";
    this.email = "";
    this.cargo = "";

    // banderas
    this.banFechaNac = "";
    this.flagUserFound = false;

    //Lista de estados
    this.listaEstado = [
      {
        id: "1",
        estado: "Activo"
      },
      {
        id: "2",
        estado: "Inactivo"
      }
    ];
    //Load data to localDataSource
    this.cargoPersonalService.getAll().subscribe(tp => {
       // console.log(tp);
      this.listaCargoPersonal = tp;
     // this.listaCargoPersonal2.slice(tp);
      this.sourceCargoPer = new LocalDataSource();
      let i = 0;
      for (let est of tp) {
        if (est.id_estado == "1")
          this.listaCargoPersonal[i++].id_estado = this.listaEstado[0].estado;
        else
          this.listaCargoPersonal[i++].id_estado = this.listaEstado[1].estado;
      }
      this.sourceCargoPer.load(this.listaCargoPersonal);
      this.selectCargoPer = this.listaCargoPersonal[0];

      /* Get Personal*/
      this.personalService.getAll().subscribe(tp => {
        //console.log(tp);
        this.listaPersonal = tp.slice();
   //     this.listaPersonal2=tp.slice();
     /*   console.log('original');
        console.log(this.listaPersonal2);*/
        //console.log(this.listaPersonal2);

        this.selected_user = 'Todas';
        let i = 0;
        for (let x of tp) {


          if (this.listaPersonal[i].sexo == 1)
            this.listaPersonal[i].sexo = "Masculino";
          else
            this.listaPersonal[i].sexo = "Femenino";

          if(x.estado==true){
            this.listaPersonal[i].estado='Activo';
          }else{
            this.listaPersonal[i].estado='Inactivo';
          }



          let desc = this.searchId(x.id_cargo, this.listaCargoPersonal);
          this.listaPersonal[i].id_cargo = desc;
          i++;
        }

        this.sourcePer = new LocalDataSource();
        this.sourcePer.load(this.listaPersonal);
      }, err => {
        console.log(err);
        return false;
      });
    },
      err => {
        console.log(err);
        return false;
      });



    // Selecciones
    this.selectEstado = this.listaEstado[0];

    // listas
    //this.listaEstado = [];
    //this.listaCargoPersonal = [];
    //this.listaPersonal = [];

  }

  getCheck() {
   // console.log(this.modulosPersonal)
  }

  hideDetails() {
    this.flagUserFound = false;
  }

  //BUSCAR CARGO PERSONAL
  // buscar por ID y devuelve una descripcion
  searchId(id, myArray) {
    for (let entry of myArray) {
      if (entry._id === id) {
        return entry.descripcion_cargo_personal;
      }
    }
  }

  //busca por Nombre y devuelve un objeto
  searchName(name, myArray) {
    for (let entry of myArray) {
      if (entry.descripcion_cargo_personal === name) {
        return entry;
      }
    }
  }

  settingsPer = {
    mode: 'external',
    columns: {
      cedula: {
        title: 'Cédula',
        width: '15%'
      },
      nombres: {
        title: 'Nombres',
        width: '25%'
      },
      apellidos: {
        title: 'Apellidos',
        width: '25%'
      },
      telefono: {
        title: 'Teléfono',
        width: '15%'
      },
    id_cargo: {
      title: 'Cargo',
      width: '20%'
    },
      estado:{
        title:'Estado',
        width:'20%'
      }
    },
    actions: {
      add: true,
      edit: true,
      delete: false
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
      //class: 'font-size: 200%;'
    }
  };

  settingsCargPer = {
    mode: 'external',
    columns: {
      descripcion_cargo_personal: {
        title: 'Nombre',
        width: '25%'
      },
      id_estado: {
        title: 'Estado',
        width: '25%'
      },
      descripcion: {
        title: 'Descripción',
        width: '50%'
      }
    },
    actions: {
      add: true,
      edit: true,
      delete: false
    },
    attr: {
      class: 'table-bordered table-hover table-responsive'
    }
  };

  /* GESTION DE CARGO PERSONAL Y PERSONAL */
  changeCargoPerAdd($event) {
    this.flagCreateCargoPer = false;
  }

  changeCargoPerUp($event) {
    this.flagUpdateCargoPer = false;
  }

  changePerAdd($event) {
    this.flagCreatePer = false;
  }

  changePerUp($event) {
    this.flagUpdatePer = false;
  }

  // MOSTRAR FORMULARIO DE CARGO PERSONAL Y PERSONAL
  onCreateCargoPer(event: any) {
    this.flagCreateCargoPer = true;
  }

  onCreatePer(event: any) {
    this.flagCreatePer = true;
  }

  // CARGA DE DATOS EN EL FORMULARIO PARA MODIFICAR CARGO PERSONAL
  onCargoPerUpdate(event: any) {
    this.flagUpdateCargoPer = true;
    this.idCargoPersona = event.data._id;
    this.descripcionCargoPersonal = event.data.descripcion_cargo_personal;
    if (event.data.id_estado === 'Activo')
      this.selectEstado = this.listaEstado[0];
    else
      this.selectEstado = this.listaEstado[1];
  }

  showPersonal(event: any) {
    //console.log(this.tagOriginal);


    this.flagUserFound = true;
    if (event.data != undefined) {
      this.showPersona = event.data;
    //  console.log(this.showPersona);
      if(this.showPersona.permission.length>0){
        this.tags=this.showPersona.permission;
      }
      else{
        this.tags = this.tagOriginal;
       // console.log(this.tags);
      }
    }
    if (this.showPersona.sexo == "Masculino")
      this.sexo = 1;
    else
      this.sexo = 2;
    if(this.showPersona.estado=='Activo'){
      this.showPersona.estado=true;
    }else{
      this.showPersona.estado=false;
    }
  }
  // CARGA DE DATOS EN EL FORMULARIO PARA MODIFICAR PERSONAL
  onPerUpdate(event: any) {
    this.flagUpdatePer = true;
    this.idPersona = event.data._id;
    this.cedula = event.data.cedula;
    this.telefono = event.data.telefono;
    this.nombres = event.data.nombres;
    this.apellidos = event.data.apellidos;
    this.email = event.data.email;
    if (event.data.sexo == "Masculino")
      this.sexo = 1;
    else
      this.sexo = 2;
    this.fechaNacimientoString = event.data.fecha_nacimiento;
    if(event.data.estado=="Activo"){
      this.estado = true;
    }else{
      this.estado = false;
    }

    this.selectCargoPer = this.searchName(event.data.id_cargo, this.listaCargoPersonal);

    //this.banFechaNac = this.dt.toLocaleDateString();
   // this.close();
  }
  //POSICION DEL CURSOR CARGO PERSONAL
  setCursorCargoPerAdd() {
    setTimeout(function () {
      document.getElementById('descCargoPerAdd').focus();
    }, 500)
  }

  setCursorCargoPerUp() {
    setTimeout(function () {
      document.getElementById('descCargoPerAdd').focus();
    }, 500)
  }
  //INGRESO CARGO PERSONAL
  onAddCargoPersonalSubmit() {
    const cargoPersonal = {
      descripcion_cargo_personal: this.descripcionCargoPersonal,
      id_estado: this.selectEstado.id,
      descripcion: this.descripcion
    }
    //Required fields
    if (!this.validateService.validateCargoPersonal(cargoPersonal)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    //Register Tipo producto
    let a = this.cargoPersonalService.registerCargoPersonal(cargoPersonal).subscribe(data => {
      this.ngOnInit();
      this.showDialogCargoPerAdd = false;
    }, err => {
      // Log errors if any
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    });
  }
  //MODIFICAR CARGO PERSONAL
  onUpdateTPSubmit() {
   /* if (this.estado === true)
      this.estado = this.listaEstado[0].id;
    else
      this.estado = this.listaEstado[1].id;
*/
    const cargoPersonal = {
      id: this.idCargoPersona,
      descripcion_cargo_personal: this.descripcionCargoPersonal,
      id_estado: this.selectEstado.id
    }
    //Required fields
    if (!this.validateService.validateCargoPersonal(cargoPersonal)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    //Update Tipo producto
    this.cargoPersonalService.updateCargoPersonal(cargoPersonal).subscribe(data => {
      this.ngOnInit();
      this.showDialogCargoPerUp = false;
    }, err => {
      // Log errors if any
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    });
  }

  onDeleteCP(event): void {
    this.openDialog(event.data);
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          this.sourceCargoPer.remove(data);
          // remove from database
          this.cargoPersonalService.deleteCargoPersonal(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');
          });
        }
      }
    });
  }

  //POSICION DEL CURSOR PERSONAL
  setCursorPerAdd() {
    setTimeout(function () {
      document.getElementById('ci2').focus();
    }, 500)
  }

  onChangeCargPer() {
    if (this.descripcionCargoPersonal.length == 1)
      this.descripcionCargoPersonal = this.descripcionCargoPersonal.charAt(0).toUpperCase();

    if (this.descripcionCargoPersonal.length < 2)
      document.getElementById("descCargoPerAdd").style.borderColor = "#FE2E2E";

    if (this.descripcionCargoPersonal.length > 1)
      document.getElementById("descCargoPerAdd").style.borderColor = "#DADAD2";
  }

  onChangeDesc($event) {
    if (this.descripcion.length == 1)
      this.descripcion = this.descripcion.charAt(0).toUpperCase();

  }

  onChange() {

    if (this.nombres.length == 1)
      this.nombres = this.nombres.charAt(0).toUpperCase();

    if (this.nombres.length < 4)
      document.getElementById("nombres").style.borderColor = "#FE2E2E";

    if (this.nombres.length > 2)
      document.getElementById("nombres").style.borderColor = "#DADAD2";

    if (this.apellidos.length == 1)
      this.apellidos = this.apellidos.charAt(0).toUpperCase();

    if (this.apellidos.length < 4)
      document.getElementById("apellidos").style.borderColor = "#FE2E2E";

    if (this.apellidos.length > 2)
      document.getElementById("apellidos").style.borderColor = "#DADAD2";

    if (this.cedula.length != 10)
      document.getElementById("ci").style.borderColor = "#FE2E2E";

    if (this.cedula.length === 10) {
      if (!this.validateService.validarRucCedula(this.cedula)) {
        document.getElementById("ci").style.borderColor = "#FE2E2E";
        this.messageGrowlService.notify('error', 'Error', 'Cédula Inválida!');
      } else
        document.getElementById("ci").style.borderColor = "#DADAD2";
    }

    if (this.telefono.length < 9)
      document.getElementById("telefono").style.borderColor = "#FE2E2E";

    if (this.telefono.length == 9 || this.telefono.length == 10)
      document.getElementById("telefono").style.borderColor = "#DADAD2";

    if (!this.validateService.validateEmail(this.email)) {
      document.getElementById("email").style.borderColor = "#FE2E2E";
    } else
      document.getElementById("email").style.borderColor = "#DADAD2";

  }

  onChangeValidator(option,id){
   /* console.log(option);
    console.log(id);*/
    switch (option){
      /**
       * Author Xaipo
       * lista de opciones de la validacion del case para toda validacion se requiere el id y la opcion a validar
       *  cuando se pone 1 para validar cedula
       *  validaciones de string para que no se utlicen espacios en blanco al inicio
       * */


      case 1:
            if (this.cedula.length != 10)
            document.getElementById(id).style.borderLeft = "5px solid #a94442";
            if (this.cedula.length != 13)
              document.getElementById(id).style.borderLeft = "5px solid #a94442";
            if (this.cedula.length == 10 || this.cedula.length == 13) {
              if (!this.validateService.validarRucCedula(this.cedula)) {
                this.messageGrowlService.notify('error', 'Error', 'Cedula/Ruc Inválido!');
                document.getElementById(id).style.borderLeft = "5px solid #a94442";
              } else
              //document.getElementById("ci").style.borderColor = "#DADAD2";
                document.getElementById(id).style.borderLeft = "5px solid #42A948";//green
            }
            break;
      case 2 : var aux =(<HTMLInputElement>document.getElementById(id)).value;
               /* console.log(aux.length);
                aux=aux.trim();
                console.log(aux.length);*/
               if(aux[0]==' '){
                 aux=aux.substring(1);
                // console.log(aux);
               }
             (<HTMLInputElement>document.getElementById(id)).value = this.formatterService.toTitleCase(aux);
              ;break;

      case 3: var correo = (<HTMLInputElement>document.getElementById(id)).value;
        if(correo[0]==' '){
          correo=correo.substring(1);
         // console.log(aux);
        }
              if (this.validateService.validateEmail(correo)) {
                document.getElementById(id).style.borderLeft = "5px solid #42A948";
              }
              else {
                document.getElementById(id).style.borderLeft = "5px solid #a94442";
              }break;
      default : alert('en validador poner opcion y el id para que funcione');
               break;
    }



  }
  // METODO PARA FECHAS
  /*public getDate(): number {
    //this.fechaNacimientoString = this.dt.toLocaleDateString();
    return this.dt && this.dt.getTime() || new Date().getTime();
  }*/
  // MOSTRAR Y CERRAR CALENDARIO
 /* showCalendar() {
    if (this.banCalendar == 1) {
      this.open();
      this.banCalendar = 2;
    } else {
      this.close();
      this.banCalendar = 1;
      this.descripcionCargoPersonal = this.dt.toLocaleDateString();
    }
  }*/
  ///CERRAR CALENDARIO
/*
  hideCalendar() {
    var fe = this.dt.toLocaleDateString();
    if ((fe != this.banFechaNac)) {
      //this.close();
      this.banFechaNac = this.dt.toLocaleDateString();
      this.descripcionCargoPersonal = this.dt.toLocaleDateString();
    }
  }
*/

 /* open() {
    this.showDatepicker = true;
  }

  close() {
    this.showDatepicker = false;
  }*/

  setCursorPerUp() {
    setTimeout(function () {
      document.getElementById('ci').focus();
    }, 500)
  }
  //INGRESO PERSONAL
  onAddPerSubmit() {
    const personal = {
      cedula: this.cedula,
      nombres: this.nombres,
      apellidos: this.apellidos,
      fecha_nacimiento: this.fechaNacimientoString,
      telefono: this.telefono,
      sexo: this.sexo,
      email: this.email,
      id_cargo: this.selectCargoPer._id,
      estado:true
    }

    //Required fields
    if (!this.validateService.validatePersonal(personal)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    // Validate Email
    if (!this.validateService.validateEmail(personal.email)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos vacios!');
      return false;
    }
    //Register Personal
    this.personalService.registerPersonal(personal).subscribe(data => {
      //add user
      const newUser = {
        username: this.cedula,
        name: this.nombres + this.apellidos,
        password: this.cedula,
        email: this.email,
        estado:1,

      }
      this.authService.registerUser(newUser).subscribe(data => {
      }, err => {
        console.log(err);
        this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
      })

      this.ngOnInit();
      this.showDialogPerAdd = false;
    }, err => {
      // Log errors if any
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    });
  }
  //MODIFICAR PERSONAL
  onUpdatePerSubmit() {
    const personal = {
      _id: this.idPersona,
      cedula: this.cedula,
      nombres: this.nombres,
      apellidos: this.apellidos,
      fecha_nacimiento: this.descripcionCargoPersonal,
      telefono: this.telefono,
      sexo: this.sexo,
      email: this.email,
      id_cargo: this.selectCargoPer._id,
      estado: this.estado
    }

    //Required fields
    if (!this.validateService.validatePersonal(personal)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos Vacíos!');
      return false;
    }
    // Validate Email
    if (!this.validateService.validateEmail(personal.email)) {
      this.messageGrowlService.notify('error', 'Error', 'Campos Vacíos!');
      return false;
    }
    //Register Personal
    this.personalService.updatePersonal(personal).subscribe(data => {
      this.messageGrowlService.notify('success', 'Exito', 'Ingreso exitoso!');
      this.ngOnInit();
      this.showDialogPerUp = false;
    }, err => {
      // Log errors if any
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    });
  }

  onDeleteP(event): void {
    this.openDialogP(event.data);
  }

  openDialogP(data) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result.localeCompare('Aceptar') === 0) {
          this.sourcePer.remove(data);
          // remove from database
          this.personalService.deletePersonal(data._id).subscribe(data => {
            this.messageGrowlService.notify('warn', 'Advertencia', 'Registro eliminado!');
          }, err => {
            console.log(err);
            this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!!');
          });
        }
      }
    });
  }

  /* LOG ACTIVITY */
  generateLog() {
   /* console.log(this.fecha_desde);
    console.log(this.fecha_hasta);*/
    console.log(this.validateService.getDateTimeEsPrimeNG())
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


  onCancelPersonal(){
    this.fechaNacimientoString="";
    this.sexo=1;
    this.email='';
    this.apellidos='';
    this.nombres='';
    this.telefono='';
    this.cedula='';
  }
  onCanceCargo(){
    this.descripcion='';
    this.selectEstado='';
    this.descripcionCargoPersonal='';
  }

  updatePermission(){
   // console.log(this.showPersona.id_cargo);
    //console.log(this.listaCargoPersonal);
   // console.log(this.listaPersonal2);
   var cargo=this.showPersona.id_cargo;
    let resp1 = this.listaCargoPersonal.filter(function (obj:any) {
      return obj.descripcion_cargo_personal==(cargo);
    });
    var id=this.showPersona._id;

    var resp=this.listaPersonal.filter((persona:any)=>persona._id===id);
   // console.log(resp);
    resp[0].id_cargo=resp1[0]._id;
    resp[0].permission=this.tags;

    this.personalService.updatePersonal(resp[0]).subscribe(data => {
      this.messageGrowlService.notify('success', 'Exito', 'Ingreso exitoso!');
      this.ngOnInit();
      this.showDialogPerUp = false;
    }, err => {
      // Log errors if any
      console.log(err);
      this.messageGrowlService.notify('error', 'Error', 'Algo salió mal!');
    });

  }

  cencelPermission(){


  }
}


