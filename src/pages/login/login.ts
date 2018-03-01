import {Component, Inject, forwardRef, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Platform, Slides, ToastController} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';
import {ConfigProvider} from "../../providers/config/config";
import {NgForm} from "@angular/forms";
import {HomePage} from '../home/home';
import {AccountProvider} from '../../providers/account/account';
import {StatusBar} from '@ionic-native/status-bar';
import {MyApp} from "../../app/app.component";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  language_is = "english";
  isValidFormSubmitted = false;
  LoginInfo = {
    userPhone: "",
    pass: ""
  };
  newUser = {
    "PhoneNumber": "",
    "firstName": "",
    "lastName": "",
    "Password": "",
    "ConfirmPassword": ""
  };
  showRegister: boolean = false;
  errServer = "";
  userErr = "";
  PhoneRegsterd = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public storage: Storage,
              public config: ConfigProvider,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              public account: AccountProvider,
              public toastCtrl: ToastController,
              public statusBar: StatusBar,
              @Inject(forwardRef(() => MyApp)) private myapp: MyApp) {
  }

  ionViewDidLoad() {

    this.setLangAndDirction();

  }

  onSetLanguage() {
    debugger;
    if (this.language_is == 'arabic') {
      this.translate.setDefaultLang('ar');
      this.platform.setDir('rtl', true);
      this.platform.setLang('ar', true);
      this.storage.set('lang', this.language_is);
    }
    else if (this.language_is == 'english') {
      this.translate.setDefaultLang('en');
      this.platform.setDir('ltr', true);
      this.platform.setLang('en', true);
      this.storage.set('lang', this.language_is);
    }
  }

  onShowRegisterForm() {
    if (this.showRegister) {
      this.showRegister = false
    } else {
      this.showRegister = true;
    }
  }

  onRegister(regForm: NgForm) {
    debugger;
    this.isValidFormSubmitted = true;
    if (regForm.value.password !== regForm.value.passwordConfirm) {
      this.isValidFormSubmitted = false;
      return;
    }
    if (regForm.invalid) {
      this.isValidFormSubmitted = false;
      return;
    }

    console.log(regForm.value);
    let loader = this.loadingCtrl.create({
      content: 'Please wait',
    });
    loader.present();
    this.account.onCreateProfile("", regForm.value.firstName, regForm.value.lastName, "", regForm.value.phoneNumber, "", this.language_is, regForm.value.password,"")
      .then((res) => {
        loader.dismiss();
        if (res == 'no_user') {
          debugger;
          this.statusBar.backgroundColorByHexString('#ed5565');
          let toast = this.toastCtrl.create({
            message: this.PhoneRegsterd,
            duration: 2000,
            position: 'top',
            cssClass: "warning_toast"
          });

          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
          });


        }
        else if (res == 'no_user_err') {
          debugger;
          this.statusBar.backgroundColorByHexString('#ed5565');
          let toast = this.toastCtrl.create({
            message: this.errServer,
            duration: 2000,
            position: 'top',
            cssClass: "warning_toast"
          });

          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
          });

        }
        else {
          debugger;
          let tempRes: any = res;
          this.account.userInformation = tempRes;
          this.storage.set('lang', this.account.userInformation.Language);
          this.storage.set('user', this.account.userInformation);
          this.storage.set('have_account',true);
          this.myapp.initializeApp();
          //this.navCtrl.setRoot(HomePage);
        }

      })
      .catch((err) => {
      })


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
    let loader = this.loadingCtrl.create({
      content: 'Please wait',
    });
    loader.present();
    this.account.onGetProfile(form.value.phone, form.value.pass)
      .then((res) => {
        debugger;
        loader.dismiss();
        if (res == 'no_user') {
          debugger;
          this.statusBar.backgroundColorByHexString('#ed5565');
          let toast = this.toastCtrl.create({
            message: this.userErr,
            duration: 2000,
            position: 'top',
            cssClass: "warning_toast"
          });

          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
          });


        }
        else if (res == 'no_user_err') {
          debugger;
          this.statusBar.backgroundColorByHexString('#ed5565');
          let toast = this.toastCtrl.create({
            message: this.errServer,
            duration: 2000,
            position: 'top',
            cssClass: "warning_toast"
          });

          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
          });

        }
        else {
          debugger;
          let tempRes: any = res;
          this.account.userInformation = tempRes;
          this.storage.set('lang', this.account.userInformation.Language);
          this.storage.set('user', this.account.userInformation);
          this.storage.set('have_account',true);
          this.myapp.initializeApp();
          //this.navCtrl.setRoot(HomePage);
        }
      })
      .catch((err) => {
        debugger;
      })
    console.log(form);

  }


  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      if (result == 'arabic') {

        this.errServer = "لم يتم الحفظ الشبكه مشغوله";
        this.userErr = "خطأ في الرسم او رقم الهاتف";
        this.PhoneRegsterd = "تم استخدام هذا الرقم سابقا";
        this.storage.set('lang', 'arabic');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';
      }
      else if (result == 'english') {
        this.errServer = "Saved failed , Internal Server Error";
        this.userErr = "Error phone number or password ";
        this.PhoneRegsterd = "this phone number already registered";
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';
      }
      else {
        this.errServer = "Saved failed , Internal Server Error";
        this.userErr = "Error phone number or password ";
        this.PhoneRegsterd = "this phone number already registered";
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';

      }

    });
  }

}
