import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { Items } from '../mocks/providers/items';
import { Api } from '../providers';
import { MyApp } from './app.component';
import { GvProvider } from '../providers/gv/gv';
import { BackendProvider } from '../providers/backend/backend';
import { GlobalErrorHandler } from './global-error-handler';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularfire2';
import firebase from 'firebase';
import { SuperTabsModule } from 'ionic2-super-tabs';
// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */

}
export const firebaseConfig = {
  apiKey: "AIzaSyBZpLybtdA7TlCIOebegnn-Ft-LSUwV3lM",
  authDomain: "hasebona-1.firebaseapp.com",
  databaseURL: "https://hasebona-1.firebaseio.com",
  projectId: "hasebona-1",
  storageBucket: "hasebona-1.appspot.com",
  messagingSenderId: "949919048306"
}
firebase.initializeApp(firebaseConfig);
@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SuperTabsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      scrollPadding: false,
      scrollAssist: false,
      autoFocusAssist: false,
    }
    ),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Api,
    Items,
    Camera,
    SplashScreen,
    StatusBar,
    Keyboard,
    // Keep this to enable Ionic's runtime error handling during development
    // { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    GvProvider,
    BackendProvider,
    GooglePlus
  ]
})
export class AppModule { }
