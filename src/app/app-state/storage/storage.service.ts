import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { StorageEntries } from './storage.models';

export class MockAsync {
  async(value: any, options: any = {delayTime: 1500, errorRate: 0}): Observable<any> {
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

  getAll(): Observable<StorageEntries> {
    const entries = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      entries[key] = localStorage.getItem(key);
    }
    return this.mock.async(entries);
  }
  save(entries: StorageEntries): Observable<StorageEntries> {
    Object.entries(entries).forEach(([key, value]) => localStorage.setItem(key, value));
    return this.mock.async(entries);
  }
  remove(keys: string[]): Observable<string[]> {
    keys.forEach((key: string) => localStorage.removeItem(key));
    return this.mock.async(keys);
  }
  clear(): Observable<StorageEntries> {
    localStorage.clear();
    return this.mock.async({});
  }
}
