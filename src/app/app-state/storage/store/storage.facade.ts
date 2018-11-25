import { Injectable } from '@angular/core';
import { StorageEntries } from '../storage.models';
import { StorageLoad, StorageSave, StorageRemove, StorageClear } from './storage.actions';
import { ZasFacade } from '../../zto-action-system/zas.facade';
import { ZtoAction, ZtoLazyAction } from '../../zto-action-system/zas.models';
import { StorageLoadAsyncResolver } from './storage.resolver';
import { StorageState } from './storage.state';
import { Observable } from 'rxjs';
import { storageStateKey } from './storage.reducer';
import { createSelector } from '@ngrx/store';

export const selectStorage = (root: any) => root[storageStateKey] as StorageState;
export const selectStorageEntries = createSelector(selectStorage, (storage: StorageState) => storage.entries);
export const selectStorageLoaded = createSelector(selectStorage, (storage: StorageState) => storage.loaded);

@Injectable()
export class StorageFacade {
  storage$: Observable<StorageState> = this.zas.selectStore(selectStorage);
  entries$: Observable<StorageEntries> = this.zas.selectStore(selectStorageEntries);
  loaded$: Observable<boolean> = this.zas.selectStore(selectStorageLoaded);
  constructor(private zas: ZasFacade, private resolvers: StorageLoadAsyncResolver) {
    this.zas.registers(this.resolvers);
  }
  lazyLoadFactory = (keys?: string[], src?: string): ZtoLazyAction => this.zas.toLazy(new StorageLoad(src, { keys }));
  lazySaveFactory = (entries: StorageEntries, src?: string): ZtoLazyAction => this.zas.toLazy(new StorageSave(src, {entries}));
  lazyRemoveFactory = (keys?: string[], src?: string): ZtoLazyAction => this.zas.toLazy(new StorageRemove(src, {keys}));
  lazyClearFactory = (src?: string): ZtoLazyAction => this.zas.toLazy(new StorageClear(src));
}
