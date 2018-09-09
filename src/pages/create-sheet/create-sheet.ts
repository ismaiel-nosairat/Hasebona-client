import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackendProvider } from '../../providers/backend/backend';
import { TranslateService } from '@ngx-translate/core';
import { GvProvider } from '../../providers/gv/gv';
import { ME } from '../../models/io';
import { AddSheetIn } from '../../models/dtos';
import { MainPage } from '..';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the CreateSheetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-sheet',
  templateUrl: 'create-sheet.html',
})
export class CreateSheetPage {
  loading: Loading;

  sheet: any;

  createForm: FormGroup;

  constructor(private backend: BackendProvider, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private storage: Storage, private gv: GvProvider, private fb: FormBuilder, private translate: TranslateService, private toastCtrl: ToastController) {
    console.log('Hello CreateSheet');
    this.createForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      'notes': ['', Validators.compose([Validators.required, Validators.maxLength(500)])]
    });
  }


  ionViewDidLoad() {

  }
  showLoading() {
    this.translate.get('COMMOM.LOADING').subscribe(val => {
      this.loading = this.loadingCtrl.create({
        content: val,
        dismissOnPageChange: true
      });
      this.loading.present();
    });
  }
  showError(error: ME) {
    this.loading.dismiss();
    let toast = this.toastCtrl.create({
      message: error.message,
      duration: 3000,
      position: 'bottom'
    });
  }
  submit(value) {
    this.showLoading();
    let created: AddSheetIn = {
      name: value.name,
      notes: value.notes
    };
    this.backend.Sheets_new(created).then(res => {
      this.navCtrl.setRoot(MainPage);
      this.loading.dismiss();
    }).catch(e => {
      let err = e as ME;
      this.showError(err);
    });
  }
}
