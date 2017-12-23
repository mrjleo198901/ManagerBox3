import { Component, OnInit } from '@angular/core';
import { MessageGrowlService } from '../../services/message-growl.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ValidateService } from '../../services/validate.service';
import { Message, SelectItem } from 'primeng/primeng';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  msgs: Message[] = [];
  userform: FormGroup;
  submitted: boolean;
  genders: SelectItem[];
  description: string;
  nombre;
  public static updateUserStatus: Subject<boolean> = new Subject();

  constructor(private messageGrowlService: MessageGrowlService,
    private formBuilder: FormBuilder,
    private validateService: ValidateService) {
    InventarioComponent.updateUserStatus.subscribe(res => {
      console.log("entrooooooo")
    });

    var x = window.innerWidth;
    this.onRzOnInit(x);

    var x = window.innerWidth;
    this.onRzOnInit(x);
  }

  ngOnInit() {

    this.userform = this.formBuilder.group({
      'firstname': new FormControl('', Validators.required),
      'lastname': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      'description': new FormControl(''),
      'gender': new FormControl('', Validators.required)
    });

    this.genders = [];
    this.genders.push({ label: 'Select Gender', value: '' });
    this.genders.push({ label: 'Male', value: 'Male' });
    this.genders.push({ label: 'Female', value: 'Female' });

  }

  onSubmit(value: string) {
    console.log(value)
    this.submitted = true;
    this.msgs = [];
    this.msgs.push({ severity: 'info', summary: 'Success', detail: 'Form Submitted' });
  }

  get diagnostic() {
    return JSON.stringify(this.userform.value);
  }

  showInfo() {
    this.messageGrowlService.notify('info', 'some component', 'ngOnInit was called!');
  }

  showWarn() {
    this.messageGrowlService.notify('warn', 'some component', 'ngOnInit was called!');
  }

  showError() {
    this.messageGrowlService.notify('error', 'some component', 'ngOnInit was called!');
  }

  showSuccess() {
    this.messageGrowlService.notify('success', 'some component', 'ngOnInit was called!');
  }


  //dynamic Tabs
  public angular2TabsExample: Array<any> = [
    { title: 'Angular Tab 1', content: 'Angular 2 Tabs are navigable windows, each window (called tab) contains content', disabled: false, removable: true },
    { title: 'Angular Tab 2', content: 'generally we categorize contents depending on the theme', disabled: false, removable: true },
    { title: 'Angular Tab (disabled) X', content: 'Angular 2 Tabs Content', disabled: true, removable: true }
  ];
  //on select a tab do something
  public doOnTabSelect(currentTab: any) {
    console.log("doOnTabSelect" + currentTab);
  };
  //on remove Tab do something
  public removeThisTabHandler(tab: any) {
    console.log('Remove Tab handler' + tab);
  };


  openCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_oi0sKPJYLGjdvOXOM8tE8cMa',
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    handler.open({
      name: 'ManagerBox',
      description: 'Pago en Línea',
      amount: 20
    });

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

}
