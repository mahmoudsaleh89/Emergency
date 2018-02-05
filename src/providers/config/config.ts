import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';


@Injectable()
export class ConfigProvider {
    language = 'ar';
    side='right';
    emergencyNumberList = [];
    numberObject={};
    notifications=[];
    ratingQuestions:any;
  constructor(public http: HttpClient,
              private storage : Storage) {
    console.log('Hello ConfigProvider Provider');
  }

  onGetEmergencyList(){
    debugger;
    return new Promise(resolve => {
      this.storage.get('emList')
        .then((res)=>{
          if(res){
            this.emergencyNumberList = res;
            this.storage.set('emList',this.emergencyNumberList);
            resolve(res);
          }else{
            this.emergencyNumberList = [];
            resolve(this.emergencyNumberList);
          }
        })
        .catch((err)=>{
          this.emergencyNumberList = [];
          resolve(this.emergencyNumberList);
        })

    });

  }

  onUpdateEmergencyList(){
    debugger;
    this.storage.set('emList',this.emergencyNumberList);
  }

  onDeleteEmergencyNumber(index){
    console.log('call index delete' , index);
    return new Promise(resolve => {
    this.storage.get('emList')
      .then((res)=>{
        if(res){

          this.emergencyNumberList = res;
          this.emergencyNumberList.splice(index, 1);
          this.storage.set('emList',this.emergencyNumberList);
          resolve(this.emergencyNumberList);
        }
      })
      .catch((err)=>{})
    });

  }


  onViewEmergencyNumber(index){
    debugger;
    console.log(index);
    return new Promise(resolve => {
      this.storage.get('emList')
        .then((res)=>{
          if(res){
            debugger;
            this.emergencyNumberList = res;
            this.emergencyNumberList.map((response)=>{
              this.numberObject= response

              //console.log('this.numberObject',this.numberObject);
            }).indexOf(index);
            resolve(this.numberObject);
          }
        })
        .catch((err)=>{})
    });
  }

  getRatingQuestion(){
    return new Promise((resolve)=>{
      this.ratingQuestions =[
        {
          qusID:1,
          qusText:"سرعة الاستجابة",
          value:0},
        {
          qusID:1,
          qusText:"مستوى تقيمك للخدمة",
          value:0
        },
        {
          qusID:1,
          qusText:"تعامل الافراد مع الحاله",
          value:0
        }
      ];
      resolve(this.ratingQuestions);
    })

  }


  getNotificationList(){
    return new Promise((resolve)=>{
      this.notifications =[
        {
          message:" تقييم الخدمه",
          img:"assets/imgs/rating.svg",
          describe:"من خلال هذا التقييم يتم تحسين الخدمات المقدمه",
          notifyType:"1"
        },
        {
          message:" تقييم الخدمه",
          img:"assets/imgs/questions.svg",
          describe:"من خلال هذا التقييم يتم تحسين الخدمات المقدمه",
          notifyType:"1"
        }
      ];
      resolve(this.notifications);
    })

  }


}
