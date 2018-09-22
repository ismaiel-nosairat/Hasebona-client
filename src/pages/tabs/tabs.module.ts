import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { TabsPage } from './tabs';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage),
    TranslateModule.forChild(),
    SuperTabsModule
  ],
  exports: [
    TabsPage
  ]
})
export class TabsPageModule { }
