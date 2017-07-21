#Setup @NgModule

<!--Open src/app/app.module.ts and import the AgmCoreModule.
You neeed to provide a Google Maps API key to be able to see a Map. Get an API key here.-->

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { AgmCoreModule } from 'angular2-google-maps/core';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_KEY'
    })
  ],
  providers: [],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

#Extending the app component

<!--Angular CLI already created an app component the we'll now use to create our first google map.
Open the file src/app/app.component.ts and modify it like below:-->

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  title: string = 'My first angular2-google-maps project';
  lat: number = 51.678418;
  lng: number = 7.809007;
}

#Setup the template

<!--Open the file src/app/app.component.html and paste the following content:-->

<h1>{{ title }}</h1>

<!-- this creates a google map on the page with the given lat/lng from -->
<!-- the component as the initial center of the map: -->

<sebm-google-map [latitude]="lat" [longitude]="lng">
  <sebm-google-map-marker [latitude]="lat" [longitude]="lng"></sebm-google-map-marker>
</sebm-google-map>

#Setup the CSS file

<!--Open the file src/app/app.component.css and paste the following content:-->

.sebm-google-map-container {
  height: 300px;
}

# for advanced usage you can check 
https://angular-maps.com/docs/api/latest/ts/
