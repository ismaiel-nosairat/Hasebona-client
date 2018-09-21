import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, Events, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BackendProvider } from '../../../providers/backend/backend';
import { AlertController, LoadingController, Loading } from 'ionic-angular';
import { GvProvider } from '../../../providers/gv/gv';
import { AddEntryIn } from '../../../models/dtos';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-newentry',
  templateUrl: 'newentry.html',
})
export class NewentryPage {

  newEntryForm: FormGroup;

  entry: any;
  ckList: Debetor[];
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder
    , private backend: BackendProvider,
    private alertCtrl: AlertController,
    private gv: GvProvider,
    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    private events: Events,
    private toastCtrl: ToastController
  ) {

    this.ckList = [];
    this.initCkList();
    events.subscribe('member:list', () => {
      this.initCkList();
    })
    events.subscribe('member:add', () => {
      this.initCkList();
    })
   
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    this.newEntryForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      'amount': ['0', Validators.compose([Validators.required, Validators.pattern('^[0-9٠-٩]*\.?[0-9٠-٩]+$')])],
      'date': [localISOTime, Validators.required],
      'creditor': [null, Validators.required],
      //'debetors': [null, Validators.required]
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    console.log(this.ckList.length);

  }



  calculateDebetorsNumber() {
    let count: number = 0;
    this.ckList.forEach(e => { if (e.isChecked == true) count++; });
    return count;
  }

  isCheckedForDebetors() {
    let found = this.ckList.find(c => c.isChecked == true);
    if (found) return true;
    else return false;
  }
  initCkList() {
    console.log(this.gv.members);
    this.gv.members.forEach(e => {
      this.ckList.push(
        {
          id: e.id,
          name: e.name,
          isChecked: true,
          image: e.userInfo ? e.userInfo.imageUrl : 'assets/imgs/profile.png',
          email: e.userInfo ? e.userInfo.email : null,
          cssClass: "selected"
        }
      )
      console.log(this.ckList);
    });
  }

  toggleSelecting(item: Debetor) {
    if (item.isChecked) {
      item.isChecked = false;
      item.cssClass = null;
    } else {
      item.isChecked = true;
      item.cssClass = "selected";
    }
  }



  submitForm(x: any): void {

    if (!this.isValidEntry(x.creditor)) {
      this.translate.get('NEW_ENTRY.ERRORS.CREDITOR_IS_DEBETOR')
        .subscribe(vals => {
          let toast = this.toastCtrl.create({
            position: 'bottom',
            duration: 2000,
            message: vals
          });
          toast.present();
        });
    } else {

      this.showLoading();
      let members = [];
      this.ckList.forEach(c => {
        if (c.isChecked) {
          members.push(c.id);
        }
      });
      let input: AddEntryIn = {
        name: x.name,
        amount: x.amount,
        creditorId: x.creditor,
        creationDate: x.date,
        members: members
      }
      this.backend.Entries_add(input).then(res => {
        this.navCtrl.pop();
      });
    }
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




  isValidEntry(creditorId) {
    let cks = this.ckList.filter(c => c.isChecked == true);
    if (cks && cks.length == 1 && cks[0].id == creditorId) {
      return false;
    } else return true;

  }



  showError(text) {
    console.log("To stop and show errro");
    this.loading.dismiss();
    console.log("To display alert");

    let msg = text;
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}
export interface Debetor {
  id: number,
  image?: string,
  email?: string,
  name: string,
  isChecked: boolean,
  cssClass?: string
}