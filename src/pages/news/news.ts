import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  newsDetails;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.newsDetails = this.navParams.data;
    console.log(this.newsDetails , 'this.newsDetails')
  }

  ionViewDidLoad() {
    console.log(this.newsDetails, 'sfsfsf');
    console.log('ionViewDidLoad NewsPage');
  }

}
