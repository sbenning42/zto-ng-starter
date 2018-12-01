import { ZtoTaskflowState, ZtoTaskflowFlowContext } from './zto-taskflow.state';
import { createSelector } from '@ngrx/store';
import { EntityState } from '@ngrx/entity';

export const ztoTaskflowStoreSelector = 'ztoTaskflow';

export function selectZtoTaskflowState(state: any): ZtoTaskflowState {
  return state[ztoTaskflowStoreSelector] as ZtoTaskflowState;
}

function _selectZtoTaskflowFlowContextsState(state: ZtoTaskflowState): EntityState<ZtoTaskflowFlowContext> {
  return state.flowContexts;
}
export const selectZtoTaskflowFlowContextsState = createSelector(selectZtoTaskflowState, _selectZtoTaskflowFlowContextsState);

function _selectZtoTaskflowFlowContextsStateById(id: string): (state: ZtoTaskflowState) => ZtoTaskflowFlowContext {
  return (state: ZtoTaskflowState) => state.flowContexts.entities[id];
}
export const selectZtoTaskflowFlowContextsStateById = (id: string) => createSelector(
  selectZtoTaskflowState,
  _selectZtoTaskflowFlowContextsStateById(id)
);

