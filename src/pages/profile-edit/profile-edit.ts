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
import {ProfilePage} from "../profile/profile";
import {MyApp} from "../../app/app.component";
import {FCM} from "@ionic-native/fcm";


@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {

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
  changePassword_tittle = "";
  newPassword = "";
  oldPassword = "";
  changePasswordDesc = "";
  passValidation = "";
  change = "";
  updateErr = "";
  phoneAlreadyRegister = "";
  allfieldrequried = "";


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
              public fcm: FCM,
              @Inject(forwardRef(() => MyApp)) private myapp: MyApp) {
    this.setLangAndDirction();
    this.emergencyNumberList = [];
    this.myProfile = this.account.userInformation;
    this.imgURL = this.myProfile.ImageUrl;
    if (this.myProfile.Birthday != "" || this.myProfile.Birthday != null) {
      this.currentDate = this.myProfile.Birthday;
    }
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
                    let profile: any = res;
                    this.myProfile = profile;
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


    if (this.myProfile.Id != "" || this.myProfile.Id != undefined || this.myProfile.Id != null) {
      console.log(this.myProfile, "this.myProfile.Id")
    }
    else {
      this.storage.get('user')
        .then((userInfo) => {
          console.log(userInfo, "userInfo");
        })
        .catch((userErr) => {
          console.log(userErr);
        })
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
        if (result == 'arabic') {
          this.add_profile_img = " تحديث الصورة الشخصية";
        }
        else if (result == 'english') {
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
      debugger;
      this.imgURL = results[0];
      this.myProfile.ImageUrl = this.imgURL;
      this.account.userInformation.ImageUrl = this.imgURL;


      this.storage.get('lang').then((result) => {
        if (result == 'arabic') {
          this.add_profile_img = " تحديث الصورة الشخصية";
        }
        else if (result == 'english') {
          this.add_profile_img = "update profile image";
        }
        else {
          this.add_profile_img = " تحديث الصورة الشخصية";

        }

      });
      console.log(results);
      /*console.log('Image URI: ' + results[i]);*/

    }, (err) => {
      debugger;
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
    debugger;
    this.alertCtrl.create({
      title: this.changePassword_tittle,
      message: this.changePasswordDesc,
      inputs: [
        {
          name: 'old_pass',
          placeholder: this.oldPassword
        },
        {
          name: 'new_password',
          placeholder: this.newPassword
        }
      ],
      buttons: [

        {
          text: this.cancel,
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.change,
          handler: data => {
            debugger;
            console.log(data, 'data');
            console.log(this.myProfile, 'this.myProfile');
            console.log(this.account.userInformation, 'this.account.userInformation');
            debugger;
            if (data.old_pass == "" || data.new_password == "") {
              this.statusBar.backgroundColorByHexString('#ed5565');
              let toast = this.toastCtrl.create({
                message: this.allfieldrequried,
                duration: 3000,
                position: 'top',
                cssClass: "warning_toast"
              });
              toast.present();
              toast.onDidDismiss(() => {
                this.statusBar.backgroundColorByHexString('#253746');
              });
              return;
            }
            if (data.old_pass === this.myProfile.Password) {
              let loader = this.loadingCtrl.create({
                content: this.pleaseWait,
              });
              loader.present();
              this.account.onEditProfile(this.account.userInformation.Id, this.account.userInformation.ImageUrl, this.account.userInformation.FirstName, this.account.userInformation.Lastname, this.account.userInformation.Gender, this.account.userInformation.PhoneNumber, this.account.userInformation.Birthday, this.account.userInformation.Language, data.new_password)
                .then((res) => {
                  debugger;
                  if (res == 'no_user') {
                    this.statusBar.backgroundColorByHexString('#ed5565');
                    let toast = this.toastCtrl.create({
                      message: this.updateErr,
                      duration: 3000,
                      position: 'top',
                      cssClass: "warning_toast"
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
                      cssClass: "warning_toast"
                    });
                    loader.dismiss();
                    toast.present();
                    toast.onDidDismiss(() => {
                      this.statusBar.backgroundColorByHexString('#253746');
                    });

                  }
                  else if (res) {
                    let Profile: any = res;
                    this.myProfile = Profile;
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
                      this.navCtrl.popTo(ProfilePage);
                    });
                  }
                })

            }
            else {
              this.statusBar.backgroundColorByHexString('#ed5565');
              let toast = this.toastCtrl.create({
                message: this.passValidation,
                duration: 3000,
                position: 'top',
                cssClass: "warning_toast"
              });
              toast.present();
              toast.onDidDismiss(() => {
                this.statusBar.backgroundColorByHexString('#253746');
              });
              return;
            }
            console.log('Saved clicked');
          }
        }

      ]
    }).present();


  }

  onSaveProfile(form: NgForm) {
    debugger;
    this.isValidFormSubmitted = true;
    if (form.invalid) {
      this.isValidFormSubmitted = false;
      return;
    }
    console.log(form.value);
    let loader = this.loadingCtrl.create({
      content: this.pleaseWait,
    });
    loader.present();
    let Token = "";
    this.fcm.onTokenRefresh().subscribe(token => {
      Token = token;
    });

    this.account.onCreateProfile(this.imgURL, form.value.firstName, form.value.lastName, form.value.gender, form.value.phoneNumber, this.currentDate, form.value.language, form.value.password, Token).then((res) => {
      debugger;

      if (res == 'no_user') {
        this.statusBar.backgroundColorByHexString('#ed5565');
        let toast = this.toastCtrl.create({
          message: this.phoneAlreadyRegister,
          duration: 3000,
          position: 'top',
          cssClass: "warning_toast"
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
          cssClass: "warning_toast"
        });
        loader.dismiss();
        toast.present();
        toast.onDidDismiss(() => {
          this.statusBar.backgroundColorByHexString('#253746');
        });

      }
      else if (res) {
        let profile: any = res;
        this.myProfile = profile;
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

  updateUser(form: NgForm) {

    debugger;
    this.isValidFormSubmitted = true;
    if (form.invalid) {
      this.isValidFormSubmitted = false;
      return;
    }
    console.log(form.value);
    let loader = this.loadingCtrl.create({
      content: this.pleaseWait,
    });
    loader.present();


    this.account.onEditProfile(this.account.userInformation.Id, this.imgURL, form.value.firstName, form.value.lastName, form.value.gender, form.value.phoneNumber, this.currentDate, form.value.language, this.account.userInformation.Password)
      .then((res) => {
        debugger;

        if (res == 'no_user') {
          this.statusBar.backgroundColorByHexString('#ed5565');
          let toast = this.toastCtrl.create({
            message: 'نعتذر حصل خطأ اثناء تحديث البيانات',
            duration: 3000,
            position: 'top',
            cssClass: "warning_toast"
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
            cssClass: "warning_toast"
          });
          loader.dismiss();
          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
          });

        }
        else if (res) {
          debugger;
          let Profile: any = res;
          this.myProfile = Profile;
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
          this.storage.set('lang', this.myProfile.Language);
          toast.present();
          toast.onDidDismiss(() => {
            this.statusBar.backgroundColorByHexString('#253746');
            this.myapp.initializeApp();
            //this.navCtrl.popTo(HomePage);
          });
        }
      })
      .catch((err) => {
        let toast = this.toastCtrl.create({
          message: this.updateErr,
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
        this.changePassword_tittle = "تغير الرقم السري";
        this.newPassword = "الرقم السري الجديد";
        this.oldPassword = "الرقم السري الحالي";
        this.changePasswordDesc = "ادخل الرقم السري الحالي و الجديد";
        this.passValidation = "الرقم السري الذي قمت بادخاة غير صحيح";
        this.change = "تغير";
        this.updateErr = "خطأ،لم يتم حفظ البيانات";
        this.phoneAlreadyRegister = "هذا الرقم تم تسجيله سابقا";
        this.allfieldrequried = "لتغير الرقم السري يجب ادخال الرقم السري الحالي والجديد "
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
        this.not_added = "Not added";
        this.update = "Update";
        this.changePassword_tittle = "Change password";
        this.newPassword = "New password";
        this.oldPassword = "Current password";
        this.changePasswordDesc = "insert current password and new password !";
        this.passValidation = "password you inserted wrong";
        this.change = "Change";
        this.updateErr = "Error while updating";
        this.phoneAlreadyRegister = "This phone already register !";
        this.allfieldrequried = "To change password you to insert current password and new password";
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
        this.not_added = "Not added";
        this.update = "update";
        this.changePassword_tittle = "Change password";
        this.newPassword = "New password";
        this.oldPassword = "Current password";
        this.changePasswordDesc = "insert current password and new password !";
        this.passValidation = "password you inserted wrong";
        this.change = "Change";
        this.updateErr = "Error while updating";
        this.phoneAlreadyRegister = "This phone already register !";
        this.allfieldrequried = "To change password you to insert current password and new password";
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';

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
