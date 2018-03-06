import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';


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
            if (res != null) {

              console.log(res);
              let response: any = res;
              this.userInformation = response;
              resolve(this.userInformation);
            } else {

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

            resolve('no_user_err');
            console.log('Error occured', err);
          }
        );
    });
  }

  onCreateProfile(imageUrl, firstName, lastName, gender, phoneNumber, birthday, lang, password,deviceToken) {

    let body = {
      FirstName: firstName,
      Lastname: lastName,
      PhoneNumber: phoneNumber,
      Gender: gender,
      Birthday: birthday,
      Language: lang,
      Password: password,
      ImageUrl: imageUrl,
      DeviceToken : deviceToken
    };
    console.log(this.linkAPI + '/CreateProfile');
    return new Promise(resolve => {
      this.http.post(this.linkAPI + 'CreateProfile', body)
        .subscribe(
          res => {

            if (res != null) {
              let data: any = res;
              if (data.Id != "" || data.Id != null || data.Id != "undefined") {

                console.log(data);
                let response: any = data;
                this.userInformation = response;
                resolve(this.userInformation);
              } else {

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

            resolve('no_user_err');
            console.log('Error occured', err);
          }
        );
    });

  }

  onCreateProfileRelatives(id, firstName, lastName, phonenumber, relativeDescription, mobileUserProfileId, active) {

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
      this.http.post(this.linkAPI + '/SaveProfileRelatives', body)
        .subscribe(
          res => {

            if (res) {

              console.log(this.emergencyNumberList, 'this is update Em list');
              let response: any = res;
              let added = false;
              /*this is add/ edit relative from list */
              if (response.Active == true && (response.Id != null || response.Id != "")) {
                for (var i = 0; i < this.emergencyNumberList.length; i++) {
                  if (this.emergencyNumberList[i].Id == response.Id) {

                    added = true;
                    this.emergencyNumberList.splice(i, 1);
                    this.emergencyNumberList.push(response);
                    this.storage.set('emList', this.emergencyNumberList);
                    console.log(this.emergencyNumberList, 'this is update relative from list');
                    resolve(this.emergencyNumberList);
                  }
                }
                if (!added) {

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

                      resolve(this.emergencyNumberList);
                    }
                  })
              }
            } else {

              console.log(res);
              resolve('not_added');
            }

          },
          (err) => {
            resolve('add_Connection_error');
          }
        );
    });

  }

  onEditProfile(id, imageUrl, firstName, lastName, gender, phoneNumber, birthday, lang, password) {

    let body = {
      Id: id,
      FirstName: firstName,
      Lastname: lastName,
      PhoneNumber: phoneNumber,
      Gender: gender,
      Birthday: birthday,
      Language: lang,
      Password: password,
      ImageUrl: imageUrl
    };
    return new Promise(resolve => {
      this.http.post(this.linkAPI + 'EditProfile', body)
        .subscribe(
          res => {

            if (res != null) {
              let data: any = res;
              if (data.IsSuccessfull) {

                console.log(data);
                let response: any = data.Result;
                resolve(response);
              } else {

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

            resolve('no_user_err');
            console.log('Error occured', err);
          }
        );
    });




  }


  onGetEmergencyList() {

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
