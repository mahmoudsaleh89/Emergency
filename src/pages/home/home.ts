import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, NavController, Platform, ToastController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {NativeGeocoder, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";
import {CallNumber} from "@ionic-native/call-number";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from '@ionic/storage';
import {ConfigProvider} from "../../providers/config/config";
import {NotificationsPage} from "../notifications/notifications";
import {AccountProvider} from "../../providers/account/account";
import {OprationsProvider} from "../../providers/oprations/oprations";
import {StatusBar} from "@ionic-native/status-bar";
import {Network} from "@ionic-native/network";

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
  fabslist: any;
  location_name;
  lng: any;
  lat: any;
  insert_phone_number = "";
  cancel_requset = "";
  send_help_requset = "";
  help_title = "";
  help_guide = "";
  opration_mangement = "";
  success_requset_msg = "";

  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public nativeGeocoder: NativeGeocoder,
              public alertCtrl: AlertController,
              private callNumber: CallNumber,
              public translate: TranslateService,
              public storage: Storage,
              public platform: Platform,
              public config: ConfigProvider,
              public account: AccountProvider,
              private  op: OprationsProvider,
              private toastCtrl: ToastController,
              private statusBar: StatusBar,
              private network: Network) {
    this.config.onGetFabsOption().then((data) => {
      this.fabslist = data;
    });

    this.setLangAndDirction();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {

    this.network.onConnect().subscribe((data) => {
      debugger;
      console.log('network connected!',data);
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
    });

    this.network.onDisconnect().subscribe((res)=>{
      debugger;
      console.log('onDisconnect' , res);
    })



    this.geolocation.getCurrentPosition(
    ).then(
      (position) => {
        debugger;
        if (position) {
          this.addMap(position.coords.latitude, position.coords.longitude);
          this.lng = position.coords.longitude;
          this.lat = position.coords.latitude;
          this.nativeGeocoder.reverseGeocode(position.coords.latitude, position.coords.longitude)
            .then((result: NativeGeocoderReverseResult) => {
                debugger;
                this.location_name = result.administrativeArea + '-' + result.locality + '-' + result.subLocality + '-' + result.thoroughfare + '-' + result.subThoroughfare;
                console.log(this.location_name);
              }
            ).catch((error: any) => {
            console.log(error)
          });
        }

      }).catch(error => {

      this.addMap(29.266666, 47.933334);
      this.nativeGeocoder.reverseGeocode(29.266666, 47.933334)
        .then((result: NativeGeocoderReverseResult) => console.log(JSON.stringify(result)))
        .catch((error: any) => console.log(error));
    });
    debugger;
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
      icon: 'assets/imgs/pin.png',
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

  onDirectCall() {
    debugger;
    this.storage.get('have_account')
      .then((res) => {
        debugger;
        if (res == true) {
          this.callNumber.callNumber("112", true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
          this.op.onCreateRequest(this.account.userInformation.PhoneNumber, this.account.userInformation.Id, "", this.lat, this.lng, true, this.location_name)
            .then((res) => {
              console.log(res);
            })
        }
        else {
          this.storage.get('emergency_phone_box').then((em_phone) => {
            debugger;
            if (em_phone) {
              this.callNumber.callNumber("112", true)
                .then(() => console.log('Launched dialer!'))
                .catch(() => console.log('Error launching dialer'));
              this.op.onCreateRequest(em_phone, "", "", this.lat, this.lng, true, this.location_name)
                .then((res) => {
                  debugger;
                  if (res == 'not_send') {
                    this.statusBar.backgroundColorByHexString('#ed5565');
                    let toast = this.toastCtrl.create({
                      message: 'هذا الرقم تم تسجيله سابقا',
                      duration: 3000,
                      position: 'top',
                      cssClass: "warning_toast"
                    });
                    toast.present();
                    toast.onDidDismiss(() => {
                      this.statusBar.backgroundColorByHexString('#253746');
                    });
                  }
                  else if (res == 'server_err') {
                    this.statusBar.backgroundColorByHexString('#ed5565');
                    let toast = this.toastCtrl.create({
                      message: 'هذا الرقم تم تسجيله سابقا',
                      duration: 3000,
                      position: 'top',
                      cssClass: "warning_toast"
                    });
                    toast.present();
                    toast.onDidDismiss(() => {
                      this.statusBar.backgroundColorByHexString('#253746');
                    });
                  }
                })
            } else {
              debugger;
              let alert = this.alertCtrl.create({
                title: this.help_title,
                inputs: [
                  {
                    name: 'phone_number',
                    placeholder: this.insert_phone_number,
                    type: 'tel'
                  }
                ],
                buttons: [
                  {
                    text: this.cancel_requset,
                    role: 'cancel',
                    handler: data => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text: this.send_help_requset,
                    handler: data => {
                      if (data.phone_number) {
                        this.callNumber.callNumber("112", true)
                          .then(() => console.log('Launched dialer!'))
                          .catch(() => console.log('Error launching dialer'));
                        this.storage.set('emergency_phone_box', data.phone_number);
                        //call api
                        this.op.onCreateRequest(data.phone_number, "", "", this.lat, this.lng, true, this.location_name)
                          .then((res) => {
                            if (res == 'not_send') {
                              this.statusBar.backgroundColorByHexString('#ed5565');
                              let toast = this.toastCtrl.create({
                                message: 'هذا الرقم تم تسجيله سابقا',
                                duration: 3000,
                                position: 'top',
                                cssClass: "warning_toast"
                              });
                              toast.present();
                              toast.onDidDismiss(() => {
                                this.statusBar.backgroundColorByHexString('#253746');
                              });
                            }
                            else if (res == 'server_err') {
                              this.statusBar.backgroundColorByHexString('#ed5565');
                              let toast = this.toastCtrl.create({
                                message: 'هذا الرقم تم تسجيله سابقا',
                                duration: 3000,
                                position: 'top',
                                cssClass: "warning_toast"
                              });
                              toast.present();
                              toast.onDidDismiss(() => {
                                this.statusBar.backgroundColorByHexString('#253746');
                              });
                            }
                            else {
                              this.callNumber.callNumber("112", true)
                                .then(() => console.log('Launched dialer!'))
                                .catch(() => console.log('Error launching dialer'));
                            }

                          })
                      } else {
                        //show Error msg
                        return false;
                      }
                    }
                  }
                ]
              });
              alert.present();
            }
          }).catch(() => {
            let alert = this.alertCtrl.create({
              title: this.help_title,
              inputs: [
                {
                  name: 'phone_number',
                  placeholder: this.insert_phone_number,
                  type: 'tel'
                }
              ],
              buttons: [
                {
                  text: this.cancel_requset,
                  role: 'cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: this.send_help_requset,
                  handler: data => {
                    if (data.phone_number) {
                      this.storage.set('emergency_phone_box', data.phone_number);
                      //call api
                      this.op.onCreateRequest(data.phone_number, "", "", this.lat, this.lng, true, this.location_name)
                        .then((res) => {
                          if (res == 'not_send') {
                            this.statusBar.backgroundColorByHexString('#ed5565');
                            let toast = this.toastCtrl.create({
                              message: 'هذا الرقم تم تسجيله سابقا',
                              duration: 3000,
                              position: 'top',
                              cssClass: "warning_toast"
                            });
                            toast.present();
                            toast.onDidDismiss(() => {
                              this.statusBar.backgroundColorByHexString('#253746');
                            });
                          }
                          else if (res == 'server_err') {
                            this.statusBar.backgroundColorByHexString('#ed5565');
                            let toast = this.toastCtrl.create({
                              message: 'هذا الرقم تم تسجيله سابقا',
                              duration: 3000,
                              position: 'top',
                              cssClass: "warning_toast"
                            });
                            toast.present();
                            toast.onDidDismiss(() => {
                              this.statusBar.backgroundColorByHexString('#253746');
                            });
                          }
                          else {
                            this.callNumber.callNumber("112", true)
                              .then(() => console.log('Launched dialer!'))
                              .catch(() => console.log('Error launching dialer'));
                          }

                        })
                    } else {
                      //show Error msg
                      return false;
                    }
                  }
                }
              ]
            });
            alert.present();
          });


        }
      })
      .catch((err) => {
      })
  }

  onSilentCall(depId) {
    this.storage.get('have_account')
      .then((res) => {
        debugger;
        if (res == true) {
          this.op.onCreateRequest(this.account.userInformation.PhoneNumber, this.account.userInformation.Id, depId, this.lat, this.lng, false, this.location_name)
            .then((res) => {
              if (res == 'not_send') {
                this.statusBar.backgroundColorByHexString('#ed5565');
                let toast = this.toastCtrl.create({
                  message: 'هذا الرقم تم تسجيله سابقا',
                  duration: 3000,
                  position: 'top',
                  cssClass: "warning_toast"
                });
                toast.present();
                toast.onDidDismiss(() => {
                  this.statusBar.backgroundColorByHexString('#253746');
                });
              }
              else if (res == 'server_err') {
                this.statusBar.backgroundColorByHexString('#ed5565');
                let toast = this.toastCtrl.create({
                  message: 'هذا الرقم تم تسجيله سابقا',
                  duration: 3000,
                  position: 'top',
                  cssClass: "warning_toast"
                });
                toast.present();
                toast.onDidDismiss(() => {
                  this.statusBar.backgroundColorByHexString('#253746');
                });
              }
              else {
                let alert = this.alertCtrl.create({
                  title: this.help_title,
                  subTitle: this.help_guide,
                  buttons: [this.OK]
                });
                alert.present();
              }
            })
        }
        else {
          this.storage.get('emergency_phone_box').then((em_phone) => {
            debugger;
            if (em_phone) {
              this.callNumber.callNumber("112", true)
                .then(() => console.log('Launched dialer!'))
                .catch(() => console.log('Error launching dialer'));
              this.op.onCreateRequest(em_phone, "", depId, this.lat, this.lng, false, this.location_name)
                .then((res) => {
                  debugger;
                  if (res == 'not_send') {
                    this.statusBar.backgroundColorByHexString('#ed5565');
                    let toast = this.toastCtrl.create({
                      message: 'هذا الرقم تم تسجيله سابقا',
                      duration: 3000,
                      position: 'top',
                      cssClass: "warning_toast"
                    });
                    toast.present();
                    toast.onDidDismiss(() => {
                      this.statusBar.backgroundColorByHexString('#253746');
                    });
                  }
                  else if (res == 'server_err') {
                    this.statusBar.backgroundColorByHexString('#ed5565');
                    let toast = this.toastCtrl.create({
                      message: 'هذا الرقم تم تسجيله سابقا',
                      duration: 3000,
                      position: 'top',
                      cssClass: "warning_toast"
                    });
                    toast.present();
                    toast.onDidDismiss(() => {
                      this.statusBar.backgroundColorByHexString('#253746');
                    });
                  }
                  else {
                    let alert = this.alertCtrl.create({
                      title: this.help_title,
                      subTitle: this.help_guide,
                      buttons: [this.OK]
                    });
                    alert.present();
                  }
                })
            } else {
              debugger;
              let alert = this.alertCtrl.create({
                title: this.help_title,
                inputs: [
                  {
                    name: 'phone_number',
                    placeholder: this.insert_phone_number,
                    type: 'tel'
                  }
                ],
                buttons: [
                  {
                    text: this.cancel_requset,
                    role: 'cancel',
                    handler: data => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text: this.send_help_requset,
                    handler: data => {
                      if (data.phone_number) {
                        this.callNumber.callNumber("112", true)
                          .then(() => console.log('Launched dialer!'))
                          .catch(() => console.log('Error launching dialer'));
                        this.storage.set('emergency_phone_box', data.phone_number);
                        //call api
                        this.op.onCreateRequest(data.phone_number, "", depId, this.lat, this.lng, false, this.location_name)
                          .then((res) => {
                            if (res == 'not_send') {
                              this.statusBar.backgroundColorByHexString('#ed5565');
                              let toast = this.toastCtrl.create({
                                message: 'هذا الرقم تم تسجيله سابقا',
                                duration: 3000,
                                position: 'top',
                                cssClass: "warning_toast"
                              });
                              toast.present();
                              toast.onDidDismiss(() => {
                                this.statusBar.backgroundColorByHexString('#253746');
                              });
                            }
                            else if (res == 'server_err') {
                              this.statusBar.backgroundColorByHexString('#ed5565');
                              let toast = this.toastCtrl.create({
                                message: 'هذا الرقم تم تسجيله سابقا',
                                duration: 3000,
                                position: 'top',
                                cssClass: "warning_toast"
                              });
                              toast.present();
                              toast.onDidDismiss(() => {
                                this.statusBar.backgroundColorByHexString('#253746');
                              });
                            }
                            else {

                              let alert = this.alertCtrl.create({
                                title: this.help_title,
                                subTitle: this.help_guide,
                                buttons: [this.OK]
                              });
                              alert.present();
                            }

                          })
                      } else {
                        //show Error msg
                        return false;
                      }
                    }
                  }
                ]
              });
              alert.present();
            }
          }).catch(() => {
            let alert = this.alertCtrl.create({
              title: this.help_title,
              inputs: [
                {
                  name: 'phone_number',
                  placeholder: this.insert_phone_number,
                  type: 'tel'
                }
              ],
              buttons: [
                {
                  text: this.cancel_requset,
                  role: 'cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: this.send_help_requset,
                  handler: data => {
                    if (data.phone_number) {
                      this.storage.set('emergency_phone_box', data.phone_number);
                      //call api
                      this.op.onCreateRequest(data.phone_number, "", "", this.lat, this.lng, true, this.location_name)
                        .then((res) => {
                          if (res == 'not_send') {
                            this.statusBar.backgroundColorByHexString('#ed5565');
                            let toast = this.toastCtrl.create({
                              message: 'هذا الرقم تم تسجيله سابقا',
                              duration: 3000,
                              position: 'top',
                              cssClass: "warning_toast"
                            });
                            toast.present();
                            toast.onDidDismiss(() => {
                              this.statusBar.backgroundColorByHexString('#253746');
                            });
                          }
                          else if (res == 'server_err') {
                            this.statusBar.backgroundColorByHexString('#ed5565');
                            let toast = this.toastCtrl.create({
                              message: 'هذا الرقم تم تسجيله سابقا',
                              duration: 3000,
                              position: 'top',
                              cssClass: "warning_toast"
                            });
                            toast.present();
                            toast.onDidDismiss(() => {
                              this.statusBar.backgroundColorByHexString('#253746');
                            });
                          }
                          else {
                            this.callNumber.callNumber("112", true)
                              .then(() => console.log('Launched dialer!'))
                              .catch(() => console.log('Error launching dialer'));
                          }

                        })
                    } else {
                      //show Error msg
                      return false;
                    }
                  }
                }
              ]
            });
            alert.present();
          });


        }
      })
      .catch((err) => {
      })

  }

  onVoiceCall(depId) {
    this.storage.get('have_account')
      .then((res) => {
        debugger;
        if (res == true) {
          this.callNumber.callNumber("112", true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
          this.op.onCreateRequest(this.account.userInformation.PhoneNumber, this.account.userInformation.Id, depId, this.lat, this.lng, true, this.location_name)
            .then((res) => {
              console.log(res);
            })
        }
        else {
          this.storage.get('emergency_phone_box').then((em_phone) => {
            debugger;
            if (em_phone) {
              this.callNumber.callNumber("112", true)
                .then(() => console.log('Launched dialer!'))
                .catch(() => console.log('Error launching dialer'));
              this.op.onCreateRequest(em_phone, "", depId, this.lat, this.lng, true, this.location_name)
                .then((res) => {
                  debugger;
                  if (res == 'not_send') {
                    this.statusBar.backgroundColorByHexString('#ed5565');
                    let toast = this.toastCtrl.create({
                      message: 'هذا الرقم تم تسجيله سابقا',
                      duration: 3000,
                      position: 'top',
                      cssClass: "warning_toast"
                    });
                    toast.present();
                    toast.onDidDismiss(() => {
                      this.statusBar.backgroundColorByHexString('#253746');
                    });
                  }
                  else if (res == 'server_err') {
                    this.statusBar.backgroundColorByHexString('#ed5565');
                    let toast = this.toastCtrl.create({
                      message: 'هذا الرقم تم تسجيله سابقا',
                      duration: 3000,
                      position: 'top',
                      cssClass: "warning_toast"
                    });
                    toast.present();
                    toast.onDidDismiss(() => {
                      this.statusBar.backgroundColorByHexString('#253746');
                    });
                  }
                })
            } else {
              debugger;
              let alert = this.alertCtrl.create({
                title: this.help_title,
                inputs: [
                  {
                    name: 'phone_number',
                    placeholder: this.insert_phone_number,
                    type: 'tel'
                  }
                ],
                buttons: [
                  {
                    text: this.cancel_requset,
                    role: 'cancel',
                    handler: data => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text: this.send_help_requset,
                    handler: data => {
                      if (data.phone_number) {
                        this.callNumber.callNumber("112", true)
                          .then(() => console.log('Launched dialer!'))
                          .catch(() => console.log('Error launching dialer'));
                        this.storage.set('emergency_phone_box', data.phone_number);
                        //call api
                        this.op.onCreateRequest(data.phone_number, "", depId, this.lat, this.lng, true, this.location_name)
                          .then((res) => {
                            if (res == 'not_send') {
                              this.statusBar.backgroundColorByHexString('#ed5565');
                              let toast = this.toastCtrl.create({
                                message: 'هذا الرقم تم تسجيله سابقا',
                                duration: 3000,
                                position: 'top',
                                cssClass: "warning_toast"
                              });
                              toast.present();
                              toast.onDidDismiss(() => {
                                this.statusBar.backgroundColorByHexString('#253746');
                              });
                            }
                            else if (res == 'server_err') {
                              this.statusBar.backgroundColorByHexString('#ed5565');
                              let toast = this.toastCtrl.create({
                                message: 'هذا الرقم تم تسجيله سابقا',
                                duration: 3000,
                                position: 'top',
                                cssClass: "warning_toast"
                              });
                              toast.present();
                              toast.onDidDismiss(() => {
                                this.statusBar.backgroundColorByHexString('#253746');
                              });
                            }

                          })
                      } else {
                        //show Error msg
                        return false;
                      }
                    }
                  }
                ]
              });
              alert.present();
            }
          }).catch(() => {
            let alert = this.alertCtrl.create({
              title: this.help_title,
              inputs: [
                {
                  name: 'phone_number',
                  placeholder: this.insert_phone_number,
                  type: 'tel'
                }
              ],
              buttons: [
                {
                  text: this.cancel_requset,
                  role: 'cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: this.send_help_requset,
                  handler: data => {
                    if (data.phone_number) {
                      this.storage.set('emergency_phone_box', data.phone_number);
                      //call api
                      this.op.onCreateRequest(data.phone_number, "", "", this.lat, this.lng, true, this.location_name)
                        .then((res) => {
                          if (res == 'not_send') {
                            this.statusBar.backgroundColorByHexString('#ed5565');
                            let toast = this.toastCtrl.create({
                              message: 'هذا الرقم تم تسجيله سابقا',
                              duration: 3000,
                              position: 'top',
                              cssClass: "warning_toast"
                            });
                            toast.present();
                            toast.onDidDismiss(() => {
                              this.statusBar.backgroundColorByHexString('#253746');
                            });
                          }
                          else if (res == 'server_err') {
                            this.statusBar.backgroundColorByHexString('#ed5565');
                            let toast = this.toastCtrl.create({
                              message: 'هذا الرقم تم تسجيله سابقا',
                              duration: 3000,
                              position: 'top',
                              cssClass: "warning_toast"
                            });
                            toast.present();
                            toast.onDidDismiss(() => {
                              this.statusBar.backgroundColorByHexString('#253746');
                            });
                          }
                          else {
                            this.callNumber.callNumber("112", true)
                              .then(() => console.log('Launched dialer!'))
                              .catch(() => console.log('Error launching dialer'));
                          }

                        })
                    } else {
                      //show Error msg
                      return false;
                    }
                  }
                }
              ]
            });
            alert.present();
          });


        }
      })
      .catch((err) => {
      })
  }

  onGoToNotification() {
    console.log('this is called on Go To notifications');
    this.navCtrl.push(NotificationsPage);
  }

  setLangAndDirction() {
    this.storage.get('lang').then((result) => {

      if (result == 'arabic') {
        this.PleaseWait = 'يرجى الانتظار'
        this.Warning = 'تحذير';
        this.NoInternetAccess = " تأكد من اتصالك بالانترنت و تغيل خدمة المواقع";
        this.OK = "موافق";
        this.insert_phone_number = "أدخل رقم هاتفك";
        this.cancel_requset = "الغاء المساعده";
        this.send_help_requset = " اطلب المساعدة";
        this.help_title = "طلب المساعدة";
        this.help_guide = "يرجى الهدوء تم ارسال موقعك الحالي ورقم هاتفك الي الجهات المختصة";
        this.storage.set('lang', 'arabic');
        this.translate.setDefaultLang('ar');
        this.platform.setDir('rtl', true);
        this.platform.setLang('ar', true);
        this.config.side = 'right';
      }
      else if (result == 'english') {
        this.PleaseWait = 'Please Wait';
        this.Warning = 'Warning';
        this.NoInternetAccess = "please enable gps and make sure you have internet access";
        this.OK = "Ok";
        this.insert_phone_number = "Insert phone number";
        this.cancel_requset = "Cancel help";
        this.send_help_requset = "Send help";
        this.help_title = "Help request";
        this.help_guide = "Please calm down your current location and your phone number has been sent to the competent authorities";
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';
      }
      else {
        this.PleaseWait = 'Please Wait';
        this.Warning = 'Warning';
        this.NoInternetAccess = "please enable gps and make sure you have internet access";
        this.OK = "Ok";
        this.insert_phone_number = "Insert phone number";
        this.cancel_requset = "Cancel help";
        this.send_help_requset = "Send help";
        this.help_title = "Help request";
        this.help_guide = "Please calm down your current location and your phone number has been sent to the competent authorities";
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';

      }

    });
  }

}
