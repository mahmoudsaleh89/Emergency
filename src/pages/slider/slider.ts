import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, Slides} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';
import {ConfigProvider} from "../../providers/config/config";

@IonicPage()
@Component({
  selector: 'page-slider',
  templateUrl: 'slider.html',
})
export class SliderPage {
  @ViewChild(Slides) slides: Slides;
  hide: boolean;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public storage: Storage,
              public config: ConfigProvider,
              public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SliderPage');
  }
  onSetLang(language) {
    debugger;
    this.config.language = language;
    this.storage.set('firstRun', false);
    if (language == 'arabic') {
      this.translate.setDefaultLang('ar');
      this.platform.setDir('rtl', true);
      this.platform.setLang('ar', true);
      this.storage.set('lang', language);

    } else if (language == 'english') {
      this.translate.setDefaultLang('en');
      this.platform.setDir('ltr', true);
      this.platform.setLang('en', true);
      this.storage.set('lang', language);

    }
    else {
      this.translate.setDefaultLang('en');
      this.platform.setDir('ltr', true);
      this.storage.set('lang', language);
      this.platform.setLang('en', true);

    }
    let index = this.slides.getActiveIndex();
    this.slides.slideNext(500);
    console.log(index);
  }

}
