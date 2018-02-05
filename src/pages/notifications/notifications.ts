import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ConfigProvider} from "../../providers/config/config";
import {RatingPage} from "../rating/rating";

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})

export class NotificationsPage {
notifications:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private config: ConfigProvider) {
    this.config.getNotificationList().then((res)=>{
      this.notifications = res;
    })
  }

  ionViewDidLoad() {
    console.log(this.notifications);
    console.log('ionViewDidLoad NotificationsPage');
  }

  onShowNotificationDET(notify){
      if(notify.notifyType == 1){
        this.navCtrl.setRoot(RatingPage);
      }
      else{
        return;
      }
  }

}
