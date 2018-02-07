import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, NavController, Platform} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";
import {CallNumber} from "@ionic-native/call-number";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';
import {ConfigProvider} from "../../providers/config/config";
import {NotificationsPage} from "../notifications/notifications";
import {RatingPage} from "../rating/rating";

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('mapHome') mapElement: ElementRef;
  map: any;
  PleaseWait: string;
  Warning: string;
  NoInternetAccess: string;
  OK: string;
  fabslist: any

  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public nativeGeocoder: NativeGeocoder,
              public alertCtrl: AlertController,
              private callNumber: CallNumber,
              public translate: TranslateService,
              public storage: Storage,
              public platform: Platform,
              public config: ConfigProvider) {
    this.config.onGetFabsOption().then((data) => {
      this.fabslist = data;
    })

  }

  ionViewDidLoad() {

    this.geolocation.getCurrentPosition(
    ).then(
      (position) => {
        if (position) {
          this.addMap(position.coords.latitude, position.coords.longitude);
          this.nativeGeocoder.reverseGeocode(position.coords.latitude, position.coords.longitude)
            .then((result: NativeGeocoderReverseResult) => console.log(JSON.stringify(result)))
            .catch((error: any) => console.log(error));
        }

      }).catch(error => {
      debugger;
      this.addMap(29.266666, 47.933334);
      this.nativeGeocoder.reverseGeocode(29.266666, 47.933334)
        .then((result: NativeGeocoderReverseResult) => console.log(JSON.stringify(result)))
        .catch((error: any) => console.log(error));
    });

  }

  addMap(lat, long) {

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,

      zoomControl: false
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(lat, long);
  }

  addMarker(lat, long) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: false,
      position: this.map.getCenter()
    });
    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', (pos) => {
      infoWindow.open(this.map, marker);
    });
  }

  onSilentCall() {

    let alert = this.alertCtrl.create({
      title: 'ادارة العمليات ',
      subTitle: 'يرجى الهدوء تم ارسال موقعك للجهات المختصة وسيتم الوصول اليك خلال دقائق',
      buttons: ['موافق']
    });
    alert.present();
  }

  onVoiceCall() {
    let confirm = this.alertCtrl.create({
      title: 'مكالمة طوارئ',
      message: 'سيتم تحويل مكالمتك وموقعك الحالي لادارة العمليات ... اضغط موافق للاتصال ب ١١٢ حالا',
      buttons: [
        {
          text: 'الغاء',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'أتصال',
          handler: () => {
            this.callNumber.callNumber("112", true)
              .then(() => console.log('Launched dialer!'))
              .catch(() => console.log('Error launching dialer'));
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  onGoToNotification() {
    console.log('this is called on Go To notifications');
    this.navCtrl.push(NotificationsPage);
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {
      debugger;
      if (result == 'ar') {
        this.PleaseWait = 'يرجى الانتظار'
        this.Warning = 'تحذير';
        this.NoInternetAccess = " تأكد من اتصالك بالانترنت و تغيل خدمة المواقع";
        this.OK = "موافق";
        this.storage.set('lang', 'ar');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';
      }
      else if (result == 'en') {
        this.PleaseWait = 'Please Wait';
        this.Warning = 'Warning';
        this.NoInternetAccess = "please enable gps and make sure you have internet access";
        this.OK = "Ok";
        this.storage.set('lang', 'en');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';
      }
      else {
        this.PleaseWait = 'يرجى الانتظار'
        this.Warning = 'تحذير';
        this.NoInternetAccess = " تأكد من اتصالك بالانترنت و تغيل خدمة المواقع";
        this.OK = "موافق";

        this.storage.set('lang', 'ar');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';

      }

    });
  }

}
