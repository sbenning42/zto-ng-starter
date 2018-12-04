import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ZFlowState } from '../store/z-flow.state';
import { ZFlowContext } from '../models/z-flow-context';
import { EntityState, Update } from '@ngrx/entity';
import { ZDictionnary } from '../helpers/z-tools';
import { ZFlowContextAdd, ZFlowContextUpdate, ZFlowContextRemove, ZFlowGlobalDataPoolUpdate } from '../store/z-flow.actions';

@Injectable({
  providedIn: 'root'
})
export class ZFlowStoreService {

  zFlow$: Observable<ZFlowState>;
  flowContexts$: Observable<EntityState<ZFlowContext>>;
  globalDataPool$: Observable<ZDictionnary>;

  flowContextById: (id: string) => Observable<ZFlowContext>;
  globalData: (symbol: string) => Observable<any>;

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
