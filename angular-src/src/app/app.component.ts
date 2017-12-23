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
    //console.log(x)
    if (x >= 768 && x < 992) {
      this.flagSp = true;
    } else {
      this.flagSp = false;
    }
    if (x >= 992 && x < 1200) {
      this.flagSp1 = true;
    } else {
      this.flagSp1 = false;
    }
  }

  onRzOnInit(x) {
    if (x >= 768 && x < 992) {
      this.flagSp = true;
    } else {
      this.flagSp = false;
    }
    if (x >= 992 && x < 1200) {
      this.flagSp1 = true;
    } else {
      this.flagSp1 = false;
    }
  }
}