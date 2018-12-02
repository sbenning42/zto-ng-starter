import { ZtoTaskflowFlow } from '../../zto-task-flow/pattern-components/flow/zto-taskflow-flow.abstract';
import { StorageTaskGet, StorageTaskSave, StorageTaskRemove, StorageTaskClear } from './storage.tasks';
import { Injectable } from '@angular/core';
import { ZtoTaskflowFacade } from 'src/app/zto-task-flow/pattern-store/zto-taskflow.facade';
import { StorageService } from '../storage.service';
import { ZtoDictionnary } from 'src/app/zto-task-flow/helpers/zto-dictionnary.model';
import { ZtoTaskflowEngine } from 'src/app/zto-task-flow/pattern-engine/zto-taskflow-engine.model';
import { Observable } from 'rxjs';
import { StorageEntries } from '../storage.models';
import { LoggerTaskLog } from 'src/app/logger/flows/logger.tasks';
import { LoggerService } from 'src/app/logger/logger.service';
import { ToastTaskOpen } from 'src/app/toast/flows/toast.tasks';
import { ToastService } from 'src/app/toast/toast.service';
import { tap } from 'rxjs/operators';
import { StorageFacade } from '../store/storage.facade';

export enum StorageFlowType {
  get = '[Storage Flow] Get',
  save = '[Storage Flow] Save',
  remove = '[Storage Flow] Remove',
  clear = '[Storage Flow] Clear',
  logGet = '[Storage Flow] Log Get',
  logSave = '[Storage Flow] Log Save',
  logRemove = '[Storage Flow] Log Remove',
  logClear = '[Storage Flow] Log Clear',
}

export class StorageFlowGet extends ZtoTaskflowFlow {
  TYPE = StorageFlowType.get;
  constructor() {
    super();
    this.add(new StorageTaskGet, { rootAtom: true, target: true });
  }
}
export class StorageFlowSave extends ZtoTaskflowFlow {
  TYPE = StorageFlowType.save;
  constructor() {
    super();
    this.add(new StorageTaskSave, { rootAtom: true, target: true });
  }
}
export class StorageFlowRemove extends ZtoTaskflowFlow {
  TYPE = StorageFlowType.remove;
  constructor() {
    super();
    this.add(new StorageTaskRemove, { rootAtom: true, target: true });
  }
}
export class StorageFlowClear extends ZtoTaskflowFlow {
  TYPE = StorageFlowType.clear;
  constructor() {
    super();
    this.add(new StorageTaskClear, { rootAtom: true, target: true });
  }
}



class LoggerTaskLogBefore extends LoggerTaskLog {
  REBIND = [{ logBeforeMessages: 'logMessages' }];
}
class LoggerTaskLogAfter extends LoggerTaskLog {
  REBIND = [{ logAfterMessages: 'logMessages' }];
}

class ToastTaskOpenBefore extends ToastTaskOpen {
  REBIND = [{ toastBeforeMessage: 'toastMessage' }];
}
class ToastTaskOpenAfter extends ToastTaskOpen {
  REBIND = [{ toastAfterMessage: 'toastMessage' }];
}

class LoggerTaskLogBeforeGet extends LoggerTaskLogBefore {
  DEF_PROVIDE = { logBeforeMessages: ['Loading Local Storage ...'] };
}
class LoggerTaskLogAfterGet extends LoggerTaskLogAfter {
  DEF_PROVIDE = { logAfterMessages: ['Local Storage Load with success. Got entries: '] };
  REQUIRES = super.requires().concat(['storageEntries']);
  execute(requires: ZtoDictionnary): Observable<ZtoDictionnary> {
    const logMessages = requires.logMessages.concat(requires.storageEntries);
    return super.execute({ logMessages });
  }
}
class ToastTaskOpenBeforeGet extends ToastTaskOpenBefore {
  DEF_PROVIDE = { toastBeforeMessage: 'Loading Local Storage ...' };
}
class ToastTaskOpenAfterGet extends ToastTaskOpenAfter {
  DEF_PROVIDE = { toastAfterMessage: 'Local Storage Load with success' };
}

