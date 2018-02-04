import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {
    ratedValueQuestion1:number = 0;
    ratedValueQuestion2:number =0;
    ratedValueQuestion3:number=0;
  saturation;
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
  }

  setRate(rate, qustionNumber){

    switch (qustionNumber){
      case '1':

        break;
      case '2':


        break;
      case '3':

        break;

    }


  }

}
