import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Platform, Slides} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';
import {ConfigProvider} from "../../providers/config/config";
import {NgForm} from "@angular/forms";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
  selector: 'page-slider',
  templateUrl: 'slider.html'
})
export class SliderPage {
  language_is = "english";
  isValidFormSubmitted = false;
  LoginInfo = {
    userPhone: "",
    pass: ""
  };
  newUser = {
    "PhoneNumber" : "",
    "firstName":"",
    "lastName":"",
    "Password":"",
    "ConfirmPassword":""
  };
  showRegister: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public storage: Storage,
              public config: ConfigProvider,
              public platform: Platform,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.translate.setDefaultLang('en');
    this.platform.setDir('ltr', true);
    this.platform.setLang('en', true);
    console.log('ionViewDidLoad SliderPage');

  }

  onSetLang(language) {
    debugger;
    this.config.language = language;
    this.storage.set('firstRun', false);
    if (language == 'arabic') {
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
  }

  onShowRegisterForm() {
    if (this.showRegister) {
      this.showRegister = false
    } else {
      this.showRegister = true;
    }
  }
  onRegister(regForm : NgForm){
    this.isValidFormSubmitted = true;
    if (regForm.invalid) {
      this.isValidFormSubmitted = false;
      return;
    }
    console.log(regForm.value);
  }

  Skip() {
    this.navCtrl.setRoot(HomePage);
  }

  onLogin(form: NgForm) {
    debugger;

    this.isValidFormSubmitted = true;
    if (form.invalid) {
      this.isValidFormSubmitted = false;
      return;
    }
    console.log(form.value);
    /*let loader = this.loadingCtrl.create({
      content: 'Please wait',
    });
    loader.present();
    console.log(form);*/

  }
}
