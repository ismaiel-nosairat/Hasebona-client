import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher, Content, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Loading } from 'ionic-angular/components/loading/loading';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { BackendProvider } from '../../../providers/backend/backend';
import { GvProvider } from '../../../providers/gv/gv';

/**
 * Generated class for the EntriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entries',
  templateUrl: 'entries.html',
})
export class EntriesPage {
  @ViewChild(Content) content: Content;
  loading: Loading;
  entries: any[];
  pageNumber: number;
  endOfList: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private backend: BackendProvider,
    private alertCtrl: AlertController,
    private gv: GvProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.pageNumber = 0;
    this.endOfList = false;

  }

  refreshEntries(refresher) {
    this.backend.loadAll().then(r => {
      refresher.complete();
    })
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad EntriesPage');
    //this.entries = this.gdata.entries;
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter EntriesPage');
  }

  showEntry(item) {
    this.navCtrl.push('EntrydetailsPage', { entry: item }, { animate: true, direction: 'forward' });
  }

  newEntry() {
    this.navCtrl.push('NewentryPage');
  }


  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }








  showError(text) {
    console.log("To stop and show errro");
    this.loading.dismiss();
    console.log("To display alert");
    let msg;
    if (text.status === 404) {
      msg = "Not Found";
    }
    else
      msg = text;
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  scroll() {

    // let x = this.entries[this.entries.length - 1].id;
    // let yOffset = document.getElementById(x).offsetTop;
    this.content.scrollToBottom(300);//.scrollTo(0, yOffset, 4000)
  }
  // doInfinite(infiniteScroll) {
  //   console.log('to fetch data');
  //   console.log('pageNumber:' + this.pageNumber);
  //   if (this.endOfList) {
  //     infiniteScroll.complete();
  //   } else {
  //     console.log('Begin async operation');
  //     let page = {
  //       maxResult: this.gv.GC.MAX_PAGE_SIZE,
  //       pageNumber: ++this.pageNumber
  //     };
  //     this.backend.entries_list(page).subscribe(res => {
  //       let newEntries = JSON.parse(res.text());
  //       if (newEntries.length == 0) {
  //         this.endOfList = true;
  //         infiniteScroll.complete();
  //       } else {
  //         this.backend.prepareNewEntries(newEntries);
  //         Array.prototype.push.apply(this.entries, newEntries);
  //         infiniteScroll.complete();
  //       }

  //     })
  //   }
  // }

  presentToast(err) {
    let toast = this.toastCtrl.create({
      message: err,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();

  }

  openSettings(){
    this.navCtrl.push('SettingsPage');
  }

}
