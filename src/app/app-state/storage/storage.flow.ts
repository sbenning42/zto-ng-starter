import { ZGraphFlow } from '../../z-flow/models/z-flow';
import { ZTask } from 'src/app/z-flow/models/z-task';
import { of } from 'rxjs';
import { ZDictionary } from 'src/app/z-flow/models/z-helpers';
import { ZLink } from 'src/app/z-flow/models/z-link';
import { ZEngine } from 'src/app/z-flow/models/z-engine';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { StorageEntries } from './storage.models';

export class LogTask extends ZTask {
  name = '[Log Task] Log';
  requires = { logTaskMessages: null };
  provide = { logTaskMessagesLogged: null };
  inject = { loggerService: null };
  execute(requires: ZDictionary) {
    const logger = this.inject.loggerService;
    const logTaskMessages = [
      `${this.name}: `,
      ...requires.logTaskMessages
    ];
    return logger.log(...logTaskMessages).pipe(
      map(() => ({logTaskMessagesLogged: logTaskMessages}))
    );
  }
  revert() {
    return of(new ZDictionary);
  }
}
export class ErrorTask extends ZTask {
  name = '[Log Task] Error';
  requires = { errorTaskMessages: null };
  provide = { errorTaskMessagesLogged: null };
  inject = { loggerService: null };
  execute(requires: ZDictionary) {
    const logger = this.inject.loggerService;
    const errorTaskMessages = [
      `${this.name}: `,
      ...requires.errorTaskMessages
    ];
    return logger.error(...errorTaskMessages).pipe(
      map(() => ({errorTaskMessagesLogged: errorTaskMessages}))
    );
  }
  revert() {
    return of(new ZDictionary);
  }
}
export class StorageLoadTask extends ZTask {
  name = '[Storage Task] Load';
  requires = { localStorageLoadKeys: null };
  provide = { localStorageEntries: null };
  inject = { storageService: null };
  execute(requires: ZDictionary) {
    const storage = this.inject.storageService;
    const localStorageLoadKeys = requires.localStorageLoadKeys || [];
    return storage.getAll(localStorageLoadKeys).pipe(
      map((entries: StorageEntries) => ({localStorageEntries: entries})),
      tap(r => console.log('R: ', r)),
    );
    /*
    const localStorageEntries = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (localStorageLoadKeys.length === 0 || localStorageLoadKeys.includes(key)) {
        localStorageEntries[key] = localStorage.getItem(key);
      }
    }
    return ;
    */
  }
  revert() {
    return of(new ZDictionary);
  }
}

export class StorageFlowLoadAndLog extends ZGraphFlow {
  name = '[Storage Flow] Load And Log';
  provide = { logTaskMessages: [['Loading Local Storage'], ['Local Storage Loaded']] };
}
export function loadFlowFactory(): StorageFlowLoadAndLog {
  const storageFlowLoad = new StorageFlowLoadAndLog;
  storageFlowLoad.add(new StorageLoadTask);
  storageFlowLoad.add(new LogTask);
  storageFlowLoad.link(new ZLink('[Storage Task] Load', '[Log Task] Log'));
  return storageFlowLoad;
}

export function test(services: ZDictionary) {
  const engine = new ZEngine(services, loadFlowFactory());
  engine.execution$.subscribe(n => console.log('next: ', n), e => console.log('error: ', e), () => console.log('complete'));
}
