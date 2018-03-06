import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';


@Injectable()
export class ConfigProvider {
  linkAPI = "http://192.168.0.230:4201/api/MobileApp/";
  language = 'ar';
  side = 'right';
  numberObject = {};
  notifications = [];
  fabsOptions = [];
  ratingQuestions: any;
  emergencyNumberList = [];

  constructor(public http: HttpClient,
              private storage: Storage) {
    console.log('Hello ConfigProvider Provider');
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

  onUpdateEmergencyList() {

    this.storage.set('emList', this.emergencyNumberList);
  }


  onViewEmergencyNumber(index) {

    console.log(index);
    return new Promise(resolve => {
      this.storage.get('emList')
        .then((res) => {
          if (res) {

            this.emergencyNumberList = res;
            this.emergencyNumberList.map((response) => {
              this.numberObject = response

              //console.log('this.numberObject',this.numberObject);
            }).indexOf(index);
            resolve(this.numberObject);
          }
        })
        .catch((err) => {
        })
    });
  }

  getRatingQuestion() {
    return new Promise(resolve => {
      this.http.post(this.linkAPI + '/GetQuestionRating', {})
        .subscribe(
          res => {

            let qustion: any = res;
            this.ratingQuestions = [];
            for (let i = 0; i < qustion.length; i++) {
              let temp = {
                qusID: qustion[i].Value,
                qusText: qustion[i].Text,
                value: 0
              }
              this.ratingQuestions.push(temp);

            }
            resolve(this.ratingQuestions);
            console.log(this.ratingQuestions);
            console.log(res);
          },
          err => {

            console.log('Error occured', err);
          }
        );
    });
  }

  onSubmitRating(userId, note, phoneNumber, qustions) {

    let body = {
      "MobileUserProfileId": userId,
      "Note": note,
      "PhoneNumber": phoneNumber,
      "EvalQuestions": qustions
    }
    console.log(JSON.stringify(body));
    return new Promise(resolve => {
      this.http.post(this.linkAPI + '/CreateEvaluation', body)
        .subscribe(
          res => {

            resolve(res);
          },
          err => {

            resolve('no_user_err');
            console.log('Error occured', err);
          }
        );
    });
  }

  getNotificationList() {
    return new Promise((resolve) => {
      this.notifications = [
        {
          message: " تقييم الخدمه",
          img: "assets/imgs/rating.svg",
          describe: "من خلال هذا التقييم يتم تحسين الخدمات المقدمه",
          notifyType: "1"
        },
        {
          message: " تقييم الخدمه",
          img: "assets/imgs/questions.svg",
          describe: "من خلال هذا التقييم يتم تحسين الخدمات المقدمه",
          notifyType: "1"
        }
      ];
      resolve(this.notifications);
    })

  }

  onGetFabsOption() {
    return new Promise((resolve) => {
      this.fabsOptions = [
        {
          DepartmentId: "1",
          Department: "fire",
          imgSrc: 'assets/imgs/fire.svg'
        },
        {
          DepartmentId: "2",
          Department: "police",
          imgSrc: 'assets/imgs/police.svg',

        },
        {
          DepartmentId: "3",
          Department: "police",
          imgSrc: 'assets/imgs/ambulance.svg',
        }
      ];
      resolve(this.fabsOptions);
    });

  }


}
