import { Action } from "@ngrx/store";
import { ZtoIntent } from "./models";

export enum ZtoIntentSystemActionType {
    process = '[Zto Intent System] Process',
    resolve = '[Zto Intent System] Resolve',
    error = '[Zto Intent System] Error',
    cancel = '[Zto Intent System] Cancel',
    remove = '[Zto Intent System] Remove'
}

export function ZtoIntentSystemActionFactory(type: string): (payload: {intent: ZtoIntent}) => Action {
    return (payload: {intent: ZtoIntent}) => ({type, payload});
}

export const ZtoIntentSystemProcess = ZtoIntentSystemActionFactory(ZtoIntentSystemActionType.process);
export const ZtoIntentSystemResolve = ZtoIntentSystemActionFactory(ZtoIntentSystemActionType.resolve);
export const ZtoIntentSystemError = ZtoIntentSystemActionFactory(ZtoIntentSystemActionType.error);
export const ZtoIntentSystemCancel = ZtoIntentSystemActionFactory(ZtoIntentSystemActionType.cancel);
export const ZtoIntentSystemRemove = ZtoIntentSystemActionFactory(ZtoIntentSystemActionType.remove);

export type ZtoIntentSystemActionPayload = {intent: ZtoIntent};