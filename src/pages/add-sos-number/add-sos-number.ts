import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ConfigProvider} from "../../providers/config/config";
import {TranslateService} from "@ngx-translate/core";
import {Contacts,Contact} from "@ionic-native/contacts";
import {StatusBar} from "@ionic-native/status-bar";
import {ProfilePage} from "../profile/profile";


@IonicPage()
@Component({
  selector: 'page-add-sos-number',
  templateUrl: 'add-sos-number.html',
})
export class AddSosNumberPage {
  relative:any;
  phoneNumber:number;
  firstName:string;
  lastName:string;
  validatePhone : boolean;
  insertALlRequired="";
  maxNumberOfContact = "";
  err_import="";
  okay="";
  dismiss ="";
  number:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public statusBar: StatusBar,
              public storage: Storage,
              public platform: Platform,
              public config : ConfigProvider,
              public translate: TranslateService,
              public contacts : Contacts,
              public toastCtrl: ToastController
              ) {
    this.setLangAndDirction();
  }

  ionViewDidLoad() {
    this.number= this.navParams.data;
    if (this.number){
      debugger;
      this.phoneNumber = this.number.phone;
      this.firstName= this.number.firstName;
      this.lastName = this.number.latName;
    }
    console.log('ionViewDidLoad AddSosNumberPage');
  }
  saveContact(){
    debugger;

    if (this.phoneNumber) {
      if(this.config.emergencyNumberList.length > 2){
        this.statusBar.backgroundColorByHexString('#4f6c84');
        let toast = this.toastCtrl.create({
          message: this.insertALlRequired,
          duration: 3000,
          position : 'top'
        });
        toast.present();
        toast.onDidDismiss(()=>{
          this.statusBar.backgroundColorByHexString('#253746');
        });
      }else{
        this.config.emergencyNumberList.push({
          phone: this.phoneNumber,
          firstName: this.firstName,
          latName : this.lastName
        });
        this.config.onUpdateEmergencyList();
      }
      this.navCtrl.popTo(ProfilePage);
    }else{
      this.statusBar.backgroundColorByHexString('#4f6c84');
      let toast = this.toastCtrl.create({
        message: this.insertALlRequired,
        duration: 3000,
        position : 'top'
      });
      toast.present();
      toast.onDidDismiss(()=>{
        this.statusBar.backgroundColorByHexString('#253746');
      });
    }
  }

  importFromContact(){

    this.contacts.pickContact()
      .then((con)=>{
        console.log(parseInt(con.phoneNumbers[0].value));

      this.phoneNumber =parseInt(con.phoneNumbers[0].value);
      this.firstName = con.name.givenName;
      this.lastName = con.name.familyName;

      console.log(con)
      }).catch((err)=>{
      this.statusBar.backgroundColorByHexString('#4f6c84');
      let toast = this.toastCtrl.create({
        message: this.err_import,
        duration: 3000,
        position : 'top'
      });
      toast.present();
      toast.onDidDismiss(()=>{
        this.statusBar.backgroundColorByHexString('#253746');
      });
      console.log(err)
    });
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      if (result == 'ar') {
       this.okay = "موافق";
       this.dismiss = "الغاء";
        this.insertALlRequired=" الرجاء ادخال جميع الحقول المطلوبة";
        this.err_import="حدث خطأ اثناء استرداد جهة الاتصال";
        this.maxNumberOfContact = " لقد قمت باخال اكبر عدد ممكن من جهات الاتصال";
        this.storage.set('lang', 'ar');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';
      }
      else if (result == 'en') {
        this.okay = "ok";
        this.dismiss = "cancel";
        this.insertALlRequired=" please insert all required fields";
        this.err_import="Error while importing contact details";
        this.maxNumberOfContact = " you have maximum number of contact ";
        this.storage.set('lang', 'en');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';
      }
      else  {
        this.okay = "موافق";
        this.dismiss = "الغاء";
        this.insertALlRequired=" الرجاء ادخال جميع الحقول المطلوبة";
        this.err_import="حدث خطأ اثناء استرداد جهة الاتصال";
        this.maxNumberOfContact = " لقد قمت باخال اكبر عدد ممكن من جهات الاتصال";
        this.storage.set('lang', 'ar');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';

      }

    });
  }


}
