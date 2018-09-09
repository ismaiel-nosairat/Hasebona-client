import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPermissionPage } from './add-permission';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AddPermissionPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPermissionPage),
    TranslateModule.forChild()
  ],
  exports: [
    AddPermissionPage
  ]
})
export class AddPermissionPageModule {}
