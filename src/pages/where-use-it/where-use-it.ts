import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the WhereUseItPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-where-use-it',
  templateUrl: 'where-use-it.html',
})
export class WhereUseItPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WhereUseItPage');
  }

}
