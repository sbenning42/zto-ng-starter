import { ZDictionnary } from '../helpers/z-tools';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { ZFlowContext } from '../models/z-flow-context';

export interface ZFlowState {
  globalDataPool: ZDictionnary;
  flowContexts: EntityState<ZFlowContext>;
}

export const zFlowStateflowContextsAdapter = createEntityAdapter<ZFlowContext>({ sortComparer: false });
const initialZFlowFlowContextsState: EntityState<ZFlowContext> = zFlowStateflowContextsAdapter.getInitialState();

export const initialZFlowState: ZFlowState = {
  globalDataPool: new ZDictionnary,
  flowContexts: initialZFlowFlowContextsState,
};
