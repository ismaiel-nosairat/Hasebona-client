import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { GvProvider } from '../../providers/gv/gv';
import { BackendProvider } from '../../providers/backend/backend';
import { Storage } from '@ionic/storage';
import { MainPage } from '..';
import { ReportOut } from '../../models/dtos';

/**
 * Generated class for the LoadingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private gv: GvProvider, private backend: BackendProvider, private storage: Storage) {

    
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.loadDataFromStorage();  
    }, 5000);
    
  }

  loadDataFromStorage(): any {
    this.storage.get(this.gv.GC.TOKEN).then(tokenRes => {
      if (tokenRes) {
        this.gv.token = JSON.parse(tokenRes);
        this.storage.get(this.gv.GC.SHEET_ID).then(sheetIdRes => {
          if (sheetIdRes) {
            this.gv.sheetId = JSON.parse(sheetIdRes);
            //load all then -> 'report'
            this.backend.loadAll().then(r => {
              this.navCtrl.setRoot(MainPage, {}, {
                animate: true,
                direction: 'forward'
              });
            })
          }
          else {
            // load sheets of the user then -> 'sheetList'
            this.backend.Sheet_loadList().then(r=>{
              this.navCtrl.setRoot('SheetListPage', {}, {
                animate: true,
                direction: 'forward'
              });
            })
          }
        })
      }
      // no token -> 'welcome'
      this.navCtrl.setRoot('WelcomePage', {}, {
        animate: true,
        direction: 'forward'
      });
    })
  }
}
