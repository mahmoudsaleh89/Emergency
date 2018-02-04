import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';


import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {GuidePage} from "../pages/guide/guide";
import {SettingsPage} from "../pages/settings/settings";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {WhereUseItPageModule} from "../pages/where-use-it/where-use-it.module";
import {FaqPage} from "../pages/faq/faq";
import {ConfigProvider} from "../providers/config/config";
import {TranslateService} from "@ngx-translate/core";
import {ProfilePage} from "../pages/profile/profile";
import {AccountProvider} from "../providers/account/account";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  userNavInfo={
      firstName:"",
      lastName:"",
      profileImage:"",
      phoneNumber:"",
      gender:"",
      birthday:""
    };
  pages: Array<{title: string, component: any,icon:any,desc:any}>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public storage: Storage,
              public config:ConfigProvider,
              public account:AccountProvider,
              public translate: TranslateService) {
    this.initializeApp();
      this.userNavInfo = this.account.userInformation;
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'home', component: HomePage,icon:"home", desc:""},
      { title: 'guide', component: GuidePage ,icon:"md-help", desc:""},
      { title: 'profile', component: ProfilePage ,icon:"person", desc:""},
      { title: 'tutorials', component: TutorialPage,icon:"color-wand", desc:"" },
      { title: 'about_us', component: WhereUseItPageModule,icon:"information-circle", desc:"" },
      { title: 'faq', component: FaqPage,icon:"md-help", desc:"" },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.splashScreen.hide();
      this.statusBar.backgroundColorByHexString('#253746');

      this.storage.get('user').then((userInfo)=>{
        console.log(userInfo.length);
        if (userInfo.phoneNumber !=""){
          this.account.userInformation = userInfo;
          this.userNavInfo = this.account.userInformation;
          this.storage.set('user',this.account.userInformation);
        }else {
         this.account.userInformation = {
              firstName:"",
              lastName:"",
              profileImage:"",
              phoneNumber:"",
              gender:"",
              birthday:"",
              language:""
            };
          this.userNavInfo = this.account.userInformation;
            this.storage.set('user',this.account.userInformation);
        }
      }).catch(()=>{
        this.account.userInformation = {
          firstName:"",
          lastName:"",
          profileImage:"",
          phoneNumber:"",
          gender:"",
          birthday:"",
          language:""
        };
        this.storage.set('user',this.account.userInformation);
      });

      this.storage.get('lang')
        .then((language)=>{
          if (language == 'en'){
            if(this.userNavInfo.phoneNumber == ""){
              this.userNavInfo ={
                firstName:"Guest",
                lastName:"user",
                profileImage:"assets/imgs/user.png",
                phoneNumber:"**********",
                gender:"",
                birthday:"",

              }
            }
            this.config.language = 'en';
            this.config.side = "left";
            this.translate.setDefaultLang('en');
            this.platform.setDir('ltr', true);
            this.platform.setLang('en', true);
          }else{
            debugger;
            if(this.userNavInfo.phoneNumber == ""){
              this.userNavInfo ={
                firstName:"مستخدم ",
                lastName:"غير معرف",
                profileImage:"assets/imgs/user.png",
                phoneNumber:"**********",
                gender:"",
                birthday:""
              }
            }
            this.storage.set('lang', 'ar');
            this.config.language = 'ar';
            this.config.side = "right";
            this.translate.setDefaultLang('ar');
            this.platform.setDir('rtl', true);
            this.platform.setLang('ar', true);
          }
        })
        .catch((error)=>{
          this.storage.set('lang', 'ar');
          this.config.language = 'ar';
          this.config.side = "right";
          this.translate.setDefaultLang('ar');
          this.platform.setDir('rtl', true);
          this.platform.setLang('ar', true);
        });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component == HomePage){
      this.nav.setRoot(page.component);

    }else{
      this.nav.push(page.component)
    }


  }
  openProfilePage(){
    this.nav.push(ProfilePage);
  }
}
