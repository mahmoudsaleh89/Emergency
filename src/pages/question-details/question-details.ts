import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-question-details',
  templateUrl: 'question-details.html',
})
export class QuestionDetailsPage {
question : any ;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.question =  this.navParams.data.theQuestion;
    console.log( this.question);
  }

  ionViewDidLoad() {
    //this.question =  this.navParams.data;
    console.log('ionViewDidLoad QuestionDetailsPage');
  }

}
