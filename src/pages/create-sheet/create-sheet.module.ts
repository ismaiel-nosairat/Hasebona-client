import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateSheetPage } from './create-sheet';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreateSheetPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateSheetPage),
    TranslateModule.forChild()
  ],
})
export class CreateSheetPageModule {}
