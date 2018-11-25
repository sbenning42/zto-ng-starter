import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';
import { ZasState } from './zas.state';
import * as fromCorrelation from './zas.reducer';

export const zasStateKey = 'correlations';

export const selectCorrelationState = createFeatureSelector<ZasState>(zasStateKey);

export const selectCorrelationIds = createSelector(
  selectCorrelationState,
  fromCorrelation.selectCorrelationIds
);
export const selectCorrelationEntities = createSelector(
  selectCorrelationState,
  fromCorrelation.selectCorrelationEntities
);
export const selectAllCorrelations = createSelector(
  selectCorrelationState,
  fromCorrelation.selectAllCorrelations
);
export const selectCorrelationTotal = createSelector(
  selectCorrelationState,
  fromCorrelation.selectCorrelationTotal
);

export const selectCorrelationFactory = (id: string) => createSelector(
  selectCorrelationEntities,
  (correlationEntities) => correlationEntities[id]
);
