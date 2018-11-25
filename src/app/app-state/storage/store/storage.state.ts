import { StorageEntries } from '../storage.models';

export interface StorageState {
  loaded: boolean;
  entries: StorageEntries;
}

export const initialStorageState: StorageState = {
  loaded: false,
  entries: undefined
};
