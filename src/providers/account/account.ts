import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

/*
  Generated class for the AccountProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccountProvider {
  linkAPI = "http://192.168.0.230:4201/Api/MobileApp";
  userInformation ={
  Id: "",
  FirstName: "Guest",
  Lastname: "user",
  PhoneNumber: "",
  ImageUrl:"assets/imgs/user.png",
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

  constructor(public http: HttpClient) {
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
              let response:any = res;
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
                ImageUrl:"",
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

  onCreateProfile(firstNam,LastName,gender,phoneNumber,birthday,lang, password){
    let body = {
      FirstName: firstNam,
      Lastname: LastName,
      PhoneNumber: phoneNumber,
      Gender: gender,
      Birthday: birthday,
      Language: lang,
      Password: password
    }
    console.log('GetProfile a7a');
    console.log(this.linkAPI + '/CreateProfile');
    return new Promise(resolve => {
      this.http.post(this.linkAPI + '/GetProfile', body)
        .subscribe(
          res => {
            if (res) {
              debugger;
              console.log(res);
              let response:any = res;
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
                ImageUrl:"",
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

}
