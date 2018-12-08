import { Injectable } from '@angular/core';
import { ZFlowStoreService } from 'src/app/z-flow-redux/services/z-flow-store.service';
import { StorageService } from '../storage.service';
import { ZDictionnary } from 'src/app/z-flow-redux/helpers/z-tools';
import { ZFlowEngine } from 'src/app/z-flow-redux/models/z-flow-engine';
import { StorageEntries } from '../storage.models';
import {StorageSymbol } from './storage.tasks';
import {
  StorageFlowLoad,
  StorageFlowSave,
  StorageFlowClear,
  StorageFlowRemove
} from './storage.flows';

@Injectable()
export class StorageFlowFacade {

  injector: ZDictionnary;

  constructor(
    public zFlowStoreService: ZFlowStoreService,
    public storageService: StorageService,
  ) {
    this.injector = { storageService };
  }

  load(keys?: string[]): ZFlowEngine {
    return new ZFlowEngine(
      new StorageFlowLoad,
      this.zFlowStoreService,
      this.injector,
      {[StorageSymbol.loadKeys]: keys}
    );
  }

  save(entries?: StorageEntries): ZFlowEngine {
    return new ZFlowEngine(
      new StorageFlowSave,
      this.zFlowStoreService,
      this.injector,
      {[StorageSymbol.saveEntries]: entries}
    );
  }

  remove(keys?: string[]): ZFlowEngine {
    return new ZFlowEngine(
      new StorageFlowRemove,
      this.zFlowStoreService,
      this.injector,
      {[StorageSymbol.removeKeys]: keys}
    );
  }

  clear(): ZFlowEngine {
    return new ZFlowEngine(
      new StorageFlowClear,
      this.zFlowStoreService,
      this.injector,
      {}
    );
  }

}
