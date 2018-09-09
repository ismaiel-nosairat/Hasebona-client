import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntriesPage } from './entries';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EntriesPage,
  ],
  imports: [
    IonicPageModule.forChild(EntriesPage),
    TranslateModule.forChild()
  ],
  exports: [
    EntriesPage
  ]
})
export class EntriesPageModule { }