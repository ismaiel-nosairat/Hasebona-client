import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntrydetailsPage } from './entrydetails';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    EntrydetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(EntrydetailsPage),
    TranslateModule.forChild()
  ],
  exports: [
    EntrydetailsPage
  ]
})
export class EntrydetailsPageModule { }