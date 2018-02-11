import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

/*
  Generated class for the AccountProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccountProvider {
  linkAPI = "http://192.168.0.230:4201/api/MobileApp/";
  userInformation = {
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
  emergencyNumberList = [];

  constructor(public http: HttpClient, private storage: Storage) {
    console.log('Hello AccountProvider Provider');
  }

  onGetProfile(phoneNumber, password) {
    let body = {
      "PhoneNumber": phoneNumber,
      "Password": password
    };
    console.log('GetProfile a7a');
    console.log(this.linkAPI + '/GetProfile');
    return new Promise(resolve => {
      this.http.post(this.linkAPI + '/GetProfile', body)
        .subscribe(
          res => {
            if (res) {
              debugger;
              console.log(res);
              let response: any = res;
              this.userInformation = response;
              resolve(this.userInformation);
            } else {
              debugger;
              console.log(res);
              this.userInformation = {
                Id: "",
                FirstName: "",
                Lastname: "",
                PhoneNumber: "",
                ImageUrl: "",
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
              resolve('no_user');
            }

          },
          err => {
            debugger;
            resolve('no_user_err');
            console.log('Error occured', err);
          }
        );
    });
  }

  onCreateProfile(imageUrl, firstNam, LastName, gender, phoneNumber, birthday, lang, password) {
    debugger;
    let body = {
      FirstName: firstNam,
      Lastname: LastName,
      PhoneNumber: phoneNumber,
      Gender: gender,
      Birthday: birthday,
      Language: lang,
      Password: password,
      ImageUrl: imageUrl
    };
    console.log('GetProfile a7a', this.linkAPI);
    console.log(this.linkAPI + '/CreateProfile');
    return new Promise(resolve => {
      this.http.post(this.linkAPI + 'CreateProfile', body)
        .subscribe(
          res => {
            debugger;
            if (res != null) {
              let data: any = res;
              if (data.Id != "" || data.Id != null || data.Id != "undefined") {
                debugger;
                console.log(data);
                let response: any = data;
                this.userInformation = response;
                resolve(this.userInformation);
              } else {
                debugger;
                console.log(data);
                this.userInformation = {
                  Id: "",
                  FirstName: "",
                  Lastname: "",
                  PhoneNumber: "",
                  ImageUrl: "",
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
                resolve('no_user');
              }
            } else {
              resolve('no_user');
            }
          },
          err => {
            debugger;
            resolve('no_user_err');
            console.log('Error occured', err);
          }
        );
    });

  }

  onCreateProfileRelatives(id, firstName, lastName, phonenumber, relativeDescription, mobileUserProfileId, active) {
    debugger;
    let body = {
      Id: id,
      FirstName: firstName,
      LastName: lastName,
      PhoneNumber: phonenumber,
      RelativeDescription: relativeDescription,
      MobileUserProfileId: mobileUserProfileId,
      Active: active
    };

    return new Promise(resolve => {
      this.http.post(this.linkAPI + '/CreateProfileRelatives', body)
        .subscribe(
          res => {
            debugger;
            if (res) {
              debugger;
              console.log(this.emergencyNumberList, 'this is update Em list');
              let response: any = res;
              let added = false;
              /*this is add/ edit relative from list */
              if (response.Active == true && (response.Id != null || response.Id != "")) {
                for (var i = 0; i < this.emergencyNumberList.length; i++) {
                  if (this.emergencyNumberList[i].Id == response.Id) {
                    debugger;
                    added = true;
                    this.emergencyNumberList.splice(i, 1);
                    this.emergencyNumberList.push(response);
                    this.storage.set('emList', this.emergencyNumberList);
                    console.log(this.emergencyNumberList, 'this is update relative from list');
                    resolve(this.emergencyNumberList);
                  }
                }
                if (!added) {
                  debugger;
                  this.emergencyNumberList.push(response);
                  this.storage.set('emList', this.emergencyNumberList);
                  console.log(this.emergencyNumberList, 'this is new relative from list');
                  resolve(this.emergencyNumberList);
                }
                /*this is delete relative from list */
              }
              else if (response.Active == false) {
                this.storage.get('emList')
                  .then((res) => {
                    debugger;
                    if (res) {
                      this.emergencyNumberList = res;
                      for (var i = 0; i < this.emergencyNumberList.length; i++) {
                        if (this.emergencyNumberList[i].Id == response.Id) {
                          this.emergencyNumberList.splice(i, 1);
                        }
                      }
                      this.storage.set('emList', this.emergencyNumberList);
                      console.log(this.emergencyNumberList, 'this is delete relative from list');
                      console.log('ana Hona');
                      debugger;
                      resolve(this.emergencyNumberList);
                    }
                  })
              }
            } else {
              debugger;
              console.log(res);
              resolve('not_added');
            }

          }
        );
    });

  }

  onGetEmergencyList() {
    debugger;
    return new Promise(resolve => {
      this.storage.get('emList')
        .then((res) => {
          if (res) {
            this.emergencyNumberList = res;
            this.storage.set('emList', this.emergencyNumberList);
            resolve(res);
          } else {
            this.emergencyNumberList = [];
            resolve(this.emergencyNumberList);
          }
        })
        .catch((err) => {
          this.emergencyNumberList = [];
          resolve(this.emergencyNumberList);
        })

    });

  }


}
