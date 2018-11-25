import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ZtoCorrelation } from './zas.models';

export enum ZasActionTypes {
  loadCorrelations = '[Zto Action System] Load Correlations',
  addCorrelation = '[Zto Action System] Add Correlation',
  upsertCorrelation = '[Zto Action System] Upsert Correlation',
  addCorrelations = '[Zto Action System] Add Correlations',
  upsertCorrelations = '[Zto Action System] Upsert Correlations',
  updateCorrelation = '[Zto Action System] Update Correlation',
  updateCorrelations = '[Zto Action System] Update Correlations',
  deleteCorrelation = '[Zto Action System] Delete Correlation',
  deleteCorrelations = '[Zto Action System] Delete Correlations',
  clearCorrelations = '[Zto Action System] Clear Correlations',
}

export class ZasLoadCorrelations implements Action {
  readonly type = ZasActionTypes.loadCorrelations;
  constructor(public payload: { correlations: ZtoCorrelation[] }) {}
}
export class ZasAddCorrelation implements Action {
  readonly type = ZasActionTypes.addCorrelation;
  constructor(public payload: { correlation: ZtoCorrelation, name: string, type: string }) {}
}
export class ZasUpsertCorrelation implements Action {
  readonly type = ZasActionTypes.upsertCorrelation;
  constructor(public payload: { correlation: ZtoCorrelation }) {}
}
export class ZasAddCorrelations implements Action {
  readonly type = ZasActionTypes.addCorrelations;
  constructor(public payload: { correlations: ZtoCorrelation[] }) {}
}
export class ZasUpsertCorrelations implements Action {
  readonly type = ZasActionTypes.upsertCorrelations;
  constructor(public payload: { correlations: ZtoCorrelation[] }) {}
}
export class ZasUpdateCorrelation implements Action {
  readonly type = ZasActionTypes.updateCorrelation;
  constructor(public payload: { correlation: Update<ZtoCorrelation>, name: string, type: string }) {}
}
export class ZasUpdateCorrelations implements Action {
  readonly type = ZasActionTypes.updateCorrelations;
  constructor(public payload: { correlations: Update<ZtoCorrelation>[] }) {}
}
export class ZasDeleteCorrelation implements Action {
  readonly type = ZasActionTypes.deleteCorrelation;
  constructor(public payload: { id: string }) {}
}
export class ZasDeleteCorrelations implements Action {
  readonly type = ZasActionTypes.deleteCorrelations;
  constructor(public payload: { ids: string[] }) {}
}
export class ZasClearCorrelations implements Action {
  readonly type = ZasActionTypes.clearCorrelations;
}
export type ZasCorrelationActionsUnion =
  | ZasLoadCorrelations
  | ZasAddCorrelation
  | ZasUpsertCorrelation
  | ZasAddCorrelations
  | ZasUpsertCorrelations
  | ZasUpdateCorrelation
  | ZasUpdateCorrelations
  | ZasDeleteCorrelation
  | ZasDeleteCorrelations
  | ZasClearCorrelations;
