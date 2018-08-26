import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ViewSheetOut, ListMemberItem, ListEntriesOutItem, ViewEntryOut, SheetListItem } from '../../models/dtos';

/*
  Generated class for the GvProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GvProvider {

  sheetId: number;
  token: string;

  sheet: ViewSheetOut;
  members: ListMemberItem[];
  entires: ViewEntryOut[];
  report: {
    creditors: any[],
    debtors: any[],
    creditorsBalance: any[],
    debtorsBalance: any[]
  };
  userSheets: SheetListItem[];

  GC = {
    TOKEN: 'TOKEN',
    SHEET_ID: 'sheetId'
  }



  globalColorsRGBA = [
    'rgba(255, 0, 0,0.6)',
    'rgba(255, 128, 0,0.6)',
    'rgba(255, 255, 0,0.6)',
    'rgba(64, 255, 0,0.6)',
    'rgba(0, 191, 255,0.6)',
    'rgba(0, 64, 255,0.6)',
    'rgba(128, 0, 255,0.6)',
    'rgba(255, 0, 255,0.6)',
    'rgba(255, 0, 128,0.6)',
    'rgba(204, 102, 0,0.6)',
    'rgba(102, 102, 51,0.6)'
  ];
  globalColorsHEX = [
    '#ff0000',
    '#ff8000',
    '#ffff00',
    '#40ff00',
    '#00bfff',
    '#0040ff',
    '#8000ff',
    '#ff00ff',
    '#ff0080',
    '#cc6600',
    '#666633'
  ];
  constructor(public http: HttpClient) {

    console.log('Hello GvProvider Provider');
  }

}
