import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ZtoCorrelation } from './zas.models';

export interface ZasState extends EntityState<ZtoCorrelation> { }
export const zasStateAdapter: EntityAdapter<ZtoCorrelation> = createEntityAdapter<ZtoCorrelation>();
export const initialZasState: ZasState = zasStateAdapter.getInitialState({});
