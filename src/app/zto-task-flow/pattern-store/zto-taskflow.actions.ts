import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ZtoTaskflowFlowContext } from './zto-taskflow.state';

export enum ZtoTaskflowActionType {
  addFlowContext = '[Zto Taskflow] Add Flow Context',
  addFlowContexts = '[Zto Taskflow] Add Flow Contexts',
  updateFlowContext = '[Zto Taskflow] Update Flow Context',
  updateFlowContexts = '[Zto Taskflow] Update Flow Contexts',
  deleteFlowContext = '[Zto Taskflow] Delete Flow Context',
  deleteFlowContexts = '[Zto Taskflow] Delete Flow Contexts',
}

export class ZtoTaskflowAddFlowContext implements Action {
  type = ZtoTaskflowActionType.addFlowContext;
  constructor(public payload: ZtoTaskflowFlowContext) {}
}
export class ZtoTaskflowAddFlowContexts implements Action {
  type = ZtoTaskflowActionType.addFlowContexts;
  constructor(public payload: Array<ZtoTaskflowFlowContext>) {}
}
export class ZtoTaskflowUpdateFlowContext implements Action {
  type = ZtoTaskflowActionType.updateFlowContext;
  constructor(public payload: Update<ZtoTaskflowFlowContext>) {}
}
export class ZtoTaskflowUpdateFlowContexts implements Action {
  type = ZtoTaskflowActionType.updateFlowContexts;
  constructor(public payload: Array<Update<ZtoTaskflowFlowContext>>) {}
}
export class ZtoTaskflowDeleteFlowContext implements Action {
  type = ZtoTaskflowActionType.deleteFlowContext;
  constructor(public payload: string) {}
}
export class ZtoTaskflowDeleteFlowContexts implements Action {
  type = ZtoTaskflowActionType.deleteFlowContexts;
  constructor(public payload: Array<string>) {}
}

export type ZtoTaskflowActions = ZtoTaskflowAddFlowContext
  | ZtoTaskflowAddFlowContexts
  | ZtoTaskflowUpdateFlowContext
  | ZtoTaskflowUpdateFlowContexts
  | ZtoTaskflowDeleteFlowContext
  |ZtoTaskflowDeleteFlowContexts;
