import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateMemberPage } from './create-member';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CreateMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateMemberPage),
    TranslateModule.forChild()
  ],
})
export class CreateMemberPageModule {}
