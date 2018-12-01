import { ZtoDictionnary } from '../helpers/zto-dictionnary.model';
import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ZtoTaskflowFlowStatus } from '../pattern-components/flow/zto-taskflow-flow-status.enum';

export interface ZtoTaskflowFlowContext {
  id: string;
  status: ZtoTaskflowFlowStatus;
  TYPE: string;
  DEF_PROVIDE_Aggregat: ZtoDictionnary;
  INJECT_Aggregat: ZtoDictionnary;
  REQUIRES_Aggregat: ZtoDictionnary;
  PROVIDE_Aggregat: ZtoDictionnary;
  REBIND_Aggregat: ZtoDictionnary;
  REVERT_REQUIRES_Aggregat: ZtoDictionnary;
  REVERT_PROVIDE_Aggregat: ZtoDictionnary;
  REVERT_REBIND_Aggregat: ZtoDictionnary;
}

export interface ZtoTaskflowState {
  flowContexts: EntityState<ZtoTaskflowFlowContext>;
}

export type ZtoTaskflowFlowContextAdapter = EntityAdapter<ZtoTaskflowFlowContext>;
export const ztoTaskflowStateAdapter: ZtoTaskflowFlowContextAdapter = createEntityAdapter<ZtoTaskflowFlowContext>({ sortComparer: false });

export const initialZtoTaskflowState: ZtoTaskflowState = {
  flowContexts: ztoTaskflowStateAdapter.getInitialState(),
};