class LoggerTaskLogBeforeSave extends LoggerTaskLogBefore {
  DEF_PROVIDE = { logBeforeMessages: ['Saving Local Storage ...'] };
}
class LoggerTaskLogAfterSave extends LoggerTaskLogAfterGet {
  DEF_PROVIDE = { logAfterMessages: ['Local Storage Saved with success. Got entries: '] };
}
class ToastTaskOpenBeforeSave extends ToastTaskOpenBefore {
  DEF_PROVIDE = { toastBeforeMessage: 'Saving Local Storage ...' };
}
class ToastTaskOpenAfterSave extends ToastTaskOpenAfter {
  DEF_PROVIDE = { toastAfterMessage: 'Local Storage Saved with success' };
}

class LoggerTaskLogBeforeRemove extends LoggerTaskLogBefore {
  DEF_PROVIDE = { logBeforeMessages: ['Removing Entries from Local Storage ...'] };
}
class LoggerTaskLogAfterRemove extends LoggerTaskLogAfter {
  DEF_PROVIDE = { logAfterMessages: ['Local Storage Removed keys with success: '] };
  REQUIRES = super.requires().concat(['storageRemoveKeys']);
  execute(requires: ZtoDictionnary): Observable<ZtoDictionnary> {
    const logMessages = requires.logMessages.concat(requires.storageRemoveKeys);
    return super.execute({ logMessages });
  }
}
class ToastTaskOpenBeforeRemove extends ToastTaskOpenBefore {
  DEF_PROVIDE = { toastBeforeMessage: 'Removing Entries from Local Storage ...' };
}
class ToastTaskOpenAfterRemove extends ToastTaskOpenAfter {
  DEF_PROVIDE = { toastAfterMessage: 'Local Storage Removed keys with success' };
}

class LoggerTaskLogBeforeClear extends LoggerTaskLogBefore {
  DEF_PROVIDE = { logBeforeMessages: ['Clearing Local Storage ...'] };
}
class LoggerTaskLogAfterClear extends LoggerTaskLogAfter {
  DEF_PROVIDE = { logAfterMessages: ['Local Storage Cleared with success'] };
}
class ToastTaskOpenBeforeClear extends ToastTaskOpenBefore {
  DEF_PROVIDE = { toastBeforeMessage: 'Clearing Local Storage ...' };
}
class ToastTaskOpenAfterClear extends ToastTaskOpenAfter {
  DEF_PROVIDE = { toastAfterMessage: 'Local Storage Cleared with success' };
}

export class LogStorageFlowGet extends StorageFlowGet {
  constructor() {
    super();
    const toastTaskOpenBefore = new ToastTaskOpenBeforeGet;
    const toastTaskOpenAfter = new ToastTaskOpenAfterGet;
    const loggerTaskLogBefore = new LoggerTaskLogBeforeGet;
    const loggerTaskLogAfter = new LoggerTaskLogAfterGet;
    this.add(toastTaskOpenBefore, { rootAtom: true });
    this.add(loggerTaskLogBefore, { rootAtom: true });
    this.add(loggerTaskLogAfter);
    this.add(toastTaskOpenAfter);
    this.link([
      [this.target, loggerTaskLogAfter],
      [this.target, toastTaskOpenAfter],
    ]);
  }
}
export class LogStorageFlowSave extends StorageFlowSave {
  constructor() {
    super();
    const toastTaskOpenBefore = new ToastTaskOpenBeforeSave;
    const toastTaskOpenAfter = new ToastTaskOpenAfterSave;
    const loggerTaskLogBefore = new LoggerTaskLogBeforeSave;
    const loggerTaskLogAfter = new LoggerTaskLogAfterSave;
    this.add(toastTaskOpenBefore, { rootAtom: true });
    this.add(loggerTaskLogBefore, { rootAtom: true });
    this.add(loggerTaskLogAfter);
    this.add(toastTaskOpenAfter);
    this.link([
      [this.target, loggerTaskLogAfter],
      [this.target, toastTaskOpenAfter],
    ]);
  }
}
export class LogStorageFlowRemove extends StorageFlowRemove {
  constructor() {
    super();
    const toastTaskOpenBefore = new ToastTaskOpenBeforeRemove;
    const toastTaskOpenAfter = new ToastTaskOpenAfterRemove;
    const loggerTaskLogBefore = new LoggerTaskLogBeforeRemove;
    const loggerTaskLogAfter = new LoggerTaskLogAfterRemove;
    this.add(toastTaskOpenBefore, { rootAtom: true });
    this.add(loggerTaskLogBefore, { rootAtom: true });
    this.add(loggerTaskLogAfter);
    this.add(toastTaskOpenAfter);
    this.link([
      [this.target, loggerTaskLogAfter],
      [this.target, toastTaskOpenAfter],
    ]);
  }
}
export class LogStorageFlowClear extends StorageFlowClear {
  constructor() {
    super();
    const toastTaskOpenBefore = new ToastTaskOpenBeforeClear;
    const toastTaskOpenAfter = new ToastTaskOpenAfterClear;
    const loggerTaskLogBefore = new LoggerTaskLogBeforeClear;
    const loggerTaskLogAfter = new LoggerTaskLogAfterClear;
    this.add(toastTaskOpenBefore, { rootAtom: true });
    this.add(loggerTaskLogBefore, { rootAtom: true });
    this.add(loggerTaskLogAfter);
    this.add(toastTaskOpenAfter);
    this.link([
      [this.target, loggerTaskLogAfter],
      [this.target, toastTaskOpenAfter],
    ]);
  }
}


