import { ZtoIntentSystemState } from "./state";
import { createSelector } from "@ngrx/store";
import { ZtoIntent, ZtoIntentStatus } from "./models";

export const ztoIntentSystemRootKey = 'ztoIntentSystem';
export const ztoIntentSystemRootSelector = (root: any) => root[ztoIntentSystemRootKey] as ZtoIntentSystemState;

export const ztoIntentSystemProcessingSelector = createSelector(ztoIntentSystemRootSelector, (state: ZtoIntentSystemState) => state.processing);
export const ztoIntentSystemAllResolvedSelector = createSelector(ztoIntentSystemRootSelector, (state: ZtoIntentSystemState) => state.resolved);
export const ztoIntentSystemResolvedSelector = createSelector(ztoIntentSystemAllResolvedSelector, (state: {[id: string]: ZtoIntent}) => Object.entries(state)
    .filter(([, intent]) => intent.status === ZtoIntentStatus.resolved)
    .reduce((all, [id, intent]) => ({...all, [id]: intent}), {})
);
export const ztoIntentSystemErroredSelector = createSelector(ztoIntentSystemAllResolvedSelector, (state: {[id: string]: ZtoIntent}) => Object.entries(state)
    .filter(([, intent]) => intent.status === ZtoIntentStatus.errored)
    .reduce((all, [id, intent]) => ({...all, [id]: intent}), {})
);
export const ztoIntentSystemCanceledSelector = createSelector(ztoIntentSystemAllResolvedSelector, (state: {[id: string]: ZtoIntent}) => Object.entries(state)
    .filter(([, intent]) => intent.status === ZtoIntentStatus.canceled)
    .reduce((all, [id, intent]) => ({...all, [id]: intent}), {})
);

export const ztoIntentSystemByIdSelector = (id: string) => createSelector(ztoIntentSystemRootSelector, (state: ZtoIntentSystemState) => state.processing[id] || state.resolved[id]);
export const ztoIntentSystemProcessingByTypeSelector = (type: string) => createSelector(ztoIntentSystemRootSelector, (state: ZtoIntentSystemState) => Object.entries(state.processing)
    .filter(([, intent]) => intent.type === type)
    .reduce((all, [id, intent]) => ({...all, [id]: intent}), {})
);
export const ztoIntentSystemResolvedByTypeSelector = (type: string) => createSelector(ztoIntentSystemRootSelector, (state: ZtoIntentSystemState) => Object.entries(state.resolved)
    .filter(([, intent]) => intent.type === type)
    .reduce((all, [id, intent]) => ({...all, [id]: intent}), {})
);