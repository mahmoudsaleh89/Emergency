import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';


@Injectable()
export class ConfigProvider {
    language = 'ar';
    side='right';
    emergencyNumberList = [];
    numberObject={};
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

}
