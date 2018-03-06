import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {OprationsProvider} from "../../providers/oprations/oprations";
import {AccountProvider} from "../../providers/account/account";
import {Storage} from '@ionic/storage';
import {TranslateService} from "@ngx-translate/core";
import {StatusBar} from "@ionic-native/status-bar";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
  selector: 'page-add-claim',
  templateUrl: 'add-claim.html',
})
export class AddClaimPage {
  claimTxt = "";
  sendCliamSucsess = "";
  sendCliamErr = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public menuCtrl: MenuController,
              public opration: OprationsProvider,
              public account: AccountProvider,
              public storage: Storage,
              public translate: TranslateService,
              public platform: Platform,
              public statusBar: StatusBar,
              private toastCtrl: ToastController) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddClaimPage');
  }


  onSendClaim() {

    console.log(this.claimTxt);
    this.opration.onSendCliam(this.account.userInformation.Id, this.account.userInformation.PhoneNumber, this.claimTxt)
      .then((res) => {

        if (res) {
         /* this.toastCtrl.create({
            message: this.sendCliamSucsess,
            duration: 3000
          }).present();
          debugger
          this.navCtrl.popTo(HomePage);*/
          this.statusBar.backgroundColorByHexString('#4f6c84');
          let toast = this.toastCtrl.create({
            message: this.sendCliamSucsess,
            duration: 2000,
            position: 'top'
          });
          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
            this.navCtrl.popTo(HomePage);
          });
        } else {
       /*   this.toastCtrl.create({
            message: this.sendCliamErr,
            duration: 3000
          }).present();*/

          this.statusBar.backgroundColorByHexString('#ed5565');
          let toast = this.toastCtrl.create({
            message: this.sendCliamErr,
            duration: 2000,
            position: 'top',
            cssClass: "warning_toast"
          });
          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
          });
        }
      })
      .catch((err) => {
        this.statusBar.backgroundColorByHexString('#ed5565');
        let toast = this.toastCtrl.create({
          message: this.sendCliamErr,
          duration: 2000,
          position: 'top',
          cssClass: "warning_toast"
        });
        toast.present();
        toast.onDidDismiss(() => {
          this.statusBar.backgroundColorByHexString('#253746');
        });
      })


  }

  onCloseModal() {
    this.navCtrl.pop();
  }


  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      if (result == 'arabic') {
        this.sendCliamSucsess = "سوف يتم مراجعة الشكوى باسرع وقت ممكن، شكرا لك";
        this.sendCliamErr = " عذرا، لم يتم ارسال الشكوى يرجى المحاولة لاحقا";
        this.storage.set('lang', 'arabic');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);

      }
      else if (result == 'english') {
        this.sendCliamSucsess = "The complaint will be reviewed as soon as possible , Thank you";
        this.sendCliamErr = " Sorry , error while sending  claim try again";
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);

      }
      else {
        this.sendCliamSucsess = "The complaint will be reviewed as soon as possible , Thank you";
        this.sendCliamErr = " Sorry , error while sending  claim try again";
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);


      }

    });
  }
}
