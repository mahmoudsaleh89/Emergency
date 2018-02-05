import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ConfigProvider} from "../../providers/config/config";
import {HomePage} from "../home/home";
import {Storage} from '@ionic/storage';
import {StatusBar} from "@ionic-native/status-bar";

@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {
  ratingQuestions:any;
  suggest: string;
  answers = [];
  activeDisabled = false;
  PleaseWait;
  successNote;
  errNote ;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public config: ConfigProvider,
              private toastCtrl: ToastController,
              private storage: Storage,
              public statusBar :StatusBar) {
    this.setLangAndDirction();
    this.config.getRatingQuestion().then((res)=>{
      this.ratingQuestions = res;
    });

  }
  ionViewWillEnter(){

  }

  ionViewDidLoad() {


    console.log(this.ratingQuestions);
    console.log('ionViewDidLoad RatingPage');
  }

  onsetRate(){

    for (var i = 0 ; i < this.ratingQuestions.length; i ++){
      debugger
      let answer = {
        qusId : this.ratingQuestions[i].qusID,
        qusText : this.ratingQuestions[i].qusText,
        ratValue: this.ratingQuestions[i].value,
      };
      this.answers.push(answer);
    }
    let note = this.suggest;
    this.answers.push(note);
    console.log(this.answers);

    let toast = this.toastCtrl.create({
      message: this.successNote,
      duration: 2500,
      position: 'top'
    });
    this.statusBar.backgroundColorByHexString('#4f6c84');
    toast.present();
    toast.onDidDismiss(()=>{
      this.statusBar.backgroundColorByHexString('#253746');
    });
    this.activeDisabled = true;
    setTimeout(()=>{
      this.navCtrl.popTo(HomePage);
    },2500)

  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      if (result == 'ar') {
        this.PleaseWait = 'يرجى الانتظار'
        this.successNote = ' شكرا لك ، تم ارسال تقيمك بنجاح ';
        this.errNote = "عذرا ، حدث خطأ اثناء التقيم ،يرجى المحاولة مرة اخرى";
      }
      else if (result == 'en') {
        this.PleaseWait = 'Please Wait'
        this.successNote = 'Thank you , submitted successfully';
        this.errNote = "Warning , something wrong please try again  ";
      }
      else  {
        this.PleaseWait = 'يرجى الانتظار'
        this.successNote = ' شكرا لك ، تم ارسال تقيمك بنجاح ';
        this.errNote = "عذرا ، حدث خطأ اثناء التقيم ،يرجى المحاولة مرة اخرى";
      }

    });
  }


}
