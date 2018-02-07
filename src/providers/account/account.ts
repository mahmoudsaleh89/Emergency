import { HttpClient ,HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AccountProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccountProvider {
  userInformation={
    firstName:"",
    lastName:"",
    profileImage:"",
    phoneNumber:"",
    gender:"",
    birthday:"",
    language:""
  };
  constructor(public http: HttpClient) {
    console.log('Hello AccountProvider Provider');
  }

  onAddUserAccount(){
    let body={
      Username: "apple.qa",
      Password: "123456"
    };
    return new Promise(resolve => {
      this.http.post('http://151.253.35.253:9015/MasaarWebAPI/api/Subscribers/loginSubscriber',body)
        .subscribe(
          res => {
            debugger;
            console.log(res);
            resolve(res);
          },
          err => {
            debugger
            console.log('Error occured',err);
          }
        );
    });
  }


  onUpdateAccount(){}

}
