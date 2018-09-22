import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GvProvider } from '../../providers/gv/gv';
import { BackendProvider } from '../../providers/backend/backend';

import { Storage } from '@ionic/storage';
import { App } from 'ionic-angular/components/app/app';
import { NgZone } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the SheetListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sheet-list',
  templateUrl: 'sheet-list.html',
})
export class SheetListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private gv: GvProvider, private backend: BackendProvider, private storage: Storage, private app: App, private events: Events, private statusBar: StatusBar) {

    console.log('Hello SheetList');
    this.statusBar.backgroundColorByHexString('#1c8adb');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SheetListPage');
  }

  newSheet() {
    this.app.getRootNav().push('CreateSheetPage');
    //this.navCtrl.push('CreateSheetPage');
  }

  showSheet(sheetId) {
    this.storage.set(this.gv.GC.SHEET_ID, sheetId).then(res => {
      //this.app.getRootNav().popToRoot();
      this.app.getRootNav().setRoot('LoadingPage');
      if (this.navCtrl.parent) this.navCtrl.parent.select(0);
    })
    //    });
    // this.backend.Sheet_View(sheetId)
    // .then(res=>{
    //   this.navCtrl.setRoot('LoadingPage');
    // });
    //this.events.publish('reload');
    //console.log('sdfsd');
    //this.navCtrl.parent.select(0);
    //this.navCtrl.setRoot('TabsPage',{opentab:1});
  }
}
