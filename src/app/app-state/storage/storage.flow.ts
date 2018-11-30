import { ZGraphFlow, ZFlow } from '../../z-flow/models/z-flow';
import { ZTask } from 'src/app/z-flow/models/z-task';
import { of, Observable } from 'rxjs';
import { ZDictionary } from 'src/app/z-flow/models/z-helpers';
import { ZLink } from 'src/app/z-flow/models/z-link';
import { ZEngine } from 'src/app/z-flow/models/z-engine';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { StorageEntries } from './storage.models';
import { LogTask } from '../logger/logger.flow';

export class LoadStorageTask extends ZTask {
  name = '[Storage Task] Load';
  inject = { storageService: null };
  requires = { localStorageLoadKeys: null };
  provide = { localStorageEntries: null };
  execute(requires: ZDictionary): Observable<ZDictionary> {
    const storage = this.inject.storageService;
    const localStorageLoadKeys = requires.localStorageLoadKeys || [];
    return storage.getAll(localStorageLoadKeys).pipe(
      map((entries: StorageEntries) => ({localStorageEntries: entries})),
    );
  }
}
export class LogBeforeLoadStorageTask extends LogTask {
  name = '[Storage Task] Log Before Load';
}
export class LogAfterLoadStorageTask extends LogTask {
  name = '[Storage Task] Log After Load';
  requires = { logTaskMessages: null, localStorageEntries: null};
  execute(requires: ZDictionary): Observable<ZDictionary> {
    const logTaskMessages = [...requires.logTaskMessages, requires.localStorageEntries];
    return super.execute({logTaskMessages});
  }
}
export class LoadStorageAndLogBeforeSplitterTask extends ZTask {
  name = '[Storage Task] Split Load and Log Before';
}

export class StorageFlowLoadAndLog extends ZGraphFlow {
  name = '[Storage Flow] Load Storage and Log Before and After';
  provide = { logTaskMessages: [['Loading Local Storage'], ['Local Storage Loaded']] };
}
export function loadAndLogFlowFactory(): StorageFlowLoadAndLog {
  const storageFlowLoad = new StorageFlowLoadAndLog;
  storageFlowLoad.add(new LoadStorageAndLogBeforeSplitterTask);
  storageFlowLoad.add(new LogBeforeLoadStorageTask);
  storageFlowLoad.add(new LoadStorageTask);
  storageFlowLoad.add(new LogAfterLoadStorageTask);
  storageFlowLoad.link(new ZLink('[Storage Task] Split Load and Log Before', '[Storage Task] Log Before Load'));
  storageFlowLoad.link(new ZLink('[Storage Task] Split Load and Log Before', '[Storage Task] Load'));
  storageFlowLoad.link(new ZLink('[Storage Task] Load', '[Storage Task] Log After Load'));
  return storageFlowLoad;
}

export function test(services: ZDictionary) {
  const engine = new ZEngine(services, loadAndLogFlowFactory());
  engine.execution$.subscribe();
}
