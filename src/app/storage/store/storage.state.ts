import { StorageEntries } from '../storage.models';

export interface StorageState {
  entries: StorageEntries;
  loaded: boolean;
}

export const initialStorageState: StorageState = {
  loaded: false,
  entries: undefined,
};
