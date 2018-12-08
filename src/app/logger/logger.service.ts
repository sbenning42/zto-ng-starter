import { Injectable } from '@angular/core';
import { Observable, of, timer, throwError } from 'rxjs';
import { delay, first, map, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  log(...messages: any[]): Observable<any> {
    return timer(0).pipe(
      first(),
      // switchMap(() => throwError(new Error('Random service error')))
      tap(() => {
        console.log(...messages);
      }),
      map(() => ({ messages })),
    );
  }

  error(...messages: any[]): Observable<any> {
    return timer(0).pipe(
      first(),
      // switchMap(() => throwError(new Error('Random service error')))
      tap(() => {
        console.error(...messages);
      }),
      map(() => ({ messages })),
    );
  }

}
