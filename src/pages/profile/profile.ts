import {Component, Injectable} from '@angular/core';
import {
  ActionSheetController, AlertController, IonicPage, NavController, NavParams, Platform,
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
  myProfile: any;
  phoneNumber: number;
  insertALlRequired = "";
  genderSelected = "";
  deleteTittle = "";
  deleteMsg = "";
  ok = "";
  deleteErr = ""


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
              public alertCtrl: AlertController) {
    this.setLangAndDirction();
    this.emergencyNumberList = [];
    this.myProfile = account.userInformation;
  }

  ionViewWillEnter() {
    this.config.onGetEmergencyList()
      .then((res) => {
        debugger;
        if (res) {

          this.emergencyNumberList = res;
        } else {
          debugger;
          this.emergencyNumberList = [];
        }

      })
      .catch((err) => {
          debugger;
          this.emergencyNumberList = []
        }
      );
    this.storage.get('have_account')
      .then((res) => {
        debugger;
        console.log('hello Comp', res);
        if (res == true || res == null || res == 'undefind') {
          debugger;
          this.alertCtrl.create({
            title: 'استعادة الحساب',
            message: "هل لديك حياب مسبقا ، يرجي كتابة رقم الهاتف والرقم السري لاستعاده حسابك",
            inputs: [
              {
                name: 'phone_number',
                placeholder: 'رقم الهاتف'
              },
              {
                name: 'password',
                placeholder: 'الرقم السري'
              }
            ],
            buttons: [
              {
                text: 'تسجيل دخول',
                handler: data => {
                  console.log('Saved clicked');
                }
              },
              {
                text: 'مستخدم جديد',
                handler: data => {
                  console.log('Cancel clicked');
                }
              }

            ]
          }).present();
        }
      })
      .catch((err) => {
      debugger;
        this.alertCtrl.create({
          title: 'استعادة الحساب',
          message: "هل لديك حياب مسبقا ، يرجي كتابة رقم الهاتف والرقم السري لاستعاده حسابك",
          inputs: [
            {
              name: 'phone_number',
              placeholder: 'رقم الهاتف'
            },
            {
              name: 'password',
              placeholder: 'الرقم السري'
            }
          ],
          buttons: [
            {
              text: 'تسجيل دخول',
              handler: data => {
                this.account.onGetProfile(data.phone_number,data.password).then((res)=>{
                  if (res){
                    this.myProfile = res;
                   console.log(this.myProfile);
                  }else{

                  }
                })
              }
            },
            {
              text: 'مستخدم جديد',
              handler: data => {
                console.log('Cancel clicked');
              }
            }

          ]
        }).present();
      });
  }

  ionViewDidEnter() {
    debugger;

  }

  ionViewDidLoad() {

    if (this.myProfile.phoneNumber != "") {
      if (this.myProfile.birthday == "") {
        let d = new Date();
        this.currentDate = d.toString().substr(4, 12)
        let selectBirthday = document.querySelector('#birthday');
        selectBirthday.innerHTML = this.currentDate;
      } else {
        let selectBirthday = document.querySelector('#birthday');
        selectBirthday.innerHTML = this.myProfile.birthday;
      }
      debugger;
      this.phoneNumber = parseInt(this.myProfile.phoneNumber);
      this.storage.set('user', this.myProfile);
    } else {
      this.storage.get('user').then((userInfo) => {
        debugger;
        if (userInfo.phoneNumber != "") {
          this.myProfile = userInfo;
          this.storage.set('user', this.myProfile);
        } else {
          this.myProfile = {
            firstName: "",
            lastName: "",
            ImageUrl: "",
            phoneNumber: "",
            gender: "",
            birthday: ""
          }
          this.storage.set('user', this.myProfile);
          let d = new Date();
          this.currentDate = d.toString().substr(4, 12)
          let selectBirthday = document.querySelector('#birthday');
          selectBirthday.innerHTML = this.currentDate;
        }
      });
    }


    console.log('ionViewDidLoad SettingsPage', this.myProfile);
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
            this.genderSelected = this.male;
            this.myProfile.gender = this.male;
            this.account.userInformation.Gender = this.male;
            console.log('male clicked');
          }
        },
        {
          text: this.fmale,
          role: this.fmale,
          handler: () => {
            let select = document.querySelector('#gender');
            select.innerHTML = this.fmale;
            this.genderSelected = this.fmale;
            this.myProfile.gender = this.fmale;
            this.account.userInformation.Gender = this.fmale;
            console.log('Fmale clicked');
          }
        },
        {
          text: this.unspecified,
          role: this.unspecified,
          handler: () => {
            let select = document.querySelector('#gender');
            select.innerHTML = this.unspecified;
            this.genderSelected = this.unspecified;
            this.myProfile.gender = this.unspecified;
            this.account.userInformation.Gender = this.unspecified;

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
            this.myProfile.language = this.arabic;
          }
        },
        {
          text: this.english,
          role: this.english,
          handler: () => {
            let select = document.querySelector('#lang');
            select.innerHTML = this.english;
            this.myProfile.language = this.english;
            console.log('English clicked');
          }
        },
        {
          text: this.urdo,
          role: this.urdo,
          handler: () => {
            let select = document.querySelector('#lang');
            select.innerHTML = this.urdo;
            this.myProfile.language = this.urdo;
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
        selectBirthday.innerHTML = this.currentDate;
      },
      err => {
        let d = new Date();
        this.currentDate = d.toString().substr(4, 12)
        let selectBirthday = document.querySelector('#birthday');
        selectBirthday.innerHTML = this.currentDate;
        /*let toast = this.toastCtrl.create({
          message: 'Please Select date',
          duration: 3000,
          position: 'bottom'
        }).present();*/
      }
    );
  }


  onAddNewContact() {
    this.navCtrl.push(AddSosNumberPage);
  }

  onAddProfileImage() {
    this.imgURL = "";
    let actionSheet = this.actionSheetCtrl.create({
      title: this.selectImage,
      buttons: [
        {
          text: this.takePic,
          handler: () => {
            this.onTakeImage();
            console.log('tak pic clicked');
          }
        },
        {
          text: this.choseFromGallery,
          handler: () => {
            this.onSelectFromGallery();
            console.log('choseFromGallery clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  onTakeImage() {
    debugger;
    let options: CameraOptions;
    if (this.platform.is('ios')) {
      options = {

        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true
      }
    } else if (this.platform.is('android')) {
      options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true

      };
    }

    this.camera.getPicture(options).then((imageData) => {
      debugger;
      this.storage.get('lang').then((result) => {
        if (result == 'ar') {
          this.add_profile_img = " تحديث الصورة الشخصية";
        }
        else if (result == 'en') {
          this.add_profile_img = "update profile image";
        }
        else {
          this.add_profile_img = " تحديث الصورة الشخصية";

        }
      });
      if (this.platform.is('ios')) {
        this.imgURL = imageData;
        this.myProfile.ImageUrl = this.imgURL;
        this.imgURL = this.imgURL.replace(/^file:\/\//, '');
      }
      else if (this.platform.is('android')) {
        this.imgURL = imageData;
        this.myProfile.ImageUrl = this.imgURL;
      }
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      //this image to upload
    }, (err) => {
      this.imgURL = "";
      this.statusBar.backgroundColorByHexString('#4f6c84');
      let toast = this.toastCtrl.create({
        message: this.errImage,
        duration: 3000,
        position: 'top'
      });

      toast.present();
      toast.onDidDismiss(() => {
        this.statusBar.backgroundColorByHexString('#253746');
      });
    });
  }

  onSelectFromGallery() {
    debugger;
    let options = {
      maximumImagesCount: 1
    }
    this.imagePicker.getPictures(options).then((results) => {
      this.imgURL = results[0];
      this.myProfile.ImageUrl = this.imgURL;


      this.storage.get('lang').then((result) => {
        if (result == 'ar') {
          this.add_profile_img = " تحديث الصورة الشخصية";
        }
        else if (result == 'en') {
          this.add_profile_img = "update profile image";
        }
        else {
          this.add_profile_img = " تحديث الصورة الشخصية";

        }

      });
      console.log(results);
      /*console.log('Image URI: ' + results[i]);*/

    }, (err) => {
      this.statusBar.backgroundColorByHexString('#4f6c84');
      this.imgURL = "";
      let toast = this.toastCtrl.create({
        message: this.errSelectImage,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      toast.onDidDismiss(() => {
        this.statusBar.backgroundColorByHexString('#253746');
      });
      console.log(err);

    });

  }

  onSaveProfile(form:NgForm) {
    debugger;
    console.log(form.value);
    let first = this.myProfile.FirstName;
    let last = this.myProfile.Lastname;
    let imgUrl = this.imgURL;
    let gender = this.myProfile.Gender;
    let birthday = this.myProfile.Birthday;
    let lang = this.myProfile.Language;
    let pass=this.myProfile.Password;
    if (this.phoneNumber) {
      debugger;
      this.myProfile.phoneNumber = this.phoneNumber;
      this.account.onCreateProfile(first,last,gender,this.phoneNumber,birthday,lang,pass).then((res)=>{
        if(res){
          this.myProfile = res;
          this.account.userInformation = this.myProfile;
          this.storage.set('user',this.account.userInformation)
          this.navCtrl.popTo(HomePage);
        }
        else{
          this.statusBar.backgroundColorByHexString('#4f6c84');
          let toast = this.toastCtrl.create({
            message: 'هذا الرقم تم تسجيله سابقا',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
          });
        }
      }).catch((err)=>{
        let toast = this.toastCtrl.create({
          message: 'حصل خطأ اثناء التسجيل يرجى المحاولة لاحقا ',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        toast.onDidDismiss(() => {
          this.statusBar.backgroundColorByHexString('#253746');
        });
      });

     /* this.storage.set('user', this.myProfile);
      this.account.userInformation = this.myProfile;*/
      //this.myAPP.initializeApp();


    } else {
      this.statusBar.backgroundColorByHexString('#4f6c84');
      let toast = this.toastCtrl.create({
        message: this.insertALlRequired,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      toast.onDidDismiss(() => {
        this.statusBar.backgroundColorByHexString('#253746');
      });
    }

  }

  onDeleteNumber(indexNumber) {
    let confirm = this.alertCtrl.create({
      title: this.deleteTittle,
      message: this.deleteMsg,
      buttons: [
        {
          text: this.cancel,
          handler: () => {
            console.log('cancel delete clicked');
          }
        },
        {
          text: this.ok,
          handler: () => {
            this.config.onDeleteEmergencyNumber(indexNumber).then((res) => {
              if (res) {
                debugger;
                this.emergencyNumberList = res;
              }
            }).catch((err) => {
              debugger;
              this.statusBar.backgroundColorByHexString('#4f6c84');
              let toast = this.toastCtrl.create({
                message: this.deleteErr,
                duration: 3000,
                position: 'top'
              });
              toast.present();
              toast.onDidDismiss(() => {
                this.statusBar.backgroundColorByHexString('#253746');
              });
            });
            console.log('Delete clicked');
          }
        }
      ]
    });
    confirm.present();

  }

  onViewNumber(indexNumber) {
    debugger;
    this.config.onViewEmergencyNumber(indexNumber)
      .then((res) => {
        debugger;
        this.navCtrl.push(AddSosNumberPage, res);
      })
      .catch(() => {

      })
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      if (result == 'ar') {
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
        this.storage.set('lang', 'ar');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';
      }
      else if (result == 'en') {
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
        this.storage.set('lang', 'en');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';
      }
      else {
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
        this.errImage = " الرجاء صلاحيات للوصول للكاميرا والمحاولة مرة اخرى";
        this.selectImage = "اختيار صورة";
        this.errSelectImage = " الرجاء اعطاء صلاحيات للوصول للكاميرا والمحاولة مرة اخرى";
        this.add_profile_img = "اضافة صورة شخصية";
        this.insertALlRequired = " الرجاء ادخال جميع الحقول المطلوبة";
        this.deleteTittle = "حذف جهة اتصال";
        this.deleteMsg = "هل انت متاكد من رغبتك  حذف هذه الجهة؟";
        this.ok = "موافق";
        this.deleteErr = " عذرا حدث خطأ اثناد حذف هذه الجهه يرجى المحاوله مرة اخرى";
        this.storage.set('lang', 'ar');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';

      }

    });
  }

}
