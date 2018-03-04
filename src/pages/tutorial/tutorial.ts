import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {TranslateService} from "@ngx-translate/core";
import {StatusBar} from "@ionic-native/status-bar";
import {ConfigProvider} from "../../providers/config/config";

/**
 * Generated class for the TutorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {
  fabslist: any;
  step: number = 1;
  callBtn: boolean = false;
  silentBtn: boolean = false;
  oneClickCallBtn: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public translate: TranslateService,
              public platform: Platform,
              public statusBar: StatusBar,
              public config: ConfigProvider) {
    this.config.onGetFabsOption().then((data) => {
      this.fabslist = data;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
  }

  onCloseModal() {
    debugger;
    this.navCtrl.pop();
  }

  startTutorials() {
    debugger
    this.step++
    if (this.step < 3) {
      return;
    } else if (this.step > 3) {
      this.step = 1;
      this.navCtrl.pop();
    }

  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      if (result == 'arabic') {

        this.storage.set('lang', 'arabic');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);

      }
      else if (result == 'english') {

        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);

      }
      else {

        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);


      }

    });
  }

}
