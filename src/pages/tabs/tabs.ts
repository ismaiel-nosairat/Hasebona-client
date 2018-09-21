import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { Tab1Root, Tab2Root, Tab3Root, Tab4Root } from '../';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;

  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";
  tab4Title = " ";

  seltabix: number = 0;
  constructor(public navCtrl: NavController, private navParam: NavParams, public translateService: TranslateService, private events: Events,private statusBar: StatusBar) {
    // this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#1c8adb');

    translateService.get(['TABS.HOME', 'TABS.MEMBERS', 'TABS.ENTRIES', 'TABS.SETTINGS', 'TABS.All_SHEETS']).subscribe(values => {
      this.tab1Title = values['TABS.HOME'];
      this.tab2Title = values['TABS.MEMBERS'];
      this.tab3Title = values['TABS.ENTRIES'];
      this.tab4Title = values['TABS.All_SHEETS'];
    });
    events.subscribe('lang:change', () => {
      translateService.get(['TABS.HOME', 'TABS.MEMBERS', 'TABS.ENTRIES', 'TABS.SETTINGS', 'TABS.All_SHEETS']).subscribe(values => {
        this.tab1Title = values['TABS.HOME'];
        this.tab2Title = values['TABS.MEMBERS'];
        this.tab3Title = values['TABS.ENTRIES'];
        this.tab4Title = values['TABS.All_SHEETS'];
      });
    })
  }
}
