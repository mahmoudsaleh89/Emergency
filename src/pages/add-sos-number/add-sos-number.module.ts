import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSosNumberPage } from './add-sos-number';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    AddSosNumberPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSosNumberPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class AddSosNumberPageModule {}
