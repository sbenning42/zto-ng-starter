import { Injectable } from '@angular/core';
import { Observable, of, timer, throwError } from 'rxjs';
import { delay, first, map, tap, switchMap } from 'rxjs/operators';

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
    return timer(5000).pipe(
      first(),
      tap(() => {
        this._log(...messages);
      }),
      map(() => ({ messages, channel: 'log' }))
    );
  }
  error(...messages: any[]): Observable<any> {
    return timer(5000).pipe(
      first(),
      tap(() => {
        this._error(...messages);
      }),
      map(() => ({ messages, channel: 'error' })),
      switchMap(() => throwError(new Error('Random service error')))
    );
  }
}
