import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddClaimPage } from './add-claim';

@NgModule({
  declarations: [
    AddClaimPage,
  ],
  imports: [
    IonicPageModule.forChild(AddClaimPage),
  ],
})
export class AddClaimPageModule {}
