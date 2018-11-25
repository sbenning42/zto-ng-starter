import { ZasCorrelationActionsUnion, ZasActionTypes } from '../../zto-action-system/zas.actions';
import { StorageState, initialStorageState } from './storage.state';
import { StorageActionType } from './storage.actions';
import { ZtoCorrelationStatus } from '../../zto-action-system/zas.models';

export const storageStateKey = 'storage';

export function storageStateReducer(state: StorageState = initialStorageState, action: ZasCorrelationActionsUnion): StorageState {
  switch (action.type) {
    case ZasActionTypes.updateCorrelation: {
      switch (action.payload.name) {
        case 'async': {
          switch (action.payload.type) {
            case StorageActionType.load: {
              switch (action.payload.correlation.changes.status) {
                case ZtoCorrelationStatus.success: {
                  return { ...state, loaded: true, entries: action.payload.correlation.changes.result };
                }
                case ZtoCorrelationStatus.error:
                case ZtoCorrelationStatus.cancel:
                default:
                  return state;
              }
            }
            case StorageActionType.save: {
              switch (action.payload.correlation.changes.status) {
                case ZtoCorrelationStatus.success: {
                  return { ...state, entries: {...state.entries, ...action.payload.correlation.changes.result} };
                }
                case ZtoCorrelationStatus.error:
                case ZtoCorrelationStatus.cancel:
                default:
                  return state;
              }
            }
            case StorageActionType.remove: {
              switch (action.payload.correlation.changes.status) {
                case ZtoCorrelationStatus.success: {
                  const filterFn = ([key]: [string, string]) => !action.payload.correlation.changes.result.includes(key);
                  const reduceFn = (a: any, [k, v]: [string, string]) => ({ ...a, [k]: v });
                  return { ...state, entries: Object.entries(state.entries).filter(filterFn).reduce(reduceFn, {}) };
                }
                case ZtoCorrelationStatus.error:
                case ZtoCorrelationStatus.cancel:
                default:
                  return state;
              }
            }
            case StorageActionType.clear: {
              switch (action.payload.correlation.changes.status) {
                case ZtoCorrelationStatus.success: {
                  return { ...state, entries: {} };
                }
                case ZtoCorrelationStatus.error:
                case ZtoCorrelationStatus.cancel:
                default:
                  return state;
              }
            }
            default:
              return state;
          }
        }
        default:
          return state;
      }
    }
    default:
      return state;
  }
}
