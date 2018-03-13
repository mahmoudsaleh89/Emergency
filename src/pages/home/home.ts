import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, LoadingController, NavController, Platform, ToastController} from 'ionic-angular';
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
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  LatLng, Geocoder
} from '@ionic-native/google-maps';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /*@ViewChild('mapHome') mapElement: ElementRef;*/
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
  lngMap: any;
  latMap: any;
  infoWindow = "";


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
              private loadingCtrl: LoadingController) {
    this.config.onGetFabsOption().then((data) => {
      this.fabslist = data;
    });

    this.setLangAndDirction();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.loadmap()

  }
  loadmap() {
    let loader = this.loadingCtrl.create({
      content: this.PleaseWait,
      duration: 3000
    });
    loader.present();

    this.geolocation.getCurrentPosition({timeout: 10000})
      .then((resp) => {
        /*Success Get Location*/
        console.log(resp, 'this is succ res');
        this.latMap = resp.coords.latitude;
        this.lngMap = resp.coords.longitude;
        this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
          .then((result: NativeGeocoderReverseResult) => {
              this.location_name = result.administrativeArea + '-' + result.locality + '-' + result.subLocality + '-' + result.thoroughfare + '-' + result.subThoroughfare;
              console.log(this.location_name);
            }
          ).catch((error: any) => {
          console.log(error)
        });
        this.map = new GoogleMap('map_canvas', {
          'controls': {
            'compass': true,
            'myLocationButton': false,
            'indoorPicker': true,
            'zoom': false

          },
          'gestures': {
            'scroll': true,
            'tilt': true,
            'rotate': true,
            'zoom': true
          },
          'camera': {
            target: {
              lat: this.latMap,
              lng: this.lngMap
            },
            zoom: 18,
            tilt: 30,
            'bearing': 50
          }

        });
        let loc = new LatLng(29.347568, 47.983262)
        let desc = this.location_name;
        if (this.lngMap && this.latMap) {
          loc = new LatLng(this.latMap, this.lngMap);
          desc = "you locations"
        } else {
          loc = new LatLng(29.347568, 47.983262);
          desc = "you dont have internet connection"
        }
        this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
          let markerOptions: MarkerOptions = {
            position: loc,
            title: desc,
            icon: 'gray',
          };
          this.map.addMarker(markerOptions).then(() => {
            loader.dismiss();
          });

        })

      })
      .catch((error) => {
        /*Error Get Location*/
        console.log('Error getting location', error);
        this.map = new GoogleMap('map_canvas', {
          'controls': {
            'compass': false,
            'myLocationButton': false,
            'indoorPicker': true,
            'zoom': false

          },
          'gestures': {
            'scroll': true,
            'tilt': true,
            'rotate': true,
            'zoom': true
          },
          'camera': {
            target: {
              lat: 29.347568,
              lng: 47.983262
            },
            zoom: 18,
            tilt: 30,
            'bearing': 50
          },
          'styles': [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#bdbdbd"
                }
              ]
            },
            {
              "featureType": "administrative.neighborhood",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#eeeeee"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e5e5e5"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "road",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dadada"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "transit",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e5e5e5"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#eeeeee"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#c9c9c9"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            }
          ],
        });
        let loc = new LatLng(29.347568, 47.983262);
        let desc = this.infoWindow;
        this.location_name = ""
        this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
          let markerOptions: MarkerOptions = {
            position: loc,
            title: desc
          };
          this.map.addMarker(markerOptions).then((mrker: Marker) => {
            mrker.showInfoWindow();
            loader.dismiss();
          });
        })
      });

  }


  onDirectCall() {

    this.storage.get('have_account')
      .then((res) => {

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

            if (em_phone) {
              this.callNumber.callNumber("112", true)
                .then(() => console.log('Launched dialer!'))
                .catch(() => console.log('Error launching dialer'));
              this.op.onCreateRequest(em_phone, "", "", this.lat, this.lng, true, this.location_name)
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

            if (em_phone) {

              this.op.onCreateRequest(em_phone, "", depId, this.lat, this.lng, false, this.location_name)
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

            if (em_phone) {
              this.callNumber.callNumber("112", true)
                .then(() => console.log('Launched dialer!'))
                .catch(() => console.log('Error launching dialer'));
              this.op.onCreateRequest(em_phone, "", depId, this.lat, this.lng, true, this.location_name)
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
        this.infoWindow = "يرجي تفعيل خدمة المواقع والتأكد من اتصالك بالشبكة";
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
        this.infoWindow = "Enable GPS location and  connect to internet ..";
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
        this.infoWindow = "Enable GPS location and  connect to internet ..";
        this.storage.set('lang', 'english');
        this.translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
        this.platform.setLang('en', true);
        this.config.side = 'left';

      }

    });
  }

}
