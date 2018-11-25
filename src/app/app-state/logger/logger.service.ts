import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private get _log() {
    return console.log.bind(console);
  }
  private get _error() {
    return console.error.bind(console);
  }
  constructor() { }

  log(...messages: any[]): Observable<any> {
    this._log(...messages);
    return of({messages, channel: 'log'});
  }
  error(...messages: any[]): Observable<any> {
    this._error(...messages);
    return of({ messages, channel: 'error' });
  }
}
