import { ZtoMapFlowCorrelation } from '../../zto-action-system/zas.models';
import { Injectable } from '@angular/core';
import { ZasFacade } from '../../zto-action-system/zas.facade';
import { StorageService } from '../storage.service';
import { StorageActionType, StorageRemove } from './storage.actions';
import { LoggerLog, LoggerError } from '../../logger/store/logger.actions';
import { LoggerFacade } from '../../logger/store/logger.facade';

const successFlow = (mapFlow: ZtoMapFlowCorrelation) => [
  new LoggerLog({ messages: [`${mapFlow.action.type} Success: `, mapFlow.result[0].result] }),
];
const errorFlow = (mapFlow: ZtoMapFlowCorrelation) => [
  new LoggerError({ messages: [`${mapFlow.action.type} Error: `, mapFlow.error[0].error] }),
];
const cancelFlow = (mapFlow: ZtoMapFlowCorrelation) => [
  new LoggerLog({ messages: [`${mapFlow.action.type} Cancel`] }),
];
const logOrErrorFlow = {
  success: successFlow,
  error: errorFlow,
  cancel: cancelFlow,
};
const successFlowWithRemove = (mapFlow: ZtoMapFlowCorrelation) => [
  new LoggerLog({ messages: [`${mapFlow.action.type} Success: `, mapFlow.result[0].result] }),
  new StorageRemove('', {keys: ['testLazy']}),
];
const logOrErrorFlowAndRemove = {
  success: successFlowWithRemove,
  error: errorFlow,
  cancel: cancelFlow,
};

@Injectable()
export class StorageLoadAsyncResolver {

  load = this.zas.baseAsyncResolver(
    `${StorageActionType.load}@async`,
    mapAsync => this.storage.getAll(mapAsync.action.payload.keys),
  );
  loadFlow = this.zas.baseFlowResolver(`${StorageActionType.load}@flow`, logOrErrorFlow);

  save = this.zas.baseAsyncResolver(
    `${StorageActionType.save}@async`,
    mapAsync => this.storage.save(mapAsync.action.payload.entries),
  );
  saveFlow = this.zas.baseFlowResolver(`${StorageActionType.save}@flow`, logOrErrorFlow);

  remove = this.zas.baseAsyncResolver(
    `${StorageActionType.remove}@async`,
    mapAsync => this.storage.remove(mapAsync.action.payload.keys),
  );
  removeFlow = this.zas.baseFlowResolver(`${StorageActionType.remove}@flow`, logOrErrorFlow);

  clear = this.zas.baseAsyncResolver(
    `${StorageActionType.clear}@async`,
    () => this.storage.clear(),
  );
  clearFlow = this.zas.baseFlowResolver(`${StorageActionType.clear}@flow`, logOrErrorFlow);

  constructor(private zas: ZasFacade, private logger: LoggerFacade, private storage: StorageService) { }
}
