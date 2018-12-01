import { ZtoTaskflowState, initialZtoTaskflowState, ztoTaskflowStateAdapter } from './zto-taskflow.state';
import {
  ZtoTaskflowActions,
  ZtoTaskflowActionType,
  ZtoTaskflowAddFlowContext,
  ZtoTaskflowAddFlowContexts,
  ZtoTaskflowUpdateFlowContext,
  ZtoTaskflowUpdateFlowContexts,
  ZtoTaskflowDeleteFlowContexts,
  ZtoTaskflowDeleteFlowContext
} from './zto-taskflow.actions';

export function ztoTaskflowReducer(state: ZtoTaskflowState = initialZtoTaskflowState, action: ZtoTaskflowActions): ZtoTaskflowState {
  switch (action.type) {

    case ZtoTaskflowActionType.addFlowContext: {
      const payload = (action as ZtoTaskflowAddFlowContext).payload;
      return {
        flowContexts: {...state.flowContexts, ...ztoTaskflowStateAdapter.addOne(payload, state.flowContexts)}
      };
    }

    case ZtoTaskflowActionType.addFlowContexts: {
      const payload = (action as ZtoTaskflowAddFlowContexts).payload;
      return {
        flowContexts: {...state.flowContexts, ...ztoTaskflowStateAdapter.addMany(payload, state.flowContexts)}
      };
    }

    case ZtoTaskflowActionType.updateFlowContext: {
      const payload = (action as ZtoTaskflowUpdateFlowContext).payload;
      return {
        flowContexts: {...state.flowContexts, ...ztoTaskflowStateAdapter.updateOne(payload, state.flowContexts)}
      };
    }

    case ZtoTaskflowActionType.updateFlowContexts: {
      const payload = (action as ZtoTaskflowUpdateFlowContexts).payload;
      return {
        flowContexts: {...state.flowContexts, ...ztoTaskflowStateAdapter.updateMany(payload, state.flowContexts)}
      };
    }

    case ZtoTaskflowActionType.deleteFlowContext: {
      const payload = (action as ZtoTaskflowDeleteFlowContext).payload;
      return {
        flowContexts: {...state.flowContexts, ...ztoTaskflowStateAdapter.removeOne(payload, state.flowContexts)}
      };
    }

    case ZtoTaskflowActionType.deleteFlowContexts: {
      const payload = (action as ZtoTaskflowDeleteFlowContexts).payload;
      return {
        flowContexts: {...state.flowContexts, ...ztoTaskflowStateAdapter.removeMany(payload, state.flowContexts)}
      };
    }

    default:
      return state;
  }
}
