import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { ReportOut, Login, LoginResponse, SheetListItem, AllDto } from '../../models/dtos';
import { GvProvider } from '../gv/gv';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
/*
  Generated class for the BackendProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BackendProvider {

  parseReportData: (ReportOut) => void;

  constructor(public http: HttpClient, private api: Api, private gv: GvProvider, private storage: Storage,private events:Events) {
    console.log('Hello BackendProvider Provider');
    this.parseReportData = function (report: ReportOut) {
      if (report.balances.length > 0) {
        let index = 0;
        this.gv.report = { creditors: [], debtors: [], creditorsBalance: [], debtorsBalance: [] }
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


  Sheet_loadReport(withEvent: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Sheets_report, null, null)
        .then(result => {
          let report: ReportOut = result as ReportOut;
          this.parseReportData(report);
          this.events.publish('sheet:report');
          resolve();
        })
    });
  }



  /**
   * Login
   * then save the token
   * then load all user sheets 
   * @param loginDto 
   */
  Users_login(loginDto: Login): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Users_Login, loginDto).then(
        result => {
          let output: LoginResponse = result;
          if (!output || !output.token) {
            //todo
          }
          this.gv.token = output.token;
          this.storage.set(this.gv.GC.TOKEN, output.token).then(storageRes => {
            this.api.makeRequest(this.endpoints.Sheets_list).then(listRes => {
              let listOutput: SheetListItem[] = listRes as SheetListItem[];
              this.gv.userSheets = listOutput;
              resolve();
            })
          });
        }
      );
    })
  }

  loadAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.All).then(
        result => {
          let all: AllDto = result as AllDto;
          this.gv.userSheets = all.userSheets;
          this.gv.sheet = all.sheet;
          this.gv.members = all.members;
          this.gv.entires = all.entries;
          this.parseReportData(all.report);
          resolve();
        })
    })
  }


  Sheet_loadList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Sheets_list).then(
        result => {
          let userSheets: SheetListItem[] = result as SheetListItem[];
          this.gv.userSheets = userSheets;
          resolve();
        })
    })
  }

  

  endpoints = {
    Users_Login: '/user/login',
    Users_addPermission: '/user/addPermission',
    Users_removePermission: '/user/removePermission',
    Users_findByEmail: '/user/find',
    Sheets_list: '/sheet/list',
    Sheets_view: '/sheet/view',
    Sheets_create: '/sheet/create',
    Sheets_report: '/sheet/report',

    Members_list: '/member/list',
    Members_add: '/membe/add',
    Members_delete: '/member/delete',
    Members_view: '/member/view',

    Entries_list: '/entry/list',
    Entries_add: '/entry/add',
    Entries_delete: '/entry/delete',
    Entries_view: '/entry/view',

    All: '/sheet/loadAll'

  }
}
