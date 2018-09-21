import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, Toast, Events, } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { TranslateService } from '@ngx-translate/core';
import { GvProvider } from '../../../providers/gv/gv';
import { PermissionRequest, PermissionType } from '../../../models/dtos';


/**
 * Generated class for the AddPermissionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-permission',
  templateUrl: 'add-permission.html',
})
export class AddPermissionPage {
  loading: Loading;
  userEmail: any;
  permissionType: any;
  found: any;
  errorMsg: string;
  showSpinner: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private backend: BackendProvider, private translate: TranslateService, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private gv: GvProvider, private events: Events) {

  }

  findUser() {
    this.prepareEmail();
    this.found = null;
    if (this.userEmail) {
      console.log(this.userEmail);
      this.showSpinner = true;
      this.backend.Users_findUserByEmail(this.userEmail).then(result => {
        if (result) {
          switch (result.statusCode) {
            case -1:
              {
                this.translate.get('CREATE_MEMBER.ERRORS.USER_NOT_FOUND').subscribe(val => {
                  this.errorMsg = val;
                  this.found = null;
                  this.showSpinner = false;
                }); break;
              }
            case 0:
              {
                this.translate.get('CREATE_MEMBER.ERRORS.USER_IS_ALLREADY_MEMBER').subscribe(val => {
                  this.errorMsg = val;
                  this.found = null;
                  this.showSpinner = false;
                }); break;
              }
            case 1:
              {
                this.found = result.data;
                this.showSpinner = false;
                this.errorMsg = null;
                break;
              }
          }
        } else {
          this.showSpinner = false;
        }
      },
        err => {
          console.log(err);
          this.showSpinner = false;
        }
      )
    }
    else {
    }
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPermissionPage');
  }

  test() {
    console.log(this.userEmail);
  }

  submit() {
    this.prepareEmail();
    let req: PermissionRequest = {
      userEmail: this.userEmail,
      type: this.permissionType == 'view' ?
        PermissionType.VIEW : PermissionType.FULL
    };

    this.showLoading();
    this.backend.Users_addPermission(req).then(result => {
      this.navCtrl.pop();
    });
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

  prepareEmail() {
    this.userEmail = this.userEmail.trim();
    this.userEmail = this.userEmail.toLowerCase();
  }





}
