import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewentryPage } from './newentry';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    NewentryPage,
  ],
  imports: [
    IonicPageModule.forChild(NewentryPage),
    TranslateModule.forChild()
  ],
  exports: [
    NewentryPage
  ]
})
export class NewentryPageModule {}
