import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the OfflinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offline',
  templateUrl: 'offline.html',
})
export class OfflinePage {

  refresh: string;
  refreshing: string;
  isRefreshing: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private backend: BackendProvider, private translate: TranslateService, private app: App) {
    this.isRefreshing = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfflinePage');
  }

  refreshCall() {
    this.isRefreshing = true;
    this.backend.testConnection().then(res => {
      if (res == 'ONLINE') {
        this.app.getRootNav().setRoot('LoadingPage');
      }
      else {
      }
      this.isRefreshing = false;
    })
  }

}
