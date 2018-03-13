import {Component, ViewChild} from '@angular/core';
import {IonicPage, ModalController, Navbar, NavController, NavParams, Platform} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {ConfigProvider} from "../../providers/config/config";
import {Storage} from '@ionic/storage';
import {QuestionDetailsPage} from "../question-details/question-details";

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
  questionList: any;
  IOS_BACK= "";
  @ViewChild(Navbar) navbar: Navbar;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public platform: Platform,
              public translate: TranslateService,
              public config: ConfigProvider,
              public modalCtrl: ModalController) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {
    this.questionList = [
      {
        QuestionText: "what_is_this_application_do",
        Answer: "about_us_desc2"
      },
      {
        QuestionText: "Why_need_to_add_relative",
        Answer: "emergency_note"
      },
      {
        QuestionText: "privit_data_question",
        Answer: "privit_data_question_answer"
      }
    ]
    console.log('ionViewDidLoad FaqPage');
  }

  presentQuestionModal(theQuestion: any) {
    let contactModal = this.modalCtrl.create(QuestionDetailsPage, {theQuestion});
    contactModal.present();
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {

      if (result == 'arabic') {
        this.IOS_BACK = "عودة";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.storage.set('lang', 'arabic');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';
      }
      else if (result == 'english') {
        this.IOS_BACK = "Back";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';
      }
      else {
        this.IOS_BACK = "Back";
        if (this.platform.is('ios')) {
          this.navbar.setBackButtonText(this.IOS_BACK);
        }
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';

      }

    });
  }
}
