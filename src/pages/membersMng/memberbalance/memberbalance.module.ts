import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberbalancePage } from './memberbalance';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MemberbalancePage,
  ],
  imports: [
    IonicPageModule.forChild(MemberbalancePage),
    TranslateModule.forChild()
  ],
  exports: [
    MemberbalancePage
  ]
})
export class MemberbalancePageModule { }