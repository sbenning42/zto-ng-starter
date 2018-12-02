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
  DEF_PROVIDE = { logBeforeMessages: ['Loading Local Storage ...'] };
  REBIND = [{ logBeforeMessages: 'logMessages' }];
}
class LoggerTaskLogAfter extends LoggerTaskLog {
  DEF_PROVIDE = { logAfterMessages: ['Local Storage Load with success. Got entries: '] };
  REQUIRES = ['logAfterMessages', 'storageEntries'];
  execute(requires: ZtoDictionnary): Observable<ZtoDictionnary> {
    const logMessages = requires.logAfterMessages.concat(requires.storageEntries);
    return super.execute({ logMessages });
  }
}

/**
 * There are many way to express a flow graph.
 * There are often some subtle differences between those way.
 *
 * Here, LogStorageFlowGet extends StorageFlowGet,
 * StorageFlowGet declare it's target as it's rootAtom StorageTaskGet.
 *
 * In LogStorageFlowGet, the log part should be treated as
 * non-sensible parralelle execution.
 * So even if LoggerTaskLogAfter should be executed after
 * StorageTaskGet, the target of LogStorageFlowGet shouldn't changes.
 *
 * In the same spirit, StorageTaskGet doesn't wait for
 * LoggerTaskLogBefore to finish (
 *    as LogStorageFlowGet doens't override
 *    the rootAtom state of StorageTaskGet
 * )
 */
export class LogStorageFlowGet extends StorageFlowGet {
  constructor() {
    super();
    const loggerTaskLogBefore = new LoggerTaskLogBefore;
    const loggerTaskLogAfter = new LoggerTaskLogAfter;
    this.add(loggerTaskLogBefore, { rootAtom: true });
    this.add(loggerTaskLogAfter);
    this.link([[this.target, loggerTaskLogAfter]]);
  }
}

@Injectable()
export class StorageFlowFacade {

  constructor(
    public taskflowFacade: ZtoTaskflowFacade,
    public storageService: StorageService,
    public loggerService: LoggerService
  ) { }

  private createEngine(
    flow: ZtoTaskflowFlow,
    provide: ZtoDictionnary = new ZtoDictionnary,
    options: ZtoDictionnary = new ZtoDictionnary
  ): ZtoTaskflowEngine {
    const inject = {
      storageService: this.storageService,
      loggerService: this.loggerService,
    };
    return new ZtoTaskflowEngine(this.taskflowFacade, flow, inject, provide, options);
  }

  get(keys?: string[]): Observable<ZtoDictionnary> {
    const engine = this.createEngine(new StorageFlowGet, { storageLoadKeys: keys });
    return engine.run$;
  }
  logGet(keys?: string[]): Observable<ZtoDictionnary> {
    const engine = this.createEngine(new LogStorageFlowGet, { storageLoadKeys: keys });
    return engine.run$;
  }

  save(entries: StorageEntries): Observable<ZtoDictionnary> {
    const engine = this.createEngine(new StorageFlowSave, { storageEntries: entries });
    return engine.run$;
  }

  remove(keys?: string[]): Observable<ZtoDictionnary> {
    const engine = this.createEngine(new StorageFlowRemove, { storageRemoveKeys: keys });
    return engine.run$;
  }

  clear(): Observable<ZtoDictionnary> {
    const engine = this.createEngine(new StorageFlowClear);
    return engine.run$;
  }

}
