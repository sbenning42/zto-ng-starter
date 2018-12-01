import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ZtoTaskflowState, ZtoTaskflowFlowContext } from './zto-taskflow.state';
import {
  selectZtoTaskflowState,
  selectZtoTaskflowFlowContextsState,
  selectZtoTaskflowFlowContextsStateById
} from './zto-taskflow.selectors';
import {
  ZtoTaskflowAddFlowContext,
  ZtoTaskflowAddFlowContexts,
  ZtoTaskflowDeleteFlowContexts,
  ZtoTaskflowDeleteFlowContext,
  ZtoTaskflowUpdateFlowContext,
  ZtoTaskflowUpdateFlowContexts,
} from './zto-taskflow.actions';
import { EntityState } from '@ngrx/entity';

@Injectable()
export class ZtoTaskflowFacade {

  taskflow$: Observable<ZtoTaskflowState> = this.store.pipe(
    select(selectZtoTaskflowState)
  );
  flowContexts$: Observable<EntityState<ZtoTaskflowFlowContext>> = this.store.pipe(
    select(selectZtoTaskflowFlowContextsState)
  );

  flowContextById: (id: string) => Observable<ZtoTaskflowFlowContext> = (id: string) => this.store.pipe(
    select(selectZtoTaskflowFlowContextsStateById(id))
  )

  constructor(private store: Store<any>) { }

  add(context_s: ZtoTaskflowFlowContext | Array<ZtoTaskflowFlowContext>) {
    this.store.dispatch(
      Array.isArray(context_s)
        ? new ZtoTaskflowAddFlowContexts(context_s)
        : new ZtoTaskflowAddFlowContext(context_s)
    );
  }

  update(context_s: ZtoTaskflowFlowContext | Array<ZtoTaskflowFlowContext>) {
    this.store.dispatch(
      Array.isArray(context_s)
        ? new ZtoTaskflowUpdateFlowContexts(context_s.map(context => ({ id: context.id, changes: { ...context } })))
        : new ZtoTaskflowUpdateFlowContext({ id: context_s.id, changes: { ...context_s } })
    );
  }

  delete(context_s: ZtoTaskflowFlowContext | Array<ZtoTaskflowFlowContext>) {
    this.store.dispatch(
      Array.isArray(context_s)
        ? new ZtoTaskflowDeleteFlowContexts(context_s.map(context => context.id))
        : new ZtoTaskflowDeleteFlowContext(context_s.id)
    );
  }

}
