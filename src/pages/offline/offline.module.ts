import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfflinePage } from './offline';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OfflinePage,
  ],
  imports: [
    IonicPageModule.forChild(OfflinePage),
    TranslateModule.forChild()
  ],
})
export class OfflinePageModule {}
