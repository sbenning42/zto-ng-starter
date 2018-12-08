import { Injectable } from '@angular/core';
import { Store, select, createSelector } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ZFlowState, zFlowStateflowContextsAdapter, initialZFlowState } from '../store/z-flow.state';
import { ZFlowContext } from '../models/z-flow-context';
import { EntityState, Update } from '@ngrx/entity';
import { ZDictionnary, noOp } from '../helpers/z-tools';
import { ZFlowContextAdd, ZFlowContextUpdate, ZFlowContextRemove, ZFlowGlobalDataPoolUpdate } from '../store/z-flow.actions';
import { zFlowStoreSelector } from '../store/z-flow.reducer';
import { map, filter } from 'rxjs/operators';

export enum GlobalDataPoolUpdateMode {
  remplace = '[Global DataPool Update Mode] Remplace',
  merge = '[Global DataPool Update Mode] Merge',
  custom = '[Global DataPool Update Mode] Custom',
}

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

  private lastGlobalDataPoolState: ZDictionnary = initialZFlowState.globalDataPool;

  zFlow$: Observable<ZFlowState> = this.store.pipe(select(selectZFlow));

  flowContexts$: Observable<EntityState<ZFlowContext>> = this.store.pipe(select(selectFlowContexts));
  globalDataPool$: Observable<ZDictionnary> = this.store.pipe(select(selectGlobalDataPool));

  flowContextById: (id: string) => Observable<ZFlowContext> = (id: string) => this.store.pipe(
    select(selectEntitiesFlowContexts),
    map((flowContexts: ZDictionnary<ZFlowContext>) => flowContexts[id]),
  )
  globalData: <T = any>(symbol: string) => Observable<T> = <T>(symbol: string) => this.store.pipe(
    select(selectGlobalDataPool),
    map<ZDictionnary, T>((globalDataPool: ZDictionnary) => globalDataPool[symbol])
  )

  constructor(private store: Store<any>) { }

  globalDataPoolSnapshot(): ZDictionnary {
    return { ...this.lastGlobalDataPoolState };
  }

  addFlowContext(flowContext: ZFlowContext) {
    this.store.dispatch(new ZFlowContextAdd(flowContext));
  }
  updateFlowContext(update: Update<ZFlowContext>) {
    this.store.dispatch(new ZFlowContextUpdate(update));
  }
  removeFlowContext(id: string) {
    this.store.dispatch(new ZFlowContextRemove(id));
  }

  updateGlobalDataStore(
    dataPool: Partial<ZDictionnary>,
    updateMode: GlobalDataPoolUpdateMode = GlobalDataPoolUpdateMode.remplace,
    transformDataPoolFn: (dPool: Partial<ZDictionnary>) => Partial<ZDictionnary> = noOp
  ) {

    let payload;
    const mergeData = (old, now) => {
      const transform = Array.isArray(old) ? [...old, ...now] : { ...old, ...now };
      return transform;
    };
    const mergePoolSymbols = (pool, [symbol, data]) => ({ ...pool, [symbol]: mergeData(pool[symbol], data) });

    switch (updateMode) {
      case GlobalDataPoolUpdateMode.merge:
        payload = Object.entries(dataPool)
          .reduce(mergePoolSymbols, this.lastGlobalDataPoolState);
        break;
      case GlobalDataPoolUpdateMode.custom:
        payload = transformDataPoolFn(dataPool);
        break;
      case GlobalDataPoolUpdateMode.remplace:
      default:
        payload = dataPool;
        break;
    }

    this.store.dispatch(new ZFlowGlobalDataPoolUpdate(payload));
    this.lastGlobalDataPoolState = {
      ...this.lastGlobalDataPoolState,
      ...payload
    };
  }
}
