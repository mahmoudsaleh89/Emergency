import {Component, ViewChild} from '@angular/core';
import {MenuController, ModalController, Nav, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';


import {HomePage} from '../pages/home/home';
import {TutorialPage} from "../pages/tutorial/tutorial";
import {FaqPage} from "../pages/faq/faq";
import {ConfigProvider} from "../providers/config/config";
import {TranslateService} from "@ngx-translate/core";
import {ProfilePage} from "../pages/profile/profile";
import {AccountProvider} from "../providers/account/account";
import {AddClaimPage} from "../pages/add-claim/add-claim";
import {FCM} from "@ionic-native/fcm";
import {LoginPage} from "../pages/login/login";
import {WhereUseItPage} from "../pages/where-use-it/where-use-it";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  userNavInfo: any;
  pages: Array<{ title: string, component: any, icon: any, desc: any }>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public storage: Storage,
              public config: ConfigProvider,
              public account: AccountProvider,
              public translate: TranslateService,
              public modalCtrl: ModalController,
              public menuCtrl: MenuController,
              public fcm: FCM,
              public toastCtrl: ToastController) {
    this.initializeApp();
    this.userNavInfo = this.account.userInformation;
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'home', component: HomePage, icon: "home", desc: "descMenu"},
      {title: 'profile', component: ProfilePage, icon: "person", desc: "descMenu"},
      {title: 'about_us', component: WhereUseItPage, icon: "information-circle", desc: "descMenu"},
      {title: 'FAQ', component: FaqPage, icon: "md-help", desc: "descMenu"},
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      let a = [
        {
          message: " تقييم الخدمه",
          img: "assets/imgs/survey.svg",
          describe: "من خلال هذا التقييم يتم تحسين الخدمات المقدمه",
          notifyType: "1",
          notifyData: [
            {
              qusID: 1,
              qusText: "this is qustions text 1",
              value: 0,
              seen: false
            },
            {
              qusID: 2,
              qusText: "this is qustions text 2",
              value: 0,
              seen: true
            },
            {
              qusID: 3,
              qusText: "this is qustions text 3",
              value: 0,
              seen: true
            }
          ]
        },
        {
          message: "news",
          img: "assets/imgs/text-lines.svg",
          describe: "some describe for news ",
          notifyType: "2",
          notifyData: {
            qusID: 1,
            qusText: "this is qustions text  type 2 describe ",
            seen: false
          }
        }
      ];
      this.storage.set('notificationList', a);
      this.statusBar.backgroundColorByHexString('#253746');
      this.storage.get('first_run')
        .then((res) => {
          console.log('homeComp', res);
          if (res == true || res == null || res == 'undefind') {
            this.storage.set('first_run', false);
            this.config.language = 'en';
            this.config.side = "left";
            this.translate.setDefaultLang('en');
            this.platform.setDir('ltr', true);
            this.platform.setLang('en', true);
            this.account.userInformation = {
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
            this.storage.set('user', this.account.userInformation);
            this.splashScreen.hide();
            this.nav.setRoot(LoginPage);
          } else {
            //this.nav.setRoot(LoginPage);
            this.storage.set('first_run', false);
            this.storage.get('user')
              .then((userInfo) => {
                console.log(userInfo.length);
                if (userInfo.Id != "") {
                  this.account.userInformation = userInfo;
                  this.storage.set('user', this.account.userInformation);
                }
                else {
                  debugger
                  this.storage.get('lang')
                    .then((lanRes) => {

                      if (lanRes == 'english') {
                        this.storage.set('first_run', false);
                        this.config.language = 'en';
                        this.config.side = "left";
                        this.translate.setDefaultLang('en');
                        this.platform.setDir('ltr', true);
                        this.platform.setLang('en', true);
                        this.account.userInformation = {
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
                        this.storage.set('user', this.account.userInformation);
                        this.storage.set('lang', "english");
                        this.splashScreen.hide();
                        this.nav.setRoot(HomePage);
                      }
                      else if (lanRes == 'arabic') {

                        this.storage.set('first_run', false);
                        this.config.language = 'ar';
                        this.config.side = "left";
                        this.translate.setDefaultLang('en');
                        this.platform.setDir('ltr', true);
                        this.platform.setLang('ar', true);
                        this.account.userInformation = {
                          Id: "",
                          FirstName: "مستخدم",
                          Lastname: "غير معرف",
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
                        this.storage.set('user', this.account.userInformation);
                        this.storage.set('lang', "arabic");
                        this.splashScreen.hide();
                        this.nav.setRoot(HomePage);
                      } else {
                        this.account.userInformation = {
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
                        this.storage.set('lang', "english");
                        this.splashScreen.hide();
                        this.nav.setRoot(HomePage);
                      }

                    });
                }

              })
              .catch(() => {
                this.storage.get('lang')
                  .then((lanRes) => {
                    if (lanRes == 'english') {
                      this.account.userInformation = {
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
                      this.storage.set('user', this.account.userInformation);
                    }
                    else {
                      debugger
                      this.account.userInformation = {
                        Id: "",
                        FirstName: "مستخدم",
                        Lastname: "غير معرف",
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
                      this.storage.set('user', this.account.userInformation);
                    }

                  });
              });
            /*Start set lang and Dir*/
            this.storage.get('lang')
              .then((language) => {
                if (language == 'english') {

                  this.config.language = 'en';
                  this.config.side = "left";
                  this.translate.setDefaultLang('en');
                  this.platform.setDir('ltr', true);
                  this.platform.setLang('en', true);
                  this.splashScreen.hide();
                  this.nav.setRoot(HomePage);
                }
                else {
                  this.storage.set('lang', 'arabic');
                  this.config.language = 'ar';
                  this.config.side = "right";
                  this.translate.setDefaultLang('ar');
                  this.platform.setDir('rtl', true);
                  this.platform.setLang('ar', true);
                  this.splashScreen.hide();
                  this.nav.setRoot(HomePage);
                }

              })
              .catch((error) => {
                this.storage.set('lang', 'arabic');
                this.config.language = 'ar';
                this.config.side = "right";
                this.translate.setDefaultLang('ar');
                this.platform.setDir('rtl', true);
                this.platform.setLang('ar', true);
                this.splashScreen.hide();
                this.nav.setRoot(HomePage);
              });
          }
        })
        .catch((err) => {
          this.storage.set('first_run', false);
          this.storage.get('user')
            .then((userInfo) => {
              console.log(userInfo.length);

              if (userInfo.Id != "") {
                this.account.userInformation = userInfo;
                this.storage.set('user', this.account.userInformation);
              } else {
                debugger
                this.storage.get('lang')
                  .then((lanRes) => {
                    if (lanRes == 'english') {

                      this.account.userInformation = {
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
                      this.storage.set('user', this.account.userInformation);
                      this.splashScreen.hide();
                      this.nav.setRoot(HomePage);
                    }
                    else {
                      debugger
                      this.account.userInformation = {
                        Id: "",
                        FirstName: "مستخدم",
                        Lastname: "غير معرف",
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
                      this.storage.set('user', this.account.userInformation);
                      this.splashScreen.hide();
                      this.nav.setRoot(HomePage);
                    }

                  });
              }

            })
            .catch(() => {
              this.storage.get('lang')
                .then((lanRes) => {
                  if (lanRes == 'english') {
                    this.account.userInformation = {
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
                    this.storage.set('user', this.account.userInformation);
                  }
                  else {
                    debugger
                    this.account.userInformation = {
                      Id: "",
                      FirstName: "مستخدم",
                      Lastname: "غير معرف",
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
                    this.storage.set('user', this.account.userInformation);
                  }

                });
            });
          /*Start set lang and Dir*/
          this.storage.get('lang')
            .then((language) => {
              if (language == 'english') {

                this.config.language = 'en';
                this.config.side = "left";
                this.translate.setDefaultLang('en');
                this.platform.setDir('ltr', true);
                this.platform.setLang('en', true);
              } else {

                this.storage.set('lang', 'arabic');
                this.config.language = 'ar';
                this.config.side = "right";
                this.translate.setDefaultLang('ar');
                this.platform.setDir('rtl', true);
                this.platform.setLang('ar', true);
              }
            })
            .catch((error) => {
              this.storage.set('lang', 'arabic');
              this.config.language = 'ar';
              this.config.side = "right";
              this.translate.setDefaultLang('ar');
              this.platform.setDir('rtl', true);
              this.platform.setLang('ar', true);
            });

        });

      this.fcm.onNotification().subscribe(data => {
        let resList: any;

        if (data.wasTapped) {
          this.storage.get('notificationList')
            .then((res) => {

              if (res) {
                resList = res;
                resList.push(data);
                this.storage.set('notificationList', resList);
                this.config.alertNotify = true;
              } else {
                resList = [];
                resList.push(data);
                this.storage.set('notificationList', resList);
                this.config.alertNotify = true;
              }
            })
            .catch((err) => {
              resList = [];
              resList.push(data);
              this.storage.set('notificationList', resList);
              this.config.alertNotify = true;
            })
          console.log(data);
        } else {
          this.config.alertNotify = true;
          console.log(data);
          this.toastCtrl.create({
            message: data.textmessage,
            duration: 5000,
            position: 'bottom'
          }).present();
          console.log("Received in foreground");
        }

        /*this method for change token id*/
        this.fcm.onTokenRefresh().subscribe(token => {
          this.storage.get('have_account').then((resp) => {
            if (resp == true) {
              this.account.onUpdateDeviceToken(this.account.userInformation.PhoneNumber, token)
                .then(()=>{
                console.log('updated device token subsets')
              }).catch((err)=>{
                console.log(err, "upatde device token err")
              })
            } else {
              this.storage.get('emergency_phone_box').then((em_phone)=>{
                if(em_phone){
                  this.account.onUpdateDeviceToken(em_phone, token)
                    .then(()=>{
                      console.log('updated device token subsets')
                    }).catch((err)=>{
                    console.log(err, "upatde device token err")
                  })
                }else {
                  console.log('there is no number and not login')
                }
              })

            }
          })
          console.log(token)
        });
      });
    });


  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component == HomePage) {
      this.nav.setRoot(page.component);
    } else if (page.component == ProfilePage) {
      this.openProfilePage();
    }
    else {
      this.nav.push(page.component)
    }


  }

  onGoToAddCliam() {
    this.modalCtrl.create(AddClaimPage).present();
    this.menuCtrl.close();
  }

  onStartTutorials() {
    this.modalCtrl.create(TutorialPage).present();
    this.menuCtrl.close();
  }

  openProfilePage() {
    this.storage.get('have_account')
      .then((res) => {
        if (res == true) {
          this.nav.push(ProfilePage);
        } else {
          this.nav.push(LoginPage);
        }
      })

  }
}
