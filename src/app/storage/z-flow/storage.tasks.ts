import { ZFlowTask } from '../../z-flow-redux/abstracts/z-flow-task';
import { ZDictionnary, emptyObj } from '../../z-flow-redux/helpers/z-tools';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum StorageSymbol {
  loadKeys = '[Storage Symbol] Load Keys',
  storageEntries = '[Storage Symbol] Storage Entries',
  saveEntries = '[Storage Symbol] Save Entries',
  removeKeys = '[Storage Symbol] Remove Keys',
}

export enum StorageTaskType {
  load = '[Storage Task Type] Load',
  save = '[Storage Task Type] Save',
  remove = '[Storage Task Type] Remove',
  clear = '[Storage Task Type] Clear',
}

const mapProvide = pEntries => ({[StorageSymbol.storageEntries]: pEntries});

export class StorageTaskLoad extends ZFlowTask {

  type = StorageTaskType.load;
  injectSymbols = ['storageService'];
  requiresSymbols = [StorageSymbol.loadKeys];
  provideSymbols = [StorageSymbol.storageEntries];

  execute(requires: ZDictionnary): Observable<ZDictionnary> {
    const keys = requires[StorageSymbol.loadKeys] || [];
    return this.injector.storageService.getAll(keys).pipe(map(mapProvide));
  }

}

export class StorageTaskSave extends ZFlowTask {

  type = StorageTaskType.save;
  injectSymbols = ['storageService'];
  requiresSymbols = [StorageSymbol.saveEntries];
  provideSymbols = [StorageSymbol.storageEntries];

  execute(requires: ZDictionnary): Observable<ZDictionnary> {
    const entries = requires[StorageSymbol.saveEntries] || {};
    return this.injector.storageService.save(entries).pipe(map(mapProvide));
  }

}

export class StorageTaskRemove extends ZFlowTask {

  type = StorageTaskType.remove;
  injectSymbols = ['storageService'];
  requiresSymbols = [
    StorageSymbol.removeKeys,
    StorageSymbol.storageEntries,
  ];
  provideSymbols = [StorageSymbol.storageEntries];

  execute(requires: ZDictionnary): Observable<ZDictionnary> {
    const keys = requires[StorageSymbol.removeKeys] || [];
    const entries = requires[StorageSymbol.storageEntries] || {};
    const removed = ([key]: [string, any]) => !keys || !keys.includes(key);
    const aggregate = (obj, [key, value]) => ({ ...obj, [key]: value });
    const myMapProvide = () => ({
      [StorageSymbol.storageEntries]: Object.entries(entries).filter(removed).reduce(aggregate, {}),
    });
    return this.injector.storageService.remove(keys).pipe(map(myMapProvide));
  }

}

export class StorageTaskClear extends ZFlowTask {

  type = StorageTaskType.clear;
  injectSymbols = ['storageService'];
  provideSymbols = [StorageSymbol.storageEntries];

  execute(): Observable<ZDictionnary> {
    return this.injector.storageService.clear().pipe(map(mapProvide));
  }

}
