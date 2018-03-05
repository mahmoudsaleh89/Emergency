import {Component, EventEmitter, Injectable, Output, ViewChild} from '@angular/core';
import {MenuController, Modal, ModalController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';


import {HomePage} from '../pages/home/home';
import {GuidePage} from "../pages/guide/guide";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {WhereUseItPageModule} from "../pages/where-use-it/where-use-it.module";
import {FaqPage} from "../pages/faq/faq";
import {ConfigProvider} from "../providers/config/config";
import {TranslateService} from "@ngx-translate/core";
import {ProfilePage} from "../pages/profile/profile";
import {AccountProvider} from "../providers/account/account";
import {AddClaimPage} from "../pages/add-claim/add-claim";
import {FCM} from "@ionic-native/fcm";
import {LoginPage} from "../pages/login/login";
import {ProfileEditPage} from "../pages/profile-edit/profile-edit";
import {WhereUseItPage} from "../pages/where-use-it/where-use-it";
import {Network} from "@ionic-native/network";


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
              private network: Network) {
    this.initializeApp();
    this.userNavInfo = this.account.userInformation;
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'home', component: HomePage, icon: "home", desc: "descMenu"},
      {title: 'profile', component: ProfilePage, icon: "person", desc: "descMenu"},
      /*{ title: 'send_claim', component: AddClaimPage ,icon:"bookmarks", desc:""},*/
     /* {title: 'guide', component: GuidePage, icon: "md-help", desc: "descMenu"},*/
      /*{title: 'tutorials', component: TutorialPage, icon: "color-wand", desc: "descMenu"},*/
      {title: 'about_us', component: WhereUseItPage, icon: "information-circle", desc: "descMenu"},
      {title: 'FAQ', component: FaqPage, icon: "md-help", desc: "descMenu"},
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.network.onConnect().subscribe((data) => {
        debugger;
        console.log('network connected!',data);
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
      },(err)=>{
        debugger;
        console.log('network Error!',err);
      });

      this.network.onDisconnect().subscribe((res)=>{
        debugger;
        console.log('onDisconnect' , res);
      }, (statusErr)=>{
        console.log('onDisconnect Error',statusErr);
      });
      /*this.splashScreen.hide();*/
      this.statusBar.backgroundColorByHexString('#253746');
      this.storage.get('first_run')
        .then((res) => {
          debugger;
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
                debugger;
                if (userInfo.Id != "") {
                  this.account.userInformation = userInfo;
                  this.storage.set('user', this.account.userInformation);
                }
                else {
                  debugger
                  this.storage.get('lang')
                    .then((lanRes) => {
                      debugger;
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
                        debugger;
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
              debugger;
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
        if (data.wasTapped) {

          console.log(data);
        } else {

          console.log(data);

          console.log("Received in foreground");
        }
        /*this method for change token id*/
        this.fcm.onTokenRefresh().subscribe(token => {
          this.storage.get('lang').then((data) => {
          });
        });
      });
     /* setTimeout(() => {
        this.splashScreen.hide();
      }, 100);*/
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
  onStartTutorials(){
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
