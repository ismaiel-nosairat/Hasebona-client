import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Login } from '../../models/dtos';
import { BackendProvider } from '../../providers/backend/backend';
import { GvProvider } from '../../providers/gv/gv';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController, private backend: BackendProvider, private gv: GvProvider, private toastCtrl: ToastController) { }

  signin() {
    let toast = this.toastCtrl.create({
      message: 'Not Implemented Yet',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  signup() {
    let toast = this.toastCtrl.create({
      message: 'Not Implemented Yet',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  enter() {
    let user: Login = {
      firstName: "oqlaa",
      lastName: "3neze",
      googleId: "g1",
      email: "user1@test.com",
      imageUrl: "https://ionicframework.com/dist/preview-app/www/assets/img/avatar-ts-woody.png"
    }
    this.loginWithGoogleAccount(user);
  }

  loginWithGoogleAccount(user) {
    this.backend.Users_login(user).then(res => {
      if (this.gv.userSheets.length = 0) {
        this.navCtrl.setRoot('CreatePage', {}, {
          animate: true,
          direction: 'forward'
        });
      } else {
        this.navCtrl.setRoot('SheetList', {}, {
          animate: true,
          direction: 'forward'
        });
      }
    })
  }

}
