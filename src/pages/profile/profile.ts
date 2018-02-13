import {Component, Injectable} from '@angular/core';
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
  deleteErr = "";
  pleaseWait = "";
  saveSuccess = "";
  errServer = "";
  have_account: boolean;
  not_added = "";
  update = "";


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
              public loadingCtrl: LoadingController) {
    this.setLangAndDirction();
    this.emergencyNumberList = [];
    this.myProfile = account.userInformation;
  }

  ionViewWillEnter() {
    this.account.onGetEmergencyList()
      .then((res) => {
        debugger;
        if (res) {
          debugger;
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
        if (res == false || res == null || res == 'undefind') {
          debugger;
          this.have_account = false;
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
        } else {
          this.have_account = true;
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
                this.account.onGetProfile(data.phone_number, data.password).then((res) => {
                  if (res) {
                    this.myProfile = res;
                    console.log(this.myProfile);
                  } else {

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


  ionViewDidLoad() {

    if (this.myProfile.Id != "") {
      debugger;
      this.phoneNumber = parseInt(this.myProfile.phoneNumber);
      this.storage.set('user', this.myProfile);
    } else {
      this.storage.get('user').then((userInfo) => {
        debugger;
        if (userInfo.Id != "") {
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
        }
      });
    }

    console.log('ionViewDidLoad SettingsPage', this.myProfile);
  }

  onSetBirthday() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      allowOldDates: true,
      allowFutureDates: false,
    }).then(
      date => {
        debugger;
        console.log(date);
        console.log(typeof (date));
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

  onChangePassword() {
    console.log('change pass clicked');
    this.alertCtrl.create({
      title: 'تغير رالرقم السري',
      message: "يرجى ادخال الرقم الحالي والجديد",
      inputs: [
        {
          name: 'phone_number',
          placeholder: 'الرقم السري الحالي'
        },
        {
          name: 'password',
          placeholder: 'الرقم السري'
        }
      ],
      buttons: [
        {
          text: 'تغير',
          handler: data => {
            console.log('Saved clicked');
          }
        },
        {
          text: 'الغاء',
          handler: data => {
            console.log('Cancel clicked');
          }
        }

      ]
    }).present();


  }

  onSaveProfile(form: NgForm) {

    console.log(form.value);
    let loader = this.loadingCtrl.create({
      content: this.pleaseWait,
    });
    loader.present();


    this.account.onCreateProfile(this.imgURL, form.value.firstName, form.value.lastName, form.value.gender, form.value.phoneNumber, form.value.birthday, form.value.language, form.value.password).then((res) => {
      debugger;

      if (res == 'no_user') {
        this.statusBar.backgroundColorByHexString('#ed5565');
        let toast = this.toastCtrl.create({
          message: 'هذا الرقم تم تسجيله سابقا',
          duration: 3000,
          position: 'top',
          cssClass:"warning_toast"
        });
        loader.dismiss();
        toast.present();
        toast.onDidDismiss(() => {
          this.statusBar.backgroundColorByHexString('#253746');
        });
      }
      else if (res == 'no_user_err') {
        this.statusBar.backgroundColorByHexString('#ed5565');
        let toast = this.toastCtrl.create({
          message: this.errServer,
          duration: 2000,
          position: 'top',
          cssClass:"warning_toast"
        });
        loader.dismiss();
        toast.present();
        toast.onDidDismiss(() => {
          this.statusBar.backgroundColorByHexString('#253746');
        });

      }
      else if (res) {
        this.myProfile = res;
        this.account.userInformation = this.myProfile;
        this.storage.set('user', this.account.userInformation);
        this.statusBar.backgroundColorByHexString('#4f6c84');
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: this.saveSuccess,
          duration: 2000,
          position: 'top'
        });
        this.storage.set('have_account', true);
        toast.present();
        toast.onDidDismiss(() => {
          this.statusBar.backgroundColorByHexString('#253746');
          this.navCtrl.popTo(HomePage);
        });
      }
      /* else{
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
       }*/
    }).catch((err) => {
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

    /* if (this.phoneNumber) {
       debugger;
       this.myProfile.phoneNumber = this.phoneNumber;
       /!*this.account.onCreateProfile(first,last,gender,this.phoneNumber,birthday,lang,pass).then((res)=>{
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
  *!/
      /!* this.storage.set('user', this.myProfile);
       this.account.userInformation = this.myProfile;*!/
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
     }*/

  }

  updateUser(form: NgForm) {
debugger;
    console.log(form.value);
    let loader = this.loadingCtrl.create({
      content: this.pleaseWait,
    });
    loader.present();


    this.account.onEditProfile(this.account.userInformation.Id,this.imgURL, form.value.firstName, form.value.lastName, form.value.gender, form.value.phoneNumber, form.value.birthday, form.value.language,this.account.userInformation.Password).then((res) => {
      debugger;

      if (res == 'no_user') {
        this.statusBar.backgroundColorByHexString('#ed5565');
        let toast = this.toastCtrl.create({
          message: 'نعتذر حصل خطأ اثناء تحديث البيانات',
          duration: 3000,
          position: 'top',
          cssClass:"warning_toast"
        });
        loader.dismiss();
        toast.present();
        toast.onDidDismiss(() => {
          this.statusBar.backgroundColorByHexString('#253746');
        });
      }
      else if (res == 'no_user_err') {
        this.statusBar.backgroundColorByHexString('#ed5565');
        let toast = this.toastCtrl.create({
          message: this.errServer,
          duration: 2000,
          position: 'top',
          cssClass:"warning_toast"
        });
        loader.dismiss();
        toast.present();
        toast.onDidDismiss(() => {
          this.statusBar.backgroundColorByHexString('#253746');
        });

      }
      else if (res) {
        this.myProfile = res;
        this.account.userInformation = this.myProfile;
        this.storage.set('user', this.account.userInformation);
        this.statusBar.backgroundColorByHexString('#4f6c84');
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: this.saveSuccess,
          duration: 2000,
          position: 'top'
        });
        this.storage.set('have_account', true);
        toast.present();
        toast.onDidDismiss(() => {
          this.statusBar.backgroundColorByHexString('#253746');
          this.navCtrl.popTo(HomePage);
        });
      }
    }).catch((err) => {
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
  }


  onDeleteNumber(contact) {
    debugger;
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
            let loader = this.loadingCtrl.create({
              content: this.pleaseWait,
            });
            this.account.onCreateProfileRelatives(contact.Id, contact.FirstName, contact.LastName, contact.PhoneNumber, contact.RelativeDescription, this.account.userInformation.Id, false)
              .then((newList) => {
                debugger;
                let List: any;
                List = newList;
                debugger;
                console.log(List, 'this is fuking llist');
                if (newList == "add_Connection_error") {
                  debugger;
                  console.log('add_Connection_error');
                  this.statusBar.backgroundColorByHexString('#ed5565');
                  loader.dismiss();
                  let toast = this.toastCtrl.create({
                    message: this.not_added,
                    duration: 120000,
                    position: 'top',
                    cssClass: 'warning_toast'
                  });
                  toast.present();
                  toast.onDidDismiss(() => {
                    this.statusBar.backgroundColorByHexString('#253746');
                  });

                } else if (newList == "not_added") {
                  debugger;

                  console.log('not_added');
                  this.statusBar.backgroundColorByHexString('#ed5565');
                  let toast = this.toastCtrl.create({
                    message: this.not_added,
                    duration: 120000,
                    position: 'top',
                    cssClass: 'warning_toast'
                  });
                  loader.dismiss();
                  toast.present();
                  toast.onDidDismiss(() => {
                    this.statusBar.backgroundColorByHexString('#253746');
                  });
                } else if (List.length >= 0) {
                  debugger;
                  console.log(List.length);
                  this.emergencyNumberList = List;
                  this.statusBar.backgroundColorByHexString('#4f6c84');
                  let toast = this.toastCtrl.create({
                    message: this.update,
                    duration: 3000,
                    position: 'top',
                  });
                  loader.dismiss();
                  toast.present();
                  toast.onDidDismiss(() => {
                    this.statusBar.backgroundColorByHexString('#253746');
                  });
                }

              })
              .catch((err) => {
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
              })
            /* this.config.onDeleteEmergencyNumber(indexNumber).then((res) => {
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
             });*/
            console.log('Delete clicked');
          }
        }
      ]
    });
    confirm.present();

  }

  onViewNumber(contactInfo) {
    debugger;
    this.navCtrl.push(AddSosNumberPage, contactInfo);
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
        this.pleaseWait = "جاري حفظ البيانات ...";
        this.saveSuccess = "تم الحفظ بنجاح";
        this.errServer = "لم يتم الحفظ الشبكه مشغوله";
        this.not_added = "عذرا حدث خطأ أثناء تحديث قائمة الطوارئ الخاصة بك";
        this.update = "تم تحديث قائمة الطوارئ الخاصة بك بنجاح";
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
        this.pleaseWait = "Please wait...";
        this.saveSuccess = "Saved successfully";
        this.errServer = "Saved failed , Internal Server Error";
        this.not_added = "not_added";
        this.update = "update";
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
        this.pleaseWait = "جاري حفظ البيانات ...";
        this.errServer = "لم يتم الحفظ الشبكه مشغوله";
        this.not_added = "عذرا حدث خطأ أثناء تحديث قائمة الطوارئ الخاصة بك";
        this.update = "تم تحديث قائمة الطوارئ الخاصة بك بنجاح";
        this.storage.set('lang', 'ar');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';

      }

    });
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
