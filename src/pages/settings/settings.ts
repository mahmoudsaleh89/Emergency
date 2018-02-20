import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {ConfigProvider} from "../../providers/config/config";
import {Storage} from '@ionic/storage';
import {TranslateService} from "@ngx-translate/core";
import {DatePicker} from "@ionic-native/date-picker";


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  setGender="";
  male="";
  fmale="";
  setlang="";
  arabic="";
  english="";
  urdo="";
  unspecified="";
  currentTime="";
  currentDate="";
  selectedDate:any;
  countICENumbers : number = 0;



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl : ActionSheetController,
              private datePicker: DatePicker,
              private toastCtrl : ToastController,
              public translate: TranslateService,
              public storage: Storage,
              public platform: Platform,
              public config : ConfigProvider) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {
    let d = new Date();
    this.currentDate = d.toString().substr(4, 12)
    let selectBirthday = document.querySelector('#birthday');
    selectBirthday.innerHTML =  this.currentDate;
    console.log('ionViewDidLoad SettingsPage');
  }
  onSetGender() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.setGender,
      buttons: [
        {
          text: this.male,
          role: this.male,
          handler: () => {
            let select = document.querySelector('#gender');
            select.innerHTML = this.male;
            console.log('male clicked');
          }
        },
        {
          text: this.fmale,
          role: this.fmale,
          handler: () => {
            let select = document.querySelector('#gender');
            select.innerHTML = this.fmale;
            console.log('Fmale clicked');
          }
        },
        {
          text: this.unspecified,
          role: this.unspecified,
          handler: () => {
            let select = document.querySelector('#gender');
            select.innerHTML = this.unspecified;
            console.log('unspecified clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  onSetLanguage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.setlang,
      buttons: [
        {
          text: this.arabic,
          role: this.arabic,
          handler: () => {
            let select = document.querySelector('#lang');
            select.innerHTML = this.arabic;
            console.log('arabic clicked');
          }
        },
        {
          text: this.english,
          role: this.english,
          handler: () => {
            let select = document.querySelector('#lang');
            select.innerHTML = this.english;
            console.log('English clicked');
          }
        },
        {
          text: this.urdo,
          role: this.urdo,
          handler: () => {
            let select = document.querySelector('#lang');
            select.innerHTML = this.urdo;
            console.log('urdo clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  onSetBirthday() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      allowOldDates: false,
      todayText: 'today'
    }).then(
      date => {
        debugger;
        this.selectedDate = date;
        let tempSelectedDate = this.selectedDate;
        this.currentDate = tempSelectedDate.toString().substr(4, 12);
        let selectBirthday = document.querySelector('#birthday');
        selectBirthday.innerHTML =  this.currentDate;
      },
      err => {
        let d = new Date();
        this.currentDate = d.toString().substr(4, 12)
        let selectBirthday = document.querySelector('#birthday');
        selectBirthday.innerHTML =  this.currentDate;
        /*let toast = this.toastCtrl.create({
          message: 'Please Select date',
          duration: 3000,
          position: 'bottom'
        }).present();*/
      }
    );
  }

  onAddIceNumbers(){
    this.countICENumbers  ++;
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      if (result == 'arabic') {
        this.setGender="اختيار الجنس";
        this.male="ذكر";
        this.fmale="انثى";
        this.unspecified="غير محدد";
        this.setlang = "تحديد اللغة";
        this.english="English";
        this.arabic="العربية";
        this.urdo = "اردو";
        this.storage.set('lang', 'ar');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';
      }
      else if (result == 'english') {
        this.setGender=" Select gender";
        this.male=" Male";
        this.fmale=" Female";
        this.unspecified="Unspecified";
        this.setlang = "Select Language";
        this.english="English";
        this.arabic="العربية";
        this.urdo = "اردو";
        this.storage.set('lang', 'en');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';
      }
      else  {
        this.setGender="اختيار الجنس";
        this.male="ذكر";
        this.fmale="انثى";
        this.unspecified="غير محدد";
        this.setlang = "تحديد اللغة";
        this.english="English";
        this.arabic="العربية";
        this.urdo = "اردو";
        this.storage.set('lang', 'ar');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';

      }

    });
  }
}
