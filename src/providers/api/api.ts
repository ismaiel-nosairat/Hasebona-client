import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GvProvider } from '../gv/gv';
import { RE, ME } from '../../models/io';
import { Events } from 'ionic-angular';

import { catchError, retry } from 'rxjs/operators';
/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  serverUrl: string = 'http://192.168.0.170:9000';

  constructor(public http: HttpClient, private gv: GvProvider, public events: Events) {
  }


  httpHeadersProvider() {
    let headers: HttpHeaders;
    headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    if (this.gv.sheetId && this.gv.token) {
      headers.set('token', this.gv.token);
      headers.set('SheetId', this.gv.sheetId.toString());
    } else if (this.gv.token) {
      headers.set('token', this.gv.token);
    } else {
      headers.set('token', '');
    }
    let reqOpts = {
      headers: headers
    }
    return reqOpts;
  }

  makeRequest(endpoint: string, paylaod?: any, events?: string[]): Promise<RE> {
    return new Promise<RE>((resolve, reject) => {
      this.http.post(this.serverUrl +'/'+ endpoint, paylaod, this.httpHeadersProvider())
       // .pipe(
       //   catchError(this.handleError)
      //  )
        .subscribe((res: RE) => {
          let data: RE = res;//as RE;
          if (data.code == 200) {
            events.forEach(element => {
              this.events.publish(element);
            });
            resolve(data.data);
          }
          else {
            let error: ME = {
              isKnown: true,
              code: data.code,
              message: data.message
            }
            reject(error);
          }
        }, err => {
          let error: ME = {
            isKnown: false,
            message: JSON.stringify(err)
          }
          reject(error)
        })
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    //return throwError(
     // 'Something bad happened; please try again later.');
  };


 
}
