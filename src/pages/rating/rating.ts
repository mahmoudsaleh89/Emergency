import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, Navbar, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {ConfigProvider} from "../../providers/config/config";
import {HomePage} from "../home/home";
import {Storage} from '@ionic/storage';
import {StatusBar} from "@ionic-native/status-bar";
import {AccountProvider} from "../../providers/account/account";

@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {
  ratingQuestions: any;
  suggest: string;
  answers = [];
  activeDisabled = false;
  PleaseWait;
  successNote;
  errNote;
  shit: any;
  sending = "";
  IOS_BACK= "";
  @ViewChild(Navbar) navbar: Navbar;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public config: ConfigProvider,
              private toastCtrl: ToastController,
              private storage: Storage,
              public statusBar: StatusBar,
              public loadingCtrl: LoadingController,
              public account: AccountProvider,
              public platform: Platform) {
    this.setLangAndDirction();
    this.ratingQuestions = [];

    console.log(this.navParams);
    this.ratingQuestions = this.navParams.get('qus');

  }

  ionViewWillEnter() {

    console.log(this.ratingQuestions, 'hello from page');
  }

  ionViewDidLoad() {


    console.log(this.ratingQuestions);
    console.log('ionViewDidLoad RatingPage');
  }

  onsetRate() {

    this.answers=[];
    for (var i = 0; i < this.ratingQuestions.length; i++) {
      debugger
      let answer = {
        QuestionId: this.ratingQuestions[i].qusID,
        RatingValue: this.ratingQuestions[i].value
      };
      this.answers.push(answer);
    }
    let loading = this.loadingCtrl.create({
      content: this.sending
    });

    loading.present();

    this.config.onSubmitRating(this.account.userInformation.Id, this.suggest, this.account.userInformation.PhoneNumber, this.answers)
      .then((qusRes) => {

      loading.dismiss();
        if (qusRes) {

          console.log(qusRes);
          let toast = this.toastCtrl.create({
            message: this.successNote,
            duration: 2500,
            position: 'top'
          });
          this.statusBar.backgroundColorByHexString('#4f6c84');
          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
          });
          this.activeDisabled = true;
          setTimeout(() => {
            this.navCtrl.setRoot(HomePage);
          }, 2500)
        }else{
          this.statusBar.backgroundColorByHexString('#ed5565');
          let toast = this.toastCtrl.create({
            message: this.errNote,
            duration: 2500,
            position: 'top',
            cssClass: "warning_toast"
          });
          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
          });
          return;
        }
      })
      .catch((err) => {

      })


   /* let note = this.suggest;
    this.answers.push(note);
    console.log(this.answers);

    let toast = this.toastCtrl.create({
      message: this.successNote,
      duration: 2500,
      position: 'top'
    });
    this.statusBar.backgroundColorByHexString('#4f6c84');
    toast.present();
    toast.onDidDismiss(() => {
      this.statusBar.backgroundColorByHexString('#253746');
    });
    this.activeDisabled = true;
    setTimeout(() => {
      this.navCtrl.setRoot(HomePage);
    }, 2500)*/

  }

  onBackToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      if (result == 'arabic') {
        this.PleaseWait = 'يرجى الانتظار'
        this.successNote = ' شكرا لك ، تم ارسال تقيمك بنجاح ';
        this.errNote = "عذرا ، حدث خطأ اثناء التقيم ،يرجى المحاولة مرة اخرى";
        this.sending = " جاري الارسال ...";
        this.IOS_BACK = "عودة";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
      }
      else if (result == 'english') {
        this.IOS_BACK = "Back";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.PleaseWait = 'Please Wait';
        this.successNote = 'Thank you , submitted successfully';
        this.errNote = "Warning , something wrong please try again  ";
        this.sending = "Sending ...";
      }
      else {
        this.IOS_BACK = "Back";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.PleaseWait = 'Please Wait'
        this.successNote = 'Thank you , submitted successfully';
        this.errNote = "Warning , something wrong please try again  ";
        this.sending = "Sending ...";
      }

    });
  }


}
