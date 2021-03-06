import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Loading } from 'ionic-angular/components/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { GvProvider } from '../../../providers/gv/gv';
import { ViewEntryOut } from '../../../models/dtos';

/**
 * Generated class for the EntrydetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entrydetails',
  templateUrl: 'entrydetails.html',
})
export class EntrydetailsPage {
  entry: ViewEntryOut;
  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public backend: BackendProvider, private alertCtrl: AlertController, public gv: GvProvider, private translate: TranslateService,
    private loadingCtrl: LoadingController, private events: Events
  ) {
    this.entry = navParams.get("entry");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntrydetailsPage');
  }

  deleteEntry() {
    this.translate.get('ENTRY_DETAILS.DELETE_ENTRY').subscribe(
      val => {
        const deleteEntryAlert = this.alertCtrl.create({
          title: val.ALET_TITLE,
          message: val.ALET_TEXT,
          inputs: []
          ,
          buttons: [{
            text: val.ALERT_OK,
            handler: res => {
              this.showLoading();
              this.backend.Entries_delete(this.entry.id).then(
                (res) => {
                  this.navCtrl.pop();
                },
                (err) => {
                  this.showError(err);
                }
              );
            }
          },
          {
            text: val.ALERT_CANCLE,
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
          ]
        });
        deleteEntryAlert.present();
      }
      , err => { });
  }

  getMemberName(memId) {
    return this.gv.members.find(m => m.id == memId).name;
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



}
