import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SheetListPage } from './sheet-list';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SheetListPage,
  ],
  imports: [
    IonicPageModule.forChild(SheetListPage),
    TranslateModule.forChild()

  ],
})
export class SheetListPageModule {}
