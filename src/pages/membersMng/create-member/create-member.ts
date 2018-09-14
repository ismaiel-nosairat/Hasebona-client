import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { AddMemberIn, FoundUser, PermissionItem } from '../../../models/dtos';
import { BackendProvider } from '../../../providers/backend/backend';
import { TranslateService } from '@ngx-translate/core';
import { GvProvider } from '../../../providers/gv/gv';
import { Keyboard } from '@ionic-native/keyboard';

/**
 * Generated class for the CreateMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-member',
  templateUrl: 'create-member.html',
})
 declare const Keyboard: any;

export class CreateMemberPage {

  addMemberDto: AddMemberIn = {
    name: ""
  };
  userEmail: string;
  found: PermissionItem;
  errorMsg: string;
  showSpinner: boolean;
  nameError: string;
  segmentValue: string = "member";
  isSelected = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private backend: BackendProvider, private translate: TranslateService, private loadingCtrl: LoadingController, private gv: GvProvider, private keyboard: Keyboard) {
    keyboard.disableScroll(true);
    Keyboard.hideFormAccessoryBar(false);
  }

  ionViewDidLoad() {
  }


  findUser() {
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
                  this.isSelected = false;
                  this.showSpinner = false;
                }); break;
              }
            case 0:
              {
                this.translate.get('CREATE_MEMBER.ERRORS.USER_IS_ALLREADY_MEMBER').subscribe(val => {
                  this.errorMsg = val;
                  this.found = null;
                  this.isSelected = false;
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

  validateName(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.addMemberDto.name == "") {
        this.translate.get('CREATE_MEMBER.ERRORS.NAME_IS_MANDATORY').subscribe(val => {
          this.nameError = val;
          resolve(false);
        })
      } else if (this.addMemberDto.name.length > 32 || this.addMemberDto.name.length < 2) {
        this.translate.get('CREATE_MEMBER.ERRORS.MEMBER_NAME_BADINPUT').subscribe(val => {
          this.nameError = val;
          resolve(false);
        })
      } else {
        let found = this.gv.members.find(m => m.name == this.addMemberDto.name);
        if (found) {
          this.translate.get('CREATE_MEMBER.ERRORS.DUBLICATED_MEMBER').subscribe(val => {
            this.nameError = val;
            resolve(false);
          })
        } else {
          resolve(true);
        }
      }

    });


  }
  saveMember() {
    this.validateName().then(result => {
      console.log(result);
      if (result) {
        this.nameError = null;
        this.showLoading();
        this.backend.Members_Add(this.addMemberDto).then(result => {
          this.navCtrl.pop();
        });
      }
    });
  }

  saveUserMember() {
    this.addMemberDto.userId = this.found.id;
    this.addMemberDto.name = this.found.firstName;
    this.showLoading();
    this.backend.Members_Add(this.addMemberDto).then(result => {
      this.navCtrl.pop();
    });
  }

  loading: Loading;
  showLoading() {
    this.translate.get('COMMON.LOADING').subscribe(val => {
      this.loading = this.loadingCtrl.create({
        content: val,
        dismissOnPageChange: true
      });
      this.loading.present();
    })

  }
}
