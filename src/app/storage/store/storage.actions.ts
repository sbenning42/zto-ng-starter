import { Action } from '@ngrx/store';
import { StorageEntries } from '../storage.models';

export enum StorageActionsType {
  load = '[Storage] Load',
  save = '[Storage] Save',
  remove = '[Storage] Remove',
  clear = '[Storage] Clear',
}

export class StorageLoad implements Action {
  type = StorageActionsType.load;
  constructor(public payload: {storageEntries: StorageEntries}) {}
}
export class StorageSave implements Action {
  type = StorageActionsType.save;
  constructor(public payload: {storageEntries: StorageEntries}) {}
}
export class StorageRemove implements Action {
  type = StorageActionsType.remove;
  constructor(public payload: {keys: string[]}) {}
}
export class StorageClear implements Action {
  type = StorageActionsType.clear;
}

export type StorageActions = StorageLoad | StorageSave | StorageRemove | StorageClear;
