import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, App, Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { BackendProvider } from '../../../providers/backend/backend';
import { Storage } from '@ionic/storage';
import { WelcomePage } from '../../welcome/welcome';
import { Loading } from 'ionic-angular/components/loading/loading';

import { TranslateService } from '@ngx-translate/core';
import { GvProvider } from '../../../providers/gv/gv';
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  loading: Loading;
  public appLang: string;
  testt: string;
  constructor(private backend: BackendProvider, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private storage: Storage, private platform: Platform, private toastCtrl: ToastController, private gv: GvProvider, private translate: TranslateService, private app: App, private events: Events) {
    console.log(this.translate.currentLang)
    console.log(this.translate.defaultLang)
    this.appLang = this.translate.currentLang == 'en' ? "English" : "العربية"
    console.log('Hello Settings');

    
    events.subscribe('lang:change', () => {
      this.translate.get('SETTINGS.PERMISSION_TYPE').subscribe(vals => {
        for (let i = 0; i < this.gv.sheet.permissionsList.length; i++) {
          this.gv.sheet.permissionsList[i].permissionTranslated = vals[this.gv.sheet.permissionsList[i].permission];
        }
      })
    })


  }

  onSelectChange(selectedValue: any) {
    if (selectedValue == 'English') {

      this.translate.use('en').subscribe(res => {
        console.log('eng')
        this.storage.set('lang', this.translate.currentLang);
      });
    }
    else {
      console.log('arb')
      this.translate.use('ar').subscribe(res => {
        console.log('arb')
        this.storage.set('lang', this.translate.currentLang);;
      })
    }


  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }


  logout() {
    this.showLoading();
    this.backend.logout().then(res => {
      this.app.getRootNav().setRoot('WelcomePage');
      //this.navCtrl.push('WelcomePage');
    })
  }

  addPermission() {
    this.navCtrl.push('AddPermissionPage');
  }

  deletePermission(permission) {

    this.translate.get([
      "SETTINGS.ALERT.ALET_TITLE",
      "SETTINGS.ALERT.DELETE_PERMISSION_CONFERMATION",
      "SETTINGS.ALERT.ALERT_OK",
      "SETTINGS.ALERT.ALERT_CANCLE"
    ]).subscribe(vals => {
      let confirm = this.alertCtrl.create({
        title: vals["SETTINGS.ALERT.ALET_TITLE"],
        message: vals["SETTINGS.ALERT.DELETE_PERMISSION_CONFERMATION"],
        buttons: [
          {
            text: vals["SETTINGS.ALERT.ALERT_CANCLE"],
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: vals["SETTINGS.ALERT.ALERT_OK"],
            handler: () => {
              this.showLoading();
              this.backend.Users_removePermission(permission).then((res) => {
                this.loading.dismiss();
              },
                err => {
                  console.log(err);
                  this.loading.dismiss();
                  this.translate.get('SETTINGS.ALERT.GENERAL_ERROR').subscribe(val => {
                    let toast = this.toastCtrl.create({
                      message: val,
                      duration: 3000,
                      position: 'bottom'
                    });
                    toast.onDidDismiss(() => {
                      console.log('Dismissed toast');
                    });
                    toast.present();
                  });
                })
              console.log('Agree clicked');
            }
          }
        ]
      });
      confirm.present();
    },
      err => {
        console.log(err);
      })

  }

  // clearSheet() {
  //   this.showLoading();
  //   this.backend.clearSheet().subscribe(res => {
  //     this.gdata.clearContent(false);
  //     this.loading.dismiss();
  //   },
  //     err => {
  //       this.showError(err);
  //     }
  //   );
  // }

  // deleteSheet() {
  //   this.showLoading();
  //   this.backend.deleteSheet().subscribe(res => {
  //     this.storage.clear().then(res => {
  //       this.gdata.clearContent(true);
  //       this.gdata.sheet = null;
  //       //--->  To Hide the Tabs
  //       let elements = document.querySelectorAll(".tabbar");
  //       if (elements != null) {
  //         Object.keys(elements).map((key) => {
  //           elements[key].style.display = 'none';
  //         });
  //       }
  //       //........
  //       this.navCtrl.setRoot(WelcomePage);
  //     }).catch(err => {
  //       this.showError(err);
  //     });

  //   },
  //     err => {
  //       this.showError(err);
  //     }
  //   );
  // }

  showLoading() {
    this.translate.get("SETTINGS.ALERT.WAIT").subscribe(val => {
      this.loading = this.loadingCtrl.create({
        content: val,
        dismissOnPageChange: true
      });
      this.loading.present();
    });

  }

  showError(text) {
    console.log("To stop and show errro");
    this.loading.dismiss();
    console.log("To display alert");
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  showConfirm(x) {
    let msgs = [
      'Are you sure, this will clear all  entries of the Sheet?',
      'Are you sure, this will delete all you data?'
    ];
    let titles = [
      'Delete Sheet?',
      'Clear Entries'
    ];
    let confirm = this.alertCtrl.create({
      title: titles[x],
      message: msgs[x],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {

            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            switch (x) {
              case 0: {
                //this.clearSheet();
                break;
              }
              case 1: {
                //this.deleteSheet();
                break;
              }
              default: {
                console.log("Invalid choose");
              }
            }
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  test(x) {
    console.log(x);

  }

  // changePassword() {
  //   this.navCtrl.push(ChangepasswordPage);
  // }

}