@Injectable()
export class StorageFlowFacade {

  constructor(
    public facade: StorageFacade,
    public taskflowFacade: ZtoTaskflowFacade,
    public storageService: StorageService,
    public loggerService: LoggerService,
    public toastService: ToastService
  ) { }

  private createEngine(
    flow: ZtoTaskflowFlow,
    provide: ZtoDictionnary = new ZtoDictionnary,
    options: ZtoDictionnary = new ZtoDictionnary
  ): ZtoTaskflowEngine {
    const inject = {
      storageService: this.storageService,
      loggerService: this.loggerService,
      toastService: this.toastService,
    };
    return new ZtoTaskflowEngine(this.taskflowFacade, flow, inject, provide, options);
  }

  get(keys?: string[]): ZtoTaskflowEngine {
    const onSuccess = (aggregate: ZtoDictionnary) => this.facade.load(aggregate.storageEntries);
    const engine = this.createEngine(new StorageFlowGet, { storageLoadKeys: keys });
    engine.run$ = engine.run$.pipe(tap(onSuccess));
    return engine;
  }
  logGet(keys?: string[]): ZtoTaskflowEngine {
    const onSuccess = (aggregate: ZtoDictionnary) => this.facade.load(aggregate.storageEntries);
    const engine = this.createEngine(new LogStorageFlowGet, { storageLoadKeys: keys });
    engine.run$ = engine.run$.pipe(tap(onSuccess));
    return engine;
  }

  save(entries: StorageEntries): ZtoTaskflowEngine {
    const onSuccess = (aggregate: ZtoDictionnary) => this.facade.save(aggregate.storageEntries);
    const engine = this.createEngine(new StorageFlowSave, { storageEntries: entries });
    engine.run$ = engine.run$.pipe(tap(onSuccess));
    return engine;
  }
  logSave(entries: StorageEntries): ZtoTaskflowEngine {
    const onSuccess = (aggregate: ZtoDictionnary) => this.facade.save(aggregate.storageEntries);
    const engine = this.createEngine(new LogStorageFlowSave, { storageEntries: entries });
    engine.run$ = engine.run$.pipe(tap(onSuccess));
    return engine;
  }

  remove(keys?: string[]): ZtoTaskflowEngine {
    const onSuccess = (aggregate: ZtoDictionnary) => this.facade.remove(aggregate.storageRemoveKeys);
    const engine = this.createEngine(new StorageFlowRemove, { storageRemoveKeys: keys });
    engine.run$ = engine.run$.pipe(tap(onSuccess));
    return engine;
  }
  logRemove(keys?: string[]): ZtoTaskflowEngine {
    const onSuccess = (aggregate: ZtoDictionnary) => this.facade.remove(aggregate.storageRemoveKeys);
    const engine = this.createEngine(new LogStorageFlowRemove, { storageRemoveKeys: keys });
    engine.run$ = engine.run$.pipe(tap(console.log), tap(onSuccess));
    return engine;
  }

  clear(): ZtoTaskflowEngine {
    const onSuccess = () => this.facade.clear();
    const engine = this.createEngine(new StorageFlowClear);
    engine.run$ = engine.run$.pipe(tap(onSuccess));
    return engine;
  }
  logClear(): ZtoTaskflowEngine {
    const onSuccess = () => this.facade.clear();
    const engine = this.createEngine(new LogStorageFlowClear);
    engine.run$ = engine.run$.pipe(tap(onSuccess));
    return engine;
  }

}
