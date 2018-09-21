import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Login } from '../../models/dtos';
import { BackendProvider } from '../../providers/backend/backend';
import { GvProvider } from '../../providers/gv/gv';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularfire2';
import firebase from 'firebase';
import { StatusBar } from '@ionic-native/status-bar';

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

  constructor(public navCtrl: NavController, private backend: BackendProvider, private gv: GvProvider, private toastCtrl: ToastController, private googlePlus: GooglePlus, private statusBar: StatusBar) {
    // this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#99938f');

  }

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
      displayName: 'Oqlaa 3Nezy',
      email: "user1@test.com",
      imageUrl: "https://ionicframework.com/dist/preview-app/www/assets/img/avatar-ts-woody.png"
    }
    let xx: Login = { "firstName": "Ismaiel", "lastName": "Nosairat", "displayName": "Ismaiel Nosairat", "userId": "103382208047130356357", "email": "ismaiel.nosairat@gmail.com", "imageUrl": "https://lh5.googleusercontent.com/-5CrkHiqd7Q4/AAAAAAAAAAI/AAAAAAAAAKM/q4hp2qSfxDk/s96-c/photo.jpg", "accessToken": "ya29.GlwWBq04zF5qWFW-CpLAJYNydDVrv0MBJF1kA_rhDUresyjVh6Q2ozxVknMzBYiORl09D5BCwfpqmgucMrecJogiIb8oNfJD23yiBAqgYNR3jDlqEkkifZM0l9-xPg" }
    this.loginWithGoogleAccount(xx);
  }

  loginWithGoogleAccount(user) {
    console.log(1)
    this.backend.Users_login(user).then(res => {
      console.log(1)
      if (this.gv.userSheets.length == 0) {
        console.log(1)
        this.navCtrl.setRoot('CreateSheetPage', {}, {
          animate: true,
          direction: 'forward'
        });
      } else {
        console.log(1)
        console.log(this.gv.userSheets.length);
        this.navCtrl.setRoot('SheetListPage', {}, {
          animate: true,
          direction: 'forward'
        });
      }
    })
  }

  googleLogin() {
    this.googlePlus.login({
      'webClientId': '949919048306-pmvdbek7t5egl34629omv18dlum4ps8m.apps.googleusercontent.com',
      'offline': true
    }).then(res => {
      console.log(res);
      firebase.auth()
        .signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then(succ => {
          let user: Login = {
            firstName: res.givenName,
            lastName: res.familyName,
            displayName: res.displayName,
            userId: res.userId,
            email: res.email,
            imageUrl: res.imageUrl,
            accessToken: res.accessToken,
            // idToken: res.idToken
          }
          this.loginWithGoogleAccount(user);

        }).catch(e => alert('err'));



    })
  }

}
