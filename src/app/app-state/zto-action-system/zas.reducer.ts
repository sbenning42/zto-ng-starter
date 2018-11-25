import { ZasState, initialZasState, zasStateAdapter } from './zas.state';
import { ZasCorrelationActionsUnion, ZasActionTypes } from './zas.actions';

export function zasReducer(state: ZasState = initialZasState, action: ZasCorrelationActionsUnion): ZasState {
  switch (action.type) {
    case ZasActionTypes.addCorrelation: {
      return zasStateAdapter.addOne(action.payload.correlation, state);
    }
    case ZasActionTypes.upsertCorrelation: {
      return zasStateAdapter.upsertOne(action.payload.correlation, state);
    }
    case ZasActionTypes.addCorrelations: {
      return zasStateAdapter.addMany(action.payload.correlations, state);
    }
    case ZasActionTypes.upsertCorrelations: {
      return zasStateAdapter.upsertMany(action.payload.correlations, state);
    }
    case ZasActionTypes.updateCorrelation: {
      return zasStateAdapter.updateOne(action.payload.correlation, state);
    }
    case ZasActionTypes.updateCorrelations: {
      return zasStateAdapter.updateMany(action.payload.correlations, state);
    }
    case ZasActionTypes.deleteCorrelation: {
      return zasStateAdapter.removeOne(action.payload.id, state);
    }
    case ZasActionTypes.deleteCorrelations: {
      return zasStateAdapter.removeMany(action.payload.ids, state);
    }
    case ZasActionTypes.loadCorrelations: {
      return zasStateAdapter.addAll(action.payload.correlations, state);
    }
    case ZasActionTypes.clearCorrelations: {
      return zasStateAdapter.removeAll({ ...state });
    }
    default: {
      return state;
    }
  }
}

// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = zasStateAdapter.getSelectors();

// select the array of correlation ids
export const selectCorrelationIds = selectIds;

// select the dictionary of correlation entities
export const selectCorrelationEntities = selectEntities;

// select the array of correlations
export const selectAllCorrelations = selectAll;

// select the total correlation count
export const selectCorrelationTotal = selectTotal;
