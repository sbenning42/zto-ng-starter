import { Injectable } from '@angular/core';
import { Store, select, createSelector } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ZFlowState, zFlowStateflowContextsAdapter } from '../store/z-flow.state';
import { ZFlowContext } from '../models/z-flow-context';
import { EntityState, Update } from '@ngrx/entity';
import { ZDictionnary } from '../helpers/z-tools';
import { ZFlowContextAdd, ZFlowContextUpdate, ZFlowContextRemove, ZFlowGlobalDataPoolUpdate } from '../store/z-flow.actions';
import { zFlowStoreSelector } from '../store/z-flow.reducer';
import { map, filter } from 'rxjs/operators';

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = zFlowStateflowContextsAdapter.getSelectors();


const selectZFlow = (store: any) => store[zFlowStoreSelector] as ZFlowState;
const selectFlowContexts = createSelector(selectZFlow, (state: ZFlowState) => state.flowContexts);
const selectGlobalDataPool = createSelector(selectZFlow, (state: ZFlowState) => state.globalDataPool);

const selectAllFlowContexts = createSelector(selectFlowContexts, selectAll);
const selectEntitiesFlowContexts = createSelector(selectFlowContexts, selectEntities);
const selectIdsFlowContexts = createSelector(selectFlowContexts, selectIds);
const selectTotalFlowContexts = createSelector(selectFlowContexts, selectTotal);

@Injectable({
  providedIn: 'root'
})
export class ZFlowStoreService {

  zFlow$: Observable<ZFlowState> = this.store.pipe(select(selectZFlow));

  flowContexts$: Observable<EntityState<ZFlowContext>> = this.store.pipe(select(selectFlowContexts));
  globalDataPool$: Observable<ZDictionnary> = this.store.pipe(select(selectGlobalDataPool));

  flowContextById: (id: string) => Observable<ZFlowContext> = (id: string) => this.store.pipe(
    select(selectEntitiesFlowContexts),
    map((flowContexts: ZDictionnary<ZFlowContext>) => flowContexts[id]),
  )
  globalData: (symbol: string) => Observable<any> = (symbol: string) => this.store.pipe(
    select(selectGlobalDataPool),
    map((globalDataPool: ZDictionnary) => globalDataPool[symbol])
  )

  constructor(private store: Store<any>) { }

  addFlowContext(flowContext: ZFlowContext) {
    this.store.dispatch(new ZFlowContextAdd(flowContext));
  }
  updateFlowContext(update: Update<ZFlowContext>) {
    this.store.dispatch(new ZFlowContextUpdate(update));
  }
  removeFlowContext(id: string) {
    this.store.dispatch(new ZFlowContextRemove(id));
  }

  updateGlobalDataStore(dataPool: Partial<ZDictionnary>) {
    this.store.dispatch(new ZFlowGlobalDataPoolUpdate(dataPool));
  }
}
