import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the OprationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OprationsProvider {
  linkAPI = "http://192.168.0.230:4201/api/MobileApp/";
  constructor(public http: HttpClient) {
    console.log('Hello OprationsProvider Provider');
  }


  onCreateRequest(phone , userId , departmentID,lat,lng,type,address){
    let body = {
      "PhoneNumber":phone ,
      "MobileUserProfileId": userId,
      "DepartmentId": departmentID,
      "Latitude": lat,
      "Longitude": lng,
      "RequestType": type,
      "Address": address
    };
    return new Promise(resolve => {
      this.http.post(this.linkAPI + 'CreateRequest', body)
        .subscribe(
          res => {
            debugger;
            let response: any = res;
            if(response.IsSuccessfull){
              resolve(response.Result);
            }else {
              resolve('not_send');
            }

          },
          err => {
            debugger;
            resolve('server_err');
            console.log('Error occured', err);
          }
        );
    });
  }

}
