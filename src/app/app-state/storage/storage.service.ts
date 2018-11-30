import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap, map } from 'rxjs/operators';
import { StorageEntries } from './storage.models';

export class MockAsync {
  async(value: any, options: any = {delayTime: 0, errorRate: 0}): Observable<any> {
    return of(value).pipe(
      delay(options.delayTime !== undefined ? options.delayTime : 0),
      switchMap((innerValue: any) => {
        if (options.errorRate !== undefined && Math.random() < options.errorRate) {
          return throwError(new Error('Random async mock error with rate: ' + options.errorRate));
        } else {
          return of(innerValue);
        }
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  mock = new MockAsync;

  constructor() { }

  getAll(keys?: string[], options?: any): Observable<StorageEntries> {
    const entries = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (keys === undefined || keys.length === 0 || (keys !== undefined && keys.includes(key))) {
        entries[key] = localStorage.getItem(key);
      }
    }
    return this.mock.async(entries, options);
  }
  save(entries: StorageEntries, options?: any): Observable<StorageEntries> {
    Object.entries(entries).forEach(([key, value]) => localStorage.setItem(key, value));
    return this.mock.async(entries, options);
  }
  remove(keys?: string[], options?: any): Observable<string[]> {
    if (keys === undefined) {
      keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      return this.clear().pipe(map(() => keys));
    } else {
      keys.forEach((key: string) => localStorage.removeItem(key));
      return this.mock.async(keys, options);
    }
  }
  clear(options?: any): Observable<StorageEntries> {
    localStorage.clear();
    return this.mock.async({}, options);
  }
}
