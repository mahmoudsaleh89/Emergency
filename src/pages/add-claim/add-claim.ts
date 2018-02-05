import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-add-claim',
  templateUrl: 'add-claim.html',
})
export class AddClaimPage {
claimTxt="";
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public menuCtrl: MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddClaimPage');
  }


  onSendClaim(){
    console.log(this.claimTxt);
    this.navCtrl.pop();

  }

  onCloseModal() {
    this.navCtrl.pop();
  }

}
