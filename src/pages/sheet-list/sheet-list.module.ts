import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SheetListPage } from './sheet-list';

@NgModule({
  declarations: [
    SheetListPage,
  ],
  imports: [
    IonicPageModule.forChild(SheetListPage),
  ],
})
export class SheetListPageModule {}
