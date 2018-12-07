import { StorageState } from './storage.state';
import { createSelector } from '@ngrx/store';

export const storageStoreSelectorKey = 'storage';

export const selectStorage = (state: any) => state[storageStoreSelectorKey] as StorageState;

export const selectStorageLoaded = createSelector(selectStorage, (state: StorageState) => state.loaded);
export const selectStorageEntries = createSelector(selectStorage, (state: StorageState) => state.entries);
