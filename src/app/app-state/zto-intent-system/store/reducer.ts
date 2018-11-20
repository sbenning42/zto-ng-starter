import { ZtoIntentSystemState, initialZtoIntentSystemState } from "./state";
import { ztoIntentProcessing, ztoIntentResolved, ztoIntentErrored, ztoIntentCanceled } from "./tools";
import { ZtoIntentSystemActionType } from "./actions";

export function ztoIntentSystemReducer(state: ZtoIntentSystemState = initialZtoIntentSystemState, action: any): ZtoIntentSystemState {
    switch (action.type) {
        case ZtoIntentSystemActionType.process: {
            return {
                ...state,
                processing: {
                    ...state.processing,
                    [action.payload.intent.id]: ztoIntentProcessing(action.payload.intent),
                }
            };
        }
        case ZtoIntentSystemActionType.resolve: {
            return {
                ...state,
                processing: Object.entries(state.processing)
                    .filter(([id]) => id !== action.payload.intent.id)
                    .reduce((all, [id, intent]) => ({...all, [id]: intent}), {}),
                resolved: {
                    ...state.resolved,
                    [action.payload.intent.id]: ztoIntentResolved(action.payload.intent),
                },
            };
        }
        case ZtoIntentSystemActionType.error: {
            return {
                ...state,
                processing: Object.entries(state.processing)
                    .filter(([id]) => id !== action.payload.intent.id)
                    .reduce((all, [id, intent]) => ({...all, [id]: intent}), {}),
                resolved: {
                    ...state.resolved,
                    [action.payload.intent.id]: ztoIntentErrored(action.payload.intent),
                },
            };
        }
        case ZtoIntentSystemActionType.cancel: {
            return {
                ...state,
                processing: Object.entries(state.processing)
                    .filter(([id]) => id !== action.payload.intent.id)
                    .reduce((all, [id, intent]) => ({...all, [id]: intent}), {}),
                resolved: {
                    ...state.resolved,
                    [action.payload.intent.id]: ztoIntentCanceled(action.payload.intent),
                },
            };
        }
        case ZtoIntentSystemActionType.remove: {
            return {
                ...state,
                resolved: Object.entries(state.processing)
                    .filter(([id]) => id !== action.payload.intent.id)
                    .reduce((all, [id, intent]) => ({...all, [id]: intent}), {}),
            };
        }
        default:
            return state;
    }
}