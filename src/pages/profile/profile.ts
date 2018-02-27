import {Component, forwardRef, Inject, Injectable} from '@angular/core';
import {
  ActionSheetController, AlertController, IonicPage, LoadingController, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {ConfigProvider} from "../../providers/config/config";
import {Storage} from '@ionic/storage';
import {TranslateService} from "@ngx-translate/core";
import {DatePicker} from "@ionic-native/date-picker";
import {AddSosNumberPage} from "../add-sos-number/add-sos-number";
import {ImagePicker} from "@ionic-native/image-picker";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {StatusBar} from "@ionic-native/status-bar";
import {AccountProvider} from "../../providers/account/account";
import {HomePage} from "../home/home";
import {NgForm} from "@angular/forms";
import {ProfileEditPage} from "../profile-edit/profile-edit";
import {MyApp} from "../../app/app.component";


@Injectable()
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  setGender = "";
  male = "";
  fmale = "";
  setlang = "";
  arabic = "";
  english = "";
  urdo = "";
  takePic = "";
  choseFromGallery = "";
  unspecified = "";
  currentTime = "";
  currentDate = "";
  selectedDate: any;
  countICENumbers: number = 0;
  emergencyNumberList: any;
  cancel = "";
  imgURL = "";
  errImage = "";
  selectImage = "";
  errSelectImage = "";
  add_profile_img = "";
  myProfile = {
    Id: "",
    FirstName: "Guest",
    Lastname: "user",
    PhoneNumber: "",
    ImageUrl: "assets/imgs/user.png",
    Gender: "",
    Birthday: "",
    Language: "",
    Password: "",
    Relatives: [
      {
        Id: "",
        Name: "",
        PhoneNumber: "",
        RelativeDescription: "",
        MobileUserProfileId: ""
      },
      {
        Id: "",
        Name: "",
        PhoneNumber: "",
        RelativeDescription: "",
        MobileUserProfileId: ""
      }
    ]
  };
  phoneNumber: number;
  insertALlRequired = "";
  genderSelected = "";
  deleteTittle = "";
  deleteMsg = "";
  ok = "";
  deleteErr = "";
  pleaseWait = "";
  saveSuccess = "";
  errServer = "";
  have_account: boolean = false;
  not_added = "";
  update = "";
  isValidFormSubmitted = false;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              private datePicker: DatePicker,
              private toastCtrl: ToastController,
              public translate: TranslateService,
              public storage: Storage,
              public platform: Platform,
              public config: ConfigProvider,
              private imagePicker: ImagePicker,
              public camera: Camera,
              public statusBar: StatusBar,
              public account: AccountProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              @Inject(forwardRef(() => MyApp)) private myapp: MyApp) {
    this.setLangAndDirction();
    this.emergencyNumberList = [];
    this.myProfile = this.account.userInformation;

  }
  onGoToEditPage(){
    this.navCtrl.push(ProfileEditPage);
  }
  onAddNewContact() {
    let contact: Contact = {
      phoneNumber: "",
      firstName: "",
      lastName: "",
      RelativeDescription: "",
      MobileUserProfileId: this.myProfile.Id,
      active: true,
    };
    this.navCtrl.push(AddSosNumberPage, {contact});
  }
  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      if (result == 'arabic') {
        this.setGender = "اختيار الجنس";
        this.male = "ذكر";
        this.fmale = "انثى";
        this.unspecified = "غير محدد";
        this.setlang = "تحديد اللغة";
        this.english = "English";
        this.arabic = "العربية";
        this.urdo = "اردو";
        this.takePic = "التقاط صورة";
        this.choseFromGallery = "اختيار من معرض الصور";
        this.cancel = "الغاء";
        this.errImage = " الرجاء اعطاء صلاحيات للوصول للكاميرا والمحاولة مرة اخرى";
        this.errSelectImage = " الرجاء اعطاء صلاحيات للوصول للكاميرا والمحاولة مرة اخرى";
        this.selectImage = "اختيار صورة";
        this.add_profile_img = "اضافة صورة شخصية";
        this.insertALlRequired = " الرجاء ادخال جميع الحقول المطلوبة";
        this.deleteTittle = "حذف جهة اتصال";
        this.deleteMsg = "هل انت متاكد من رغبتك  حذف هذه الجهة؟";
        this.ok = "موافق";
        this.deleteErr = " عذرا حدث خطأ اثناد حذف هذه الجهه يرجى المحاوله مرة اخرى";
        this.pleaseWait = "جاري حفظ البيانات ...";
        this.saveSuccess = "تم الحفظ بنجاح";
        this.errServer = "لم يتم الحفظ الشبكه مشغوله";
        this.not_added = "عذرا حدث خطأ أثناء تحديث قائمة الطوارئ الخاصة بك";
        this.update = "تم تحديث قائمة الطوارئ الخاصة بك بنجاح";
        this.storage.set('lang', 'arabic');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';
      }
      else if (result == 'english') {
        this.setGender = " Select gender";
        this.male = " Male";
        this.fmale = " Female";
        this.unspecified = "Unspecified";
        this.setlang = "Select Language";
        this.english = "English";
        this.arabic = "العربية";
        this.urdo = "اردو";
        this.takePic = "Take image";
        this.choseFromGallery = "Chose From albums";
        this.cancel = "Cancel";
        this.errImage = "your camera is disabled or don't have permission to access !";
        this.errSelectImage = " your Gallery is disabled or don't have permission to access !";
        this.insertALlRequired = " please insert all required fields";
        this.selectImage = "Add image";
        this.add_profile_img = "add profile image";
        this.deleteTittle = "Delete contact";
        this.deleteMsg = "Are you sure ? do you want delete this contact";
        this.ok = "ok";
        this.deleteErr = " Sorry , can't delete this contact please try again !";
        this.pleaseWait = "Please wait...";
        this.saveSuccess = "Saved successfully";
        this.errServer = "Saved failed , Internal Server Error";
        this.not_added = "not_added";
        this.update = "update";
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';
      }
      else {
        this.setGender = " Select gender";
        this.male = " Male";
        this.fmale = " Female";
        this.unspecified = "Unspecified";
        this.setlang = "Select Language";
        this.english = "English";
        this.arabic = "العربية";
        this.urdo = "اردو";
        this.takePic = "Take image";
        this.choseFromGallery = "Chose From albums";
        this.cancel = "Cancel";
        this.errImage = "your camera is disabled or don't have permission to access !";
        this.errSelectImage = " your Gallery is disabled or don't have permission to access !";
        this.insertALlRequired = " please insert all required fields";
        this.selectImage = "Add image";
        this.add_profile_img = "add profile image";
        this.deleteTittle = "Delete contact";
        this.deleteMsg = "Are you sure ? do you want delete this contact";
        this.ok = "ok";
        this.deleteErr = " Sorry , can't delete this contact please try again !";
        this.pleaseWait = "Please wait...";
        this.saveSuccess = "Saved successfully";
        this.errServer = "Saved failed , Internal Server Error";
        this.not_added = "not_added";
        this.update = "update";
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';

      }

    });
  }
  logOut(){
    this.storage.set('have_account',false);
    this.myProfile ={
      Id: "",
      FirstName: "Guest",
      Lastname: "user",
      PhoneNumber: "",
      ImageUrl: "assets/imgs/user.png",
      Gender: "",
      Birthday: "",
      Language: "",
      Password: "",
      Relatives: [
        {
          Id: "",
          Name: "",
          PhoneNumber: "",
          RelativeDescription: "",
          MobileUserProfileId: ""
        },
        {
          Id: "",
          Name: "",
          PhoneNumber: "",
          RelativeDescription: "",
          MobileUserProfileId: ""
        }
      ]
    };
    this.account.userInformation = this.myProfile;
    this.storage.set('user',this.myProfile);
    this.storage.set('lang','english');
    this.myapp.initializeApp();

  }
}
export interface Contact {
  phoneNumber: string ;
  firstName: string ;
  lastName: string;
  RelativeDescription: string;
  MobileUserProfileId: string
  active: boolean;
}

