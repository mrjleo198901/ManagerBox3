import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  //Width detection
  flagSp = false;
  flagSp1 = false;

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    var x = window.innerWidth;
    this.onRzOnInit(x);
  }

  onResize(event) {
    let x = event.target.innerWidth;
    if (x > 1023 && x < 1226) {
      this.flagSp1 = true;
    } else {
      this.flagSp1 = false;
    }
  }

  onRzOnInit(x) {
    if (x > 1023 && x < 1226) {
      this.flagSp1 = true;
    } else {
      this.flagSp1 = false;
    }
  }
}