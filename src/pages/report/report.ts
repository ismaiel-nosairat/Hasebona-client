import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { GvProvider } from '../../providers/gv/gv';
import { BackendProvider } from '../../providers/backend/backend';
import { Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { ME, ManagedError } from '../../models/io';


/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('creditorsCanvas') creditorsCanvas;
  @ViewChild('debtorsCanvas') debtorsCanvas;

  barChart: any;
  creditorsChart: any;
  debtorsChart: any;

  isDrawing: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private gv: GvProvider, private backend: BackendProvider, private events: Events, private translate: TranslateService, private toastCtrl: ToastController) {
    console.log('Hello Report');
    events.subscribe('sheet:report', () => {
      this.refreshReport();
    });

  }

  isThereData() {
    //console.log('#####################')
    let b: boolean = this.gv.report.creditors && this.gv.report.creditors.length > 0
    //console.log(b);
    //console.log(this.gv.report.creditors);
    return b
  }

  ionViewDidLoad() {
    if (this.isThereData())
      this.initializeCharts();
  }

  initializeCharts() {
    if (!this.isDrawing) {
      this.isDrawing = true;
      let colorArrRGB = this.generateColorsRGBA(this.gv.report.creditorsBalance.length, 3);
      let colorArrHEX = this.generateColorsHEX(this.gv.report.creditorsBalance.length, 3);
      this.creditorsChart = new Chart(this.creditorsCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.gv.report.creditors,
          datasets: [{
            label: 'Oqlaa',
            data: this.gv.report.creditorsBalance,
            backgroundColor: colorArrRGB,
            hoverBackgroundColor: colorArrHEX

          }]
        },
        options: {
          legend: {
            display: true,
            position: 'left'
          }
        }
      });
      let colorArrRGB1 = this.generateColorsRGBA(this.gv.report.debtorsBalance.length, 0);
      let colorArrHEX1 = this.generateColorsHEX(this.gv.report.debtorsBalance.length, 0);
      this.debtorsChart = new Chart(this.debtorsCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.gv.report.debtors,
          datasets: [{
            label: 'Oqlaa',
            data: this.gv.report.debtorsBalance,
            backgroundColor: colorArrRGB1,
            hoverBackgroundColor: colorArrHEX1
          }]
        },
        options: {
          legend: {
            display: true,
            position: 'left'
          }
        }
      });
    }
    this.isDrawing = false;
  }


  refreshReport() {

    if (!this.isThereData()) {
      //no data
      console.log('no data')
      return;
    } else {
      //if (this.creditorsChart) {
      if (this.creditorsCanvas && this.creditorsChart) {
        // there is data and report is initialized
        if (true) {
          console.log('to refresh charts')
          this.refreshCharts();
          //this.initializeCharts();
        }
      } else {
        //console.log(1);
        //this.initializeCharts();
        setTimeout(() => {
          console.log('to initialize')
          this.initializeCharts();
        }, 500)
      }
    }
  }

  refreshCharts() {
    console.log(this.gv.report);
    this.isDrawing = true;
    let colorArrRGB = this.generateColorsRGBA(this.gv.report.creditors.length, 3);
    let colorArrHEX = this.generateColorsHEX(this.gv.report.creditors.length, 3);

    let colorArrRGB1 = this.generateColorsRGBA(this.gv.report.debtorsBalance.length, 0);
    let colorArrHEX1 = this.generateColorsHEX(this.gv.report.debtorsBalance.length, 0);

    this.creditorsChart.data.labels = this.gv.report.creditors;
    console.log(this.creditorsChart.data.labels);
    this.creditorsChart.data.datasets.forEach((dataset) => {
      dataset.data = this.gv.report.creditorsBalance;
      dataset.backgroundColor = colorArrRGB,
        dataset.hoverBackgroundColor = colorArrHEX;
      console.log(dataset.data);
    });
    this.debtorsChart.data.labels = (this.gv.report.debtors);
    console.log(this.debtorsChart.data.labels);
    this.debtorsChart.data.datasets.forEach((dataset) => {
      dataset.data = this.gv.report.debtorsBalance;
      dataset.backgroundColor = colorArrRGB1,
        dataset.hoverBackgroundColor = colorArrHEX1;
      console.log(dataset.data);
    });
    this.creditorsChart.update();
    this.debtorsChart.update();
    this.isDrawing = false;
  }
  generateColorsRGBA(num, shift): any[] {
    let returnedArr: any[] = [];
    for (let i = 0; i < num; i++) {
      returnedArr.push(this.gv.globalColorsRGBA[((i + shift) % this.gv.globalColorsRGBA.length)]);
    }
    return returnedArr;
  }

  generateColorsHEX(num, shift): any[] {
    let returnedArr: any[] = [];
    for (let i = 0; i < num; i++) {
      returnedArr.push(this.gv.globalColorsHEX[((i + shift) % this.gv.globalColorsHEX.length)]);
    }
    return returnedArr;
  }

  doRefresh(refresher) {
    this.backend.Sheet_loadReport().then(r => {
      this.refreshReport();
      refresher.complete();
    })
  }

  newMember() {
    this.navCtrl.push('CreateMemberPage', {}, { animate: true, direction: 'forward' });
  }

  newEntry() {
    if (this.gv.members.length < 2) {
      this.translate.get('HOME.MEMBER_FIRST')
        .subscribe(vals => {
          let toast = this.toastCtrl.create({
            position: 'bottom',
            duration: 2000,
            message: vals
          });
          toast.present();
        })
    } else {
      this.navCtrl.push('NewentryPage', {}, { animate: true, direction: 'forward' });
    }
  }

  
}
