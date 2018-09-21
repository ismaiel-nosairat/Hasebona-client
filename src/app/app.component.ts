import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Config, Nav, Platform, Events } from 'ionic-angular';

import { FirstRunPage } from '../pages';
import { Storage } from '@ionic/storage';

@Component({
  template: `
  <ion-nav #content [root]="rootPage"></ion-nav> `
  // template: `<ion-menu [content]="content">
  //   <ion-header>
  //     <ion-toolbar>
  //       <ion-title>Pages</ion-title>
  //     </ion-toolbar>
  //   </ion-header>

  //   <ion-content>
  //     <ion-list>
  //       <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
  //         {{p.title}}
  //       </button>
  //     </ion-list>
  //   </ion-content>

  // </ion-menu>
  // <ion-nav #content [root]="rootPage"></ion-nav>`
})
//declare var Keyboard;

export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [

  ]

  constructor(private translate: TranslateService, platform: Platform, private events: Events, private statusBar: StatusBar, private splashScreen: SplashScreen, private storage: Storage) {
    platform.ready().then(() => {
      
      this.registerEvents();

      this.splashScreen.hide();
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        console.log('lan changed', event.lang);

        if (event.lang == 'ar') {

          platform.setDir('rtl', true);
          platform.setDir('ltr', false);
        }
        else {
          platform.setDir('ltr', true);
          platform.setDir('rtl', false);
        }
        events.publish('lang:change')
      });
      this.translate.setDefaultLang('ar');
      this.translate.setDefaultLang('en');
    }).then(res => {
      this.initTranslate();
    });



  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    //this.translate.setDefaultLang('en');
    this.storage.get('lang').then(lang => {
      if (lang) {
        console.log(lang);
        this.translate.use(lang);
      } else {
        const browserLang = this.translate.getBrowserLang();
        if (browserLang) {
          this.translate.use(this.translate.getBrowserLang());
        } else {
          this.translate.use('en'); // Set your language here
        }
      }
    }).catch(e => {
      const browserLang = this.translate.getBrowserLang();
      if (browserLang) {
        this.translate.use(this.translate.getBrowserLang());

      } else {
        this.translate.use('en'); // Set your language here
      }
    })

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  registerEvents() {
    this.events.subscribe('GO_OFFLINE', () => {
      console.log('Must Go Offline')
      this.nav.push('OfflinePage')
    })

    this.events.subscribe('LOGOUT', () => {
      this.nav.push('WelcomePage')
    })

    this.events.subscribe('SHEET_LIST', () => {
      this.nav.push('SheetListPage')
    })


  }
}
