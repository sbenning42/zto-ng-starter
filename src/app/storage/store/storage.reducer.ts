import { StorageState, initialStorageState } from './storage.state';
import { StorageActions, StorageActionsType, StorageLoad, StorageSave, StorageRemove } from './storage.actions';

export function storageReducer(state: StorageState = initialStorageState, action: StorageActions): StorageState {
  switch (action.type) {
    case StorageActionsType.load: {
      const payload = (action as StorageLoad).payload;
      return {
        ...state,
        loaded: true,
        entries: payload.storageEntries,
      };
    }
    case StorageActionsType.save: {
      const payload = (action as StorageSave).payload;
      return {
        ...state,
        entries: {...state.entries, ...payload.storageEntries},
      };
    }
    case StorageActionsType.remove: {
      const payload = (action as StorageRemove).payload;
      const notRemoved = (keys: string[]) => ([key]: [string, string]) => !keys.includes(key);
      const aggregate = (acc, [key, value]) => ({ ...acc, [key]: value });
      return {
        ...state,
        entries: Object.entries(state.entries)
          .filter(notRemoved(payload.keys))
          .reduce(aggregate, {}),
      };
    }
    case StorageActionsType.clear: {
      return {
        ...state,
        entries: {}
      };
    }
    default:
      return state;
  }
}
