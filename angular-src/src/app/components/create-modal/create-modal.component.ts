import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'mm-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.css']
})
export class CreateModalComponent implements OnInit {

  userDetails: FormGroup;

  @ViewChild('modal')
  modal: CreateModalComponent;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userDetails = this.fb.group({
      location: [''],
      fullname: ['']
    });
  }

  open(size: string, source) {
    //this.modal.open(size);
    console.log("llego");
  }

  onSubmit() {
    this.modal.close();
  }

  close() {
    this.modal.close();
  }

  add(): void {
  }
}
