import { ZtoBaseCommand, ZtoAsyncCorrelation, ZtoSequenceCorrelation, ZtoFlowCorrelation } from '../../zto-action-system/zas.models';
import { StorageEntries } from '../storage.models';
import { environment } from 'src/environments/environment';

export enum StorageActionType {
  load = '[Storage] Load',
  save = '[Storage] Save',
  remove = '[Storage] Remove',
  clear = '[Storage] Clear',
}

export class StorageLoad extends ZtoBaseCommand<{ keys?: string[] } | undefined> {
  type = StorageActionType.load;
  correlations = {
    async: new ZtoAsyncCorrelation(StorageActionType.load),
    flow: environment.debug ? new ZtoFlowCorrelation(StorageActionType.load) : undefined,
  };
  constructor(commandSrc: string, payload?: {keys?: string[]}) {
    super(commandSrc, payload);
  }
}
export class StorageSave extends ZtoBaseCommand<{ entries: StorageEntries }> {
  type = StorageActionType.save;
  correlations = {
    async: new ZtoAsyncCorrelation(StorageActionType.save),
    flow: environment.debug ? new ZtoFlowCorrelation(StorageActionType.save) : undefined,
  };
  constructor(commandSrc: string, payload: {entries: StorageEntries}) {
    super(commandSrc, payload);
  }
}
export class StorageRemove extends ZtoBaseCommand<{ keys?: string[] } | undefined> {
  type = StorageActionType.remove;
  correlations = {
    async: new ZtoAsyncCorrelation(StorageActionType.remove),
    flow: environment.debug ? new ZtoFlowCorrelation(StorageActionType.remove) : undefined,
  };
  constructor(commandSrc: string, payload?: {keys?: string[]}) {
    super(commandSrc, payload);
  }
}
export class StorageClear extends ZtoBaseCommand<undefined> {
  type = StorageActionType.clear;
  correlations = {
    async: new ZtoAsyncCorrelation(StorageActionType.clear),
    flow: environment.debug ? new ZtoFlowCorrelation(StorageActionType.clear) : undefined,
  };
  constructor(commandSrc: string) {
    super(commandSrc);
  }
}

export type StorageActions = StorageLoad
  | StorageSave
  | StorageRemove
  | StorageClear;

