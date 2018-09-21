import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector, Inject, ReflectiveInjector } from '@angular/core';
import { GvProvider } from '../gv/gv';
import { RE, ME, ManagedError } from '../../models/io';
import { Events } from 'ionic-angular';

import { catchError, retry } from 'rxjs/operators';
import { SheetListItem, ViewEntryOut, ViewSheetOut, ReportOut } from '../../models/dtos';
import { TranslateService } from '@ngx-translate/core';
import { BackendProvider } from '../backend/backend';
/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  serverUrl: string = 'http://192.168.0.170:9000';
  backend: any;
  constructor(public http: HttpClient, private gv: GvProvider, public events: Events, private translate: TranslateService, private injector: Injector) {


  }


  httpHeadersProvider() {

    if (this.gv.sheetId && this.gv.token) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'token': this.gv.token,
          'SheetId': this.gv.sheetId.toString()
        })
      }
      return httpOptions;
    } else if (this.gv.token) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'token': this.gv.token,
        })
      }
      return httpOptions;
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
      return httpOptions;
    }
  }

  makeRequest(endpoint: string, paylaod?: any, events?: string[]): Promise<any> {
    return new Promise<RE>((resolve, reject) => {
      this.http.post(this.serverUrl + endpoint, paylaod, this.httpHeadersProvider())
        .subscribe((res: RE) => {
          let data: RE = res;//as RE;
          if (data.code == 200) {
            if (events) {
              events.forEach(element => {
                this.events.publish(element);
              });
            }
            resolve(data.data);
          }
          else {
            reject(new ManagedError(data.message, data.code, null));
          }
        }, err => {
          if (err.status == 0) {
            
            console.log('Connection Error')
            //this.events.publish('GO_OFFLINE');
             let mErr: ManagedError = new ManagedError('no internet', -1, err);
            // console.log('before')
            // throw (mErr);
            // console.log('after')
            reject(mErr);
          } else {
            let mErr: ManagedError = new ManagedError(null, null, err);
            reject(mErr);
          }


        })
    });
  }



  prepareSheetList(inputData: SheetListItem[]) {
    let index = 0;
    inputData.forEach(e => {
      e.class = 'it' + (index % 10) + ' it'; index++;
    });
    console.log(1);
    return inputData;
  }

  prepareNewEntries(inputData: ViewEntryOut[]) {
    let index = 0;
    inputData.forEach(e => {
      e.creditor = this.gv.members.find(m => m.id == e.creditorId);
      e.class = 'it' + (index % 10) + ' it'; index++;
      e.members.forEach(i => {
        i.index = i.amount > 0 ? 'positive' : 'negative';
        i.absoluteAmount = i.amount >= 0 ? i.amount : -1 * i.amount;
        i.member = this.gv.members.find(m => m.id == i.id);
      })
    });
    return inputData;
  }

  prepareNewSheet(inputData: ViewSheetOut): Promise<any> {
    return new Promise((res, rej) => {
      this.translate.get('SETTINGS.PERMISSION_TYPE').subscribe(vals => {
        for (let i = 0; i < inputData.permissionsList.length; i++) {
          inputData.permissionsList[i].permissionTranslated = vals[inputData.permissionsList[i].permission];
        }
        res(inputData);
      })
    });
  }

  parseReportData(report: ReportOut) {
    console.log('To prepare report1: ', report);
    this.gv.report = { creditors: [], debtors: [], creditorsBalance: [], debtorsBalance: [] }
    if (report.balances.length > 0) {
      let index = 0;
      report.members.forEach(m => {
        if (report.balances[index] > 0) {
          this.gv.report.creditors.push(m);
          this.gv.report.creditorsBalance.push(report.balances[index]);
        }
        else if (report.balances[index] < 0) {
          this.gv.report.debtors.push(m);
          this.gv.report.debtorsBalance.push(-1 * report.balances[index]);
        }
        index++;
      });
    };
  }
}
