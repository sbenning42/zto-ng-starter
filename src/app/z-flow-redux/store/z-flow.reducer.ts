import { ZFlowState, initialZFlowState, zFlowStateflowContextsAdapter } from './z-flow.state';
import {
  ZFlowActions,
  ZFlowActionType,
  ZFlowContextAdd,
  ZFlowContextUpdate,
  ZFlowContextRemove,
  ZFlowGlobalDataPoolUpdate
} from './z-flow.actions';

export const zFlowStoreSelector = 'zflow';
export function zFlowStoreReducer(state: ZFlowState = initialZFlowState, action: ZFlowActions): ZFlowState {
  switch (action.type) {
    case ZFlowActionType.addFlowContext: {
      const payload = (action as ZFlowContextAdd).payload;
      return {
        ...state,
        flowContexts: zFlowStateflowContextsAdapter.addOne(payload, state.flowContexts),
      };
    }
    case ZFlowActionType.updateFlowContext: {
      const payload = (action as ZFlowContextUpdate).payload;
      return {
        ...state,
        flowContexts: zFlowStateflowContextsAdapter.updateOne(payload, state.flowContexts),
      };
    }
    case ZFlowActionType.removeFlowContext: {
      const payload = (action as ZFlowContextRemove).payload;
      return {
        ...state,
        flowContexts: zFlowStateflowContextsAdapter.removeOne(payload, state.flowContexts),
      };
    }
    case ZFlowActionType.updateGlobalDataPool: {
      const payload = (action as ZFlowGlobalDataPoolUpdate).payload;
      return {
        ...state,
        globalDataPool: {
          ...state.globalDataPool,
          ...payload
        },
      };
    }
    default:
      return state;
  }
}
