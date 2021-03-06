import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Geolocation} from "@ionic-native/geolocation";
import {FaqPage} from "../pages/faq/faq";
import {GuidePage} from "../pages/guide/guide";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {WhereUseItPage} from "../pages/where-use-it/where-use-it";
import {CallNumber} from "@ionic-native/call-number";
import { ConfigProvider } from '../providers/config/config';
import {IonicStorageModule} from "@ionic/storage";
import {DatePicker} from "@ionic-native/date-picker";
import {ProfilePage} from "../pages/profile/profile";
import {AddSosNumberPage} from "../pages/add-sos-number/add-sos-number";
import {Contact, Contacts} from "@ionic-native/contacts";
import {ImagePicker} from "@ionic-native/image-picker";
import {Camera} from "@ionic-native/camera";
import { AccountProvider } from '../providers/account/account';
import {NotificationsPage} from "../pages/notifications/notifications";
import {RatingPage} from "../pages/rating/rating";
import {AddClaimPage} from "../pages/add-claim/add-claim";
import {FCM} from "@ionic-native/fcm";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoginPage} from "../pages/login/login";
import {Sim} from "@ionic-native/sim";
import { OprationsProvider } from '../providers/oprations/oprations';
import {ProfileEditPage} from "../pages/profile-edit/profile-edit";
import {GoogleMaps} from "@ionic-native/google-maps";
import {QuestionDetailsPage} from "../pages/question-details/question-details";
import {NewsPage} from "../pages/news/news";


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/lang/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FaqPage,
    GuidePage,
    TutorialPage,
    WhereUseItPage,
    ProfilePage,
    AddSosNumberPage,
    NotificationsPage,
    RatingPage,
    AddClaimPage,
    LoginPage,
    ProfileEditPage,
    QuestionDetailsPage,
    NewsPage
  ],
  imports: [
    BrowserModule,
    IonicStorageModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FaqPage,
    GuidePage,
    TutorialPage,
    WhereUseItPage,
    ProfilePage,
    AddSosNumberPage,
    NotificationsPage,
    RatingPage,
    AddClaimPage,
    LoginPage,
    ProfileEditPage,
    QuestionDetailsPage,
    NewsPage
  ],
  providers: [
    Geolocation,
    StatusBar,
    SplashScreen,
    NativeGeocoder,
    CallNumber,
    DatePicker,
    Contact,
    Contacts,
    ImagePicker,
    Camera,
    FCM,
    Sim,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigProvider,
    AccountProvider,
    RatingPage,
    OprationsProvider,
    GoogleMaps
  ]
})
export class AppModule {}
