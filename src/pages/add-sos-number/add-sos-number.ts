import {Component, ViewChild} from '@angular/core';
import {
  ActionSheetController, IonicPage, LoadingController, Navbar, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ConfigProvider} from "../../providers/config/config";
import {TranslateService} from "@ngx-translate/core";
import {Contacts, Contact} from "@ionic-native/contacts";
import {StatusBar} from "@ionic-native/status-bar";
import {ProfilePage} from "../profile/profile";
import {NgForm} from "@angular/forms";
import {AccountProvider} from "../../providers/account/account";


@IonicPage()
@Component({
  selector: 'page-add-sos-number',
  templateUrl: 'add-sos-number.html',
})
export class AddSosNumberPage {
  relative: any;
  phoneNumber: number;
  firstName: string;
  lastName: string;
  validatePhone: boolean;
  insertALlRequired = "";
  maxNumberOfContact = "";
  err_import = "";
  okay = "";
  dismiss = "";
  contactInfo: any;
  pleaseAddProfile = "";
  not_added = "";
  add_Connection_error = "";
  pleaseWait = "";
  IOS_BACK= "";
  @ViewChild(Navbar) navbar: Navbar;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private statusBar: StatusBar,
              public storage: Storage,
              public platform: Platform,
              public config: ConfigProvider,
              public translate: TranslateService,
              public contacts: Contacts,
              public toastCtrl: ToastController,
              public account: AccountProvider,
              public loadingCtrl: LoadingController) {
    this.setLangAndDirction();

    this.contactInfo = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSosNumberPage');
  }

  saveContact(form: NgForm) {
    console.log(form);
    console.log(form.value, 'form.value');
    debugger;
    let loader = this.loadingCtrl.create({
      content: this.pleaseWait,
    });
    loader.present();
    debugger;
    let ContactId: any;
    ContactId = this.contactInfo.Id;
    if (!ContactId) {
      ContactId = "";
    }
    this.account.onCreateProfileRelatives(ContactId, form.value.contactFirstName, form.value.contactLastName, form.value.contactPhoneNumber, form.value.relativeDescription, this.account.userInformation.Id, true)
      .then((res) => {
        if (res == 'not_added') {
          debugger;
          console.log('not_added');
          this.statusBar.backgroundColorByHexString('#ed5565');
          let toast = this.toastCtrl.create({
            message: this.not_added,
            duration: 3000,
            position: 'top',
            cssClass: 'warning_toast'

          });
          loader.dismiss();
          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
          });
        }
        else if (res == 'add_Connection_error') {
          debugger;
          console.log('add_Connection_error');
          this.statusBar.backgroundColorByHexString('#ed5565');
          let toast = this.toastCtrl.create({
            message: this.add_Connection_error,
            duration: 3000,
            position: 'top',
            cssClass: 'warning_toast'
          });
          loader.dismiss();
          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
          });
        }
        else if (res) {
          debugger;
          console.log('res');
          let user: any;
          this.storage.get('user').then((userRes) => {
            user = userRes;
            user.Relatives = res;
            this.storage.set('user', user);
          });
          loader.dismiss();
          this.navCtrl.popTo(ProfilePage);
        }
      })
      .catch((err) => {
        debugger;

        console.log(err,'res err SaveProfileRelatives');
        this.statusBar.backgroundColorByHexString('#ed5565');
        let toast = this.toastCtrl.create({
          message: this.add_Connection_error,
          duration: 3000,
          position: 'top',
          cssClass: 'warning_toast'
        });
        loader.dismiss();
        toast.present();
        toast.onDidDismiss(() => {
          this.statusBar.backgroundColorByHexString('#253746');
        });
      })
  }

  importFromContact() {

    this.contacts.pickContact()
      .then((con) => {
        console.log(con.phoneNumbers[0].value);
        let ContactNumber = con.phoneNumbers[0].value.replace(/\s/g, '').toString();
        console.log(ContactNumber);
        this.contactInfo = {
          PhoneNumber: ContactNumber,
          FirstName: con.name.givenName,
          LastName: con.name.familyName,
          RelativeDescription: "",
          MobileUserProfileId: "",
          Active: true
        }
        console.log(this.contactInfo, 'this.contactInfo');
      }).catch((err) => {
      this.statusBar.backgroundColorByHexString('#ed5565');
      let toast = this.toastCtrl.create({
        message: this.err_import,
        duration: 3000,
        position: 'top',
        cssClass: 'warning_toast'
      });
      toast.present();
      toast.onDidDismiss(() => {
        this.statusBar.backgroundColorByHexString('#253746');
      });
      console.log(err)
    });
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      if (result == 'arabic') {
        this.okay = "موافق";
        this.dismiss = "الغاء";
        this.insertALlRequired = " الرجاء ادخال جميع الحقول المطلوبة";
        this.err_import = "حدث خطأ اثناء استرداد جهة الاتصال";
        this.maxNumberOfContact = " لقد قمت باخال اكبر عدد ممكن من جهات الاتصال";
        this.pleaseAddProfile = "لا يمكن اضافة معلومات الاتصال يرجى انشاء حسابك الشخصي اولا....";
        this.add_Connection_error = "حصل خطأ في الاتصال ، لا يوجد اتصال في الانترنت ";
        this.not_added = "عذرا ، حصل خطآ اثناء الاضافة ، يرجى المحاولة مرة اخرى";
        this.pleaseWait = "جاري حفظ البيانات ...";
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
        this.okay = "ok";
        this.dismiss = "cancel";
        this.insertALlRequired = " please insert all required fields";
        this.err_import = "Error while importing contact details";
        this.maxNumberOfContact = " you have maximum number of contact ";
        this.pleaseAddProfile = "Please add profile information after";
        this.pleaseWait = "please Wait ...";
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
        this.okay = "ok";
        this.dismiss = "cancel";
        this.insertALlRequired = " please insert all required fields";
        this.err_import = "Error while importing contact details";
        this.maxNumberOfContact = " you have maximum number of contact ";
        this.pleaseAddProfile = "Please add profile information after";
        this.pleaseWait = "please Wait ...";
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
