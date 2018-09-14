import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { ReportOut, Login, LoginResponse, SheetListItem, AllDto, AddSheetIn, AddSheetOut, FoundUser, ViewMemberOut, ViewEntryOut, PermissionItem, AddEntryIn, ViewSheetOut, PermissionRequest } from '../../models/dtos';
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

  constructor(public http: HttpClient, private api: Api, private gv: GvProvider, private storage: Storage, private events: Events) {
    console.log('Hello BackendProvider Provider');

  }


  Sheet_loadReport(withEvent?: boolean): Promise<any> {
    return new Promise((resolve, reject) => {

      this.api.makeRequest(this.endpoints.Sheets_report, null, null)
        .then(result => {
          let report: ReportOut = result as ReportOut;
          this.api.parseReportData(report);
          if (withEvent) { this.events.publish('sheet:report'); }
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
              this.api.prepareSheetList(this.gv.userSheets);
              resolve();
            })
          });
        }
      );
    })
  }

  Users_findUserByEmail(userEmail: string): Promise<FoundUser> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Users_findByEmail, userEmail).then(res => {
        let result = res as FoundUser;
        resolve(result);
      })
    })
  }

  loadAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.All).then(
        result => {
          let all: AllDto = result as AllDto;
          console.log(all);
          this.gv.userSheets = all.userSheets;
          this.api.prepareSheetList(this.gv.userSheets);
          this.gv.members = all.members;
          this.events.publish('member:list');
          this.gv.entires = all.entries;
          this.api.prepareNewEntries(all.entries);
          console.log('before');
          this.api.parseReportData(all.report);
          console.log('after', this.gv.report)
          this.api.prepareNewSheet(all.sheet).then(ress => {
            this.gv.sheet = ress;
            resolve()
          })
        })
    })
  }


  Sheet_loadList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Sheets_list).then(
        result => {
          let userSheets: SheetListItem[] = result as SheetListItem[];
          this.gv.userSheets = userSheets;
          this.api.prepareSheetList(this.gv.userSheets);
          resolve();
        })
    })
  }

  Sheets_new(created: AddSheetIn): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Sheets_create, created).then(
        result => {
          let newSheet = result as AddSheetOut;
          this.storage.set(this.gv.GC.SHEET_ID, newSheet.id).then(sRes => {
            this.gv.sheetId = newSheet.id;
            this.loadAll().then(re => resolve())
          });
        })
    });
  }

  Sheet_View(sheetId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.set(this.gv.GC.SHEET_ID, sheetId).then(sRes => {
        this.gv.sheetId = sheetId;
        this.loadAll().then(re => resolve())
      });
    });
  }

  Members_Add(addMember): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Members_add, addMember).then(result => {
        this.loadAll().then(re => resolve())
      })
    })
  }

  Members_View(memberId): Promise<ViewMemberOut> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Members_view, memberId).then(result => {
        let output = result as ViewMemberOut;
        resolve(output);
      })
    })
  }

  Members_Delete(memberId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Members_delete, memberId).then(result => {
        this.loadAll().then(ress => {
          resolve(1);
        });
      })
    })
  }
  Entries_delete(entryId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Entries_delete, entryId).then(result => {
        let index = this.gv.entires.indexOf(this.gv.entires.find(e => e.id == entryId), 0);
        if (index > -1) {
          this.gv.entires.splice(index, 1);
        }
        this.Sheet_loadReport().then(ress => {
          resolve(1);
        });
      })
    })
  }


  Users_addPermission(permission: PermissionRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Users_addPermission, permission).then(result => {
        this.Sheet_loadInfo().then(ress => {
          resolve(1);

        })
      })
    })

  }

  Sheet_loadInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Sheets_view).then(res => {
        let result: ViewSheetOut = res;
        this.api.prepareNewSheet(result).then(ress => {
          this.gv.sheet = ress;
          resolve();
        });
      })
    })
  }
  Users_removePermission(permission: PermissionItem): Promise<any> {
    return new Promise((resolve, reject) => {
      let permissionReq = {
        userEmail: permission.email
      }
      this.api.makeRequest(this.endpoints.Users_removePermission, permissionReq).then(result => {
        let index = this.gv.sheet.permissionsList.indexOf(permission, 0);
        if (index > -1) {
          this.gv.sheet.permissionsList.splice(index, 1);
        }
        resolve(1);
      })
    })
  }
  Entries_add(input: AddEntryIn): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.makeRequest(this.endpoints.Entries_add, input).then(result => {
        let e: ViewEntryOut = result;
        e.creditor = this.gv.members.find(m => m.id == e.creditorId);
        e.class = 'it' + (this.randomIntFromInterval(0, 10) % 10) + ' it';
        e.members.forEach(i => {
          i.index = i.amount > 0 ? 'positive' : 'negative';
          i.absoluteAmount = i.amount >= 0 ? i.amount : -1 * i.amount;
          i.member = this.gv.members.find(m => m.id == i.id);
        })
        this.gv.entires.unshift(e);
        resolve(1);
      })
    })
  }
  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  logout(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.gv.entires = [];
      this.gv.sheetId = null;
      this.gv.token = null;

      this.gv.sheet = null
      this.gv.members = [];
      this.gv.entires = [];
      this.gv.report = {
        creditors: [],
        debtors: [],
        creditorsBalance: [],
        debtorsBalance: []
      };
      this.gv.userSheets = [];
      this.storage.set(this.gv.GC.SHEET_ID, null).then(ress => {
        this.storage.set(this.gv.GC.TOKEN, null).then(reeess => {
          resolve();
        })
      })
    })
  }

  endpoints = {
    Users_Login: '/user/login',
    Users_addPermission: '/user/addPermission',
    Users_removePermission: '/user/deletePermission',
    Users_findByEmail: '/user/find',
    Sheets_list: '/sheet/list',
    Sheets_view: '/sheet/view',
    Sheets_create: '/sheet/add',
    Sheets_report: '/sheet/report',

    Members_list: '/member/list',
    Members_add: '/member/add',
    Members_delete: '/member/delete',
    Members_view: '/member/view',

    Entries_list: '/entry/list',
    Entries_add: '/entry/add',
    Entries_delete: '/entry/delete',
    Entries_view: '/entry/view',

    All: '/sheet/loadAll'

  }


}
