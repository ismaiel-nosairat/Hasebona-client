import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, VirtualScroll, ToastController, Events } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { Loading } from 'ionic-angular/components/loading/loading';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ListMemberItem, ViewMemberOut,ViewEntryOut } from '../../../models/dtos';
import { GvProvider } from '../../../providers/gv/gv';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the MemberbalancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-memberbalance',
  templateUrl: 'memberbalance.html',
})

export class MemberbalancePage {

  member: ListMemberItem;
  loading: Loading;
  report: ViewMemberOut;
  summary: any;
  loaded: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private backend: BackendProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private gv: GvProvider, private translate: TranslateService, private toastCtrl: ToastController,private events:Events) {
    this.loaded = false;
    this.member = navParams.get("member");
    
    this.backend.Members_View(this.member.id).then(
      val => {
        console.log('in');
        this.report = val;
        this.prepareSummary();
        if (this.report.balance < 0) {
          this.report.balanceCss = "negative";
        }
        else {
          this.report.balanceCss = "positive";
        }
        this.report.entries.forEach(e => {
          if (e.amount > 0) {
            e.css = 'positive';
            e.icon = 'md-arrow-dropup';
          }
          else {
            e.css = 'negative';
            e.icon = 'md-arrow-dropdown';
          }
        });
        this.loaded = true;
      },
      err => {
        this.showError(err);
      }
    );


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberbalancePage');
  }

  prepareSummary() {
    let totalPurchases = 0;
    let totalPurchasesNum = 0;
    let totalSales = 0;
    let totalSalesNum = 0;
    this.report.entries.forEach(e => {
      if (e.amount > 0) {
        totalPurchases += e.amount;
        totalPurchasesNum++;
      } else {
        totalSales += e.amount;
        totalSalesNum++;
      }
    })
    this.summary = {
      totalPurchases: totalPurchases,
      totalPurchasesNum: totalPurchasesNum,
      totalSales: totalSales,
      totalSalesNum: totalSalesNum
    }
  }

  entryDetails(item) {
    let entryId = item.id ;
    let entry: ViewEntryOut;
    entry=this.gv.entires.find(e=>e.id==entryId);
    this.navCtrl.push('EntrydetailsPage', { entry: entry }, { animate: true, direction: 'forward' });
  }

  deleteMember() {
    if (this.report.balance == 0) {
      this.translate.get([
        'MEMBER_BALANCE.DELETE_MEMBER.BTN_TITLE',
        'MEMBER_BALANCE.DELETE_MEMBER.ALERT_TITLE',
        'MEMBER_BALANCE.DELETE_MEMBER.ALERT_TEXT',
        'MEMBER_BALANCE.DELETE_MEMBER.ALERT_OK',
        'MEMBER_BALANCE.DELETE_MEMBER.ALERT_CANCEL'
      ]).subscribe(vals => {
        console.log(vals);
        let alert = this.alertCtrl.create({
          title: vals['MEMBER_BALANCE.DELETE_MEMBER.BTN_TITLE'],
          message: vals['MEMBER_BALANCE.DELETE_MEMBER.ALERT_TEXT'],
          buttons: [
            {
              text: vals['MEMBER_BALANCE.DELETE_MEMBER.ALERT_CANCEL']
            },
            {
              text: vals['MEMBER_BALANCE.DELETE_MEMBER.ALERT_OK'],
              handler: () => {
                this.showLoading();
                this.backend.Members_Delete(this.member.id).then(res => {
                  this.navCtrl.pop();
                })
              }
            },
          ]
        });
        alert.present();
      })

    } else {
      this.translate.get('MEMBER_BALANCE.DELETE_MEMBER.CANNOT_NON_ZERO_BALANCE_MEMBER')
        .subscribe(vals => {
          let toast = this.toastCtrl.create({
            position: 'bottom',
            duration: 3000,
            message: vals
          });
          toast.present();
        })
    }
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
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }


}
