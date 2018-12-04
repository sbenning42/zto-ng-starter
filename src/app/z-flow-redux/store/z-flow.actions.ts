import { Action } from '@ngrx/store';
import { ZFlowContext } from '../models/z-flow-context';
import { Update } from '@ngrx/entity';
import { ZDictionnary } from '../helpers/z-tools';

export enum ZFlowActionType {
  addFlowContext = '[Zto Flow] Add Flow Context',
  updateFlowContext = '[Zto Flow] Update Flow Context',
  removeFlowContext = '[Zto Flow] Remove Flow Context',
  updateGlobalDataPool = '[Zto Flow] Update Global Data Pool',
}

export class ZFlowContextAdd implements Action {
  type = ZFlowActionType.addFlowContext;
  constructor(public payload: ZFlowContext) {}
}
export class ZFlowContextUpdate implements Action {
  type = ZFlowActionType.updateFlowContext;
  constructor(public payload: Update<ZFlowContext>) {}
}
export class ZFlowContextRemove implements Action {
  type = ZFlowActionType.removeFlowContext;
  constructor(public payload: string) {}
}

export class ZFlowGlobalDataPoolUpdate implements Action {
  type = ZFlowActionType.updateGlobalDataPool;
  constructor(public payload: Partial<ZDictionnary>) {}
}

export type ZFlowActions = ZFlowContextAdd | ZFlowContextUpdate | ZFlowContextRemove | ZFlowGlobalDataPoolUpdate;
