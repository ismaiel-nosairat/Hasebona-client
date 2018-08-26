import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GvProvider } from '../../providers/gv/gv';
import { BackendProvider } from '../../providers/backend/backend';
import { Chart } from 'chart.js';

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

  isThereData: boolean = false;
  isDrawing: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private gv: GvProvider, private backend: BackendProvider, private events: Events) {
    if (gv.report.creditors.length > 0)
      this.isThereData = true;

    events.subscribe('sheet:report', () => {
      this.refreshReport();
    });
  }

  ionViewDidLoad() {
    this.initializeCharts();
  }

  initializeCharts() {
    if (this.isThereData && !this.isDrawing) {
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
    this.isDrawing=false;
  }


  refreshReport() {
    
    if (this.gv.report.creditors.length > 0 && !this.isDrawing) {
      this.isDrawing=true;
      let colorArrRGB = this.generateColorsRGBA(this.gv.report.creditors.length, 3);
      let colorArrHEX = this.generateColorsHEX(this.gv.report.creditors.length, 3);

      let colorArrRGB1 = this.generateColorsRGBA(this.gv.report.debtorsBalance.length, 0);
      let colorArrHEX1 = this.generateColorsHEX(this.gv.report.debtorsBalance.length, 0);

      this.creditorsChart.data.labels = this.gv.report.creditors;
      this.creditorsChart.data.datasets.forEach((dataset) => {
        dataset.data = this.gv.report.creditorsBalance;
        dataset.backgroundColor = colorArrRGB,
          dataset.hoverBackgroundColor = colorArrHEX;
        console.log(dataset.data);
      });
      this.debtorsChart.data.labels = (this.gv.report.debtors);
      console.log(this.debtorsChart.labels);
      this.debtorsChart.data.datasets.forEach((dataset) => {
        dataset.data = this.gv.report.debtorsBalance;
        dataset.backgroundColor = colorArrRGB1,
          dataset.hoverBackgroundColor = colorArrHEX1;
        console.log(dataset.data);
      });
      this.creditorsChart.update();
      this.debtorsChart.update();
      this.isThereData = true;
      this.isDrawing=false;
    }
    else {
      this.isThereData = false;
    }
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



}
