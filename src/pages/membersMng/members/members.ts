import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { AlertController, LoadingController, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../../tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
import { GvProvider } from '../../../providers/gv/gv';
import { AddMemberIn } from '../../../models/dtos';
/**
 * Generated class for the MembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {
  loading: Loading;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public backend: BackendProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService,
    private gv: GvProvider,
    private translate: TranslateService
  ) {
    console.log('Hello Members');


  }

  showMemberDetails(member) {
    this.navCtrl.push('MemberbalancePage', { member: member });
  }




  addMember() {
    this.navCtrl.push('CreateMemberPage');
  }


  showLoading() {
    this.translate.get('COMMON.LOADING').subscribe(val => {
      this.loading = this.loadingCtrl.create({
        content: val,
        dismissOnPageChange: true
      });
      this.loading.present();
    })

  }

 
}