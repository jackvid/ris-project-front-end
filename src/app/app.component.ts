import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  feature: string = 'recipes';

  recipes: boolean = false;
  shoppingList: boolean = false;

  featureSelected(feature: string) {
    this.feature = feature;
  }

  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyDR920Tn6RLtLsXBhhSN3o1ueZ2FXI9L8I",
      authDomain: "ng-recipe-book-97e2d.firebaseapp.com",
      databaseURL: "https://ng-recipe-book-97e2d.firebaseio.com",
      projectId: "ng-recipe-book-97e2d",
      storageBucket: "ng-recipe-book-97e2d.appspot.com",
      messagingSenderId: "671230117939"
    });
  }

}
