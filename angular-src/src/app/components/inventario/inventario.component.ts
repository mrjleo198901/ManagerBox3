import { Component, OnInit } from '@angular/core';
import { MessageGrowlService } from '../../services/message-growl.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ValidateService } from '../../services/validate.service';
import { Message, SelectItem } from 'primeng/primeng';
import { AuthService } from '../../services/auth.service';

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

  constructor(private messageGrowlService: MessageGrowlService,
    private formBuilder: FormBuilder,
    private validateService: ValidateService) { }

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

}
