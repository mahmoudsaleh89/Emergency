import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ConfigProvider} from "../../providers/config/config";
import {RatingPage} from "../rating/rating";
import {NewsPage} from "../news/news";
import {Storage} from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})

export class NotificationsPage {
  notifications : any=[];
  ratingQuestions:any;
  news:any;
  IOS_BACK= "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private config: ConfigProvider,
              private storage: Storage) {
  /*  this.config.getNotificationList().then((res) => {
      this.notifications = res;
    })*/
  }
  ionViewDidEnter(){
    this.config.getNotificationList().then((res) => {
      this.notifications = res;
    });
    console.log(this.notifications,"ionViewDidEnter");
  }
  ionViewDidLoad() {
    console.log(this.notifications);
    console.log('ionViewDidLoad NotificationsPage');
  }

  onShowNotificationDET(notify) {
    if (notify.notifyType == 1) {
      this.ratingQuestions = notify.notifyData;
        this.navCtrl.setRoot(RatingPage,{qus:this.ratingQuestions});
    }
    else {
      debugger;
      for (var i=0; i < this.notifications.length; i++) {
        if (this.notifications[i].notifyData.qusID === notify.notifyData.qusID) {
          notify.notifyData.seen = true;
        }
        console.log(this.notifications);
        debugger;
       this.storage.set('notificationList',this.notifications);
      }
      this.news = notify.notifyData;
      console.log(notify,'this is all notifiy');
      this.navCtrl.push(NewsPage,{__news:this.news});
    }
  }

}
