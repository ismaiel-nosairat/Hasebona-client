import { ErrorHandler, Inject, Injector, ViewChild } from "@angular/core";
import { AlertController, NavController, Nav, Events } from "ionic-angular";
import { ME, ManagedError } from '../models/io';
import { BackendProvider } from "../providers/backend/backend";
export class GlobalErrorHandler implements ErrorHandler {

  //@ViewChild(Nav) nav: Nav;
  constructor(
    //  @Inject(NavController) private navCtrl: NavController
    // @Inject(AlertController) private alerts: AlertController,
    @Inject(Injector) private injector: Injector,
    @Inject(Events) private events: Events,


  ) { }

  async  handleError(error: any) {

    if (error.rejection) {
      console.log('rejection')
      error = error.rejection;
    }

    if (error instanceof ManagedError) {
      console.log('ManagedError');
      if (error.code == 0 || error.code == 15) {
        console.log('out');
        this.injector.get(BackendProvider).logout().then(res => {
          this.events.publish('LOGOUT');
        })
      }
      if (error.code == 4) {
        console.log('permissionDenied');
        const backend = this.injector.get(BackendProvider);
        backend.Sheet_loadList().then(res => {
          this.events.publish('SHEET_LIST');
        })
      }
      if (error.code == -1) {
        console.log('network err');
        this.events.publish('GO_OFFLINE');
      }
    } else {


      let parsedError = this.parse(error);
      console.log(parsedError);
      console.log(error);
      // if (error.source && error.source.status == 0) {
      //   console.log('network err');
      //   this.events.publish('GO_OFFLINE');
      // }
      console.error(parsedError);

    }

    // if (error.source && error.source.status == 0) {
    //   console.log('network err');
    //   this.events.publish('GO_OFFLINE');
    // }

  }

  parse(error: any): ParsedError {

    // get best available error message
    let parsedError: ParsedError = {
      message: error.message ? error.message as string : error.toString()
    };

    // include HTTP status code
    if (error.status != null) {
      parsedError.status = error.status;
    }

    // include stack trace
    if (error.stack != null) {
      parsedError.stack = error.stack;
    }

    return parsedError;
  }


}
export interface ParsedError {
  message: string;
  status?: number;
  stack?: string;
}

