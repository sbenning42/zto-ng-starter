import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  ZtoCorrelation,
  ZtoCorrelationStatus,
  ZtoAction,
  ZtoMapAsyncCorrelation,
  ZtoAsyncCorrelationResolverOptions,
  ZtoAsyncCorrelationResolver,
  ZtoAsyncCorrelationAdapter,
  ZtoLazyAction,
  ZtoIndex,
  ZtoMapSequenceCorrelation,
  ZtoSequenceCorrelationResolverOptions,
  ZtoSequenceCorrelationResolver,
  ZtoSequenceCorrelationAdapter,
  ZtoFlowCorrelationAdapter,
  ZtoMapFlowCorrelation,
  ZtoFlowCorrelationResolver,
  ZtoFlowCorrelationResolverOptions
} from './zas.models';
import { ZasAddCorrelation, ZasUpdateCorrelation, ZasDeleteCorrelations } from './zas.actions';
import { first, distinctUntilChanged, takeWhile, concatMap, filter } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { selectCorrelationFactory, selectAllCorrelations } from './zas.selectors';


@Injectable()
export class ZasFacade {
  correlationResolvers: ZtoIndex<any> = {};
  constructor(private store: Store<any>) { }
  register(resolver: any) {
    this.correlationResolvers[resolver.type] = resolver;
  }
  registers(resolvers: ZtoIndex<any>) {
    Object.values(resolvers).forEach((resolver: any) => this.register(resolver));
  }
  registersAsArray(resolvers: any[]) {
    resolvers.forEach((resolver: any) => this.register(resolver));
  }
  dispatch(action: ZtoAction<any>) {
    const notEmpty = v => !!v;
    Object.values(action.correlations).filter(notEmpty).forEach((correlation: ZtoCorrelation) => this.process(correlation));
    this.store.dispatch(action);
  }
  selectStore<T = any>(selector: any): Observable<T> {
    return this.store.pipe<T>(select<T>(selector));
  }
  select(id: string): Observable<ZtoCorrelation> {
    const compareCorrelationStatuses = (c1: ZtoCorrelation, c2: ZtoCorrelation) => c1 && c2 && c1.status === c2.status;
    const notIdleNorPending = (correlation: ZtoCorrelation) => correlation
      && correlation.status !== ZtoCorrelationStatus.idle
      && correlation.status !== ZtoCorrelationStatus.pending;
    const completeAfterResolved = (correlation: ZtoCorrelation) => notIdleNorPending(correlation)
      ? of(correlation, null)
      : of(correlation);
    const notUndefined = (value: any) => value !== undefined;
    const notNull = (value: any) => value !== null;
    return this.store.pipe(
      select(selectCorrelationFactory(id)),
      filter(notUndefined),
      distinctUntilChanged(compareCorrelationStatuses),
      concatMap(completeAfterResolved),
      takeWhile(notNull)
    );
  }
  processFactory(correlation: ZtoCorrelation, params?: any): ZasAddCorrelation {
    return new ZasAddCorrelation({
      correlation: { ...correlation, status: ZtoCorrelationStatus.pending, params, processAt: Date.now() },
      name: correlation.name,
      type: correlation.type,
    });
  }
  resolveFactory(correlation: ZtoCorrelation, result?: any): ZasUpdateCorrelation {
    return new ZasUpdateCorrelation({
      correlation: { id: correlation.id, changes: { status: ZtoCorrelationStatus.success, result, resolvedAt: Date.now() } },
      name: correlation.name,
      type: correlation.type,
    });
  }
  errorFactory(correlation: ZtoCorrelation, error?: Error): ZasUpdateCorrelation {
    return new ZasUpdateCorrelation({
      correlation: {id: correlation.id, changes: { status: ZtoCorrelationStatus.error, error, resolvedAt: Date.now() }},
      name: correlation.name,
      type: correlation.type,
    });
  }
  cancelFactory(correlation: ZtoCorrelation): ZasUpdateCorrelation {
    return new ZasUpdateCorrelation({
      correlation: {id: correlation.id, changes: { status: ZtoCorrelationStatus.cancel, resolvedAt: Date.now() }},
      name: correlation.name,
      type: correlation.type,
    });
  }
  cancelIfNotResolvedFactory(id: string): () => void {
    let correlation: ZtoCorrelation;
    const observer = { next: (innerCorrelation: ZtoCorrelation) => correlation = innerCorrelation };
    const subscription: Subscription = this.select(id).subscribe(observer);
    return () => subscription.closed ? undefined : this.cancel(correlation);
  }
  process(correlation: ZtoCorrelation, params?: any) {
    this.store.dispatch(this.processFactory(correlation, params));
  }
  resolve(correlation: ZtoCorrelation, result?: any) {
    this.store.dispatch(this.resolveFactory(correlation, result));
  }
  error(correlation: ZtoCorrelation, error?: Error) {
    this.store.dispatch(this.errorFactory(correlation, error));
  }
  cancel(correlation: ZtoCorrelation) {
    this.store.dispatch(this.cancelFactory(correlation));
  }
  wasCanceledFactory(correlationOrId: string|ZtoCorrelation): Observable<ZtoCorrelation> {
    const wasCanceled = (correlation: ZtoCorrelation) => correlation.status === ZtoCorrelationStatus.cancel;
    const id = typeof (correlationOrId) === 'string' ? correlationOrId : correlationOrId.id;
    return this.select(id).pipe(filter(wasCanceled));
  }
  toLazy<T = any>(action: ZtoAction<T>): ZtoLazyAction {
    const cancel = (correlation: ZtoCorrelation) => this.cancelIfNotResolvedFactory(correlation.id);
    const cancels = (correlations: ZtoIndex<ZtoCorrelation>, correlation: ZtoCorrelation) => ({
      ...correlations,
      [correlation.name]: cancel(correlation),
    });
    const statusWas = (status: ZtoCorrelationStatus) =>
      (correlation: ZtoCorrelation) => correlation.status === status;
    const was = (status: ZtoCorrelationStatus) =>
      (correlations: ZtoIndex<ZtoCorrelation>, correlation: ZtoCorrelation) => ({
        ...correlations,
        [correlation.name]: this.select(correlation.id).pipe(filter(statusWas(status))),
      });
    const wasPendings = was(ZtoCorrelationStatus.pending);
    const wasResolveds = was(ZtoCorrelationStatus.success);
    const wasErroreds = was(ZtoCorrelationStatus.error);
    const wasCanceleds = was(ZtoCorrelationStatus.cancel);
    const notEmpty = v => !!v;
    const notEmptyCorrelations = Object.values(action.correlations).filter(notEmpty);
    return new ZtoLazyAction(
      action,
      () => this.dispatch(action),
      notEmptyCorrelations.reduce(wasPendings, {}),
      notEmptyCorrelations.reduce(wasResolveds, {}),
      notEmptyCorrelations.reduce(wasErroreds, {}),
      notEmptyCorrelations.reduce(wasCanceleds, {}),
      notEmptyCorrelations.reduce(cancels, {}),
    );
  }
  collectGarbage() {
    const notIdleNorPending = (correlation: ZtoCorrelation) => correlation.status !== ZtoCorrelationStatus.idle
      && correlation.status !== ZtoCorrelationStatus.pending;
    const pluckId = (correlation: ZtoCorrelation) => correlation.id;
    this.store.pipe(select(selectAllCorrelations), first()).subscribe(
      (correlations: ZtoCorrelation[]) => this.store.dispatch(new ZasDeleteCorrelations({
        ids: correlations.filter(notIdleNorPending).map(pluckId)
      }))
    );
  }
  baseAsyncResolver(
    type: string,
    factory: (mapAsync: ZtoMapAsyncCorrelation) => Observable<any>,
    options?: ZtoAsyncCorrelationResolverOptions,
  ): ZtoAsyncCorrelationResolver {
    return {
      type, factory,
      wasCanceledFactory: ({async}: ZtoMapAsyncCorrelation) => this.wasCanceledFactory(async),
      resolveFactory: ({ mapAsync: { async }, data }: ZtoAsyncCorrelationAdapter) => this.resolveFactory(async, data),
      errorFactory: ({ mapAsync: { async }, data }: ZtoAsyncCorrelationAdapter) => this.errorFactory(async, data),
      cancelFactory: ({ mapAsync: { async } }: ZtoAsyncCorrelationAdapter) => this.cancelFactory(async),
      options
    };
  }
  baseSequenceResolver(
    type: string,
    factories: ((mapSequence: ZtoMapSequenceCorrelation) => ZtoAction<any>)[],
    options?: ZtoSequenceCorrelationResolverOptions,
  ): ZtoSequenceCorrelationResolver {
    return {
      type, factories,
      process: (correlation: ZtoCorrelation) => this.process(correlation),
      select: (id: string) => this.select(id),
      wasCanceledFactory: ({sequence}: ZtoMapSequenceCorrelation) => this.wasCanceledFactory(sequence),
      resolveFactory: ({ mapSequence: { sequence }, data }: ZtoSequenceCorrelationAdapter) => this.resolveFactory(sequence, data),
      errorFactory: ({ mapSequence: { sequence }, data }: ZtoSequenceCorrelationAdapter) => this.errorFactory(sequence, data),
      cancelFactory: ({ mapSequence: { sequence } }: ZtoSequenceCorrelationAdapter) => this.cancelFactory(sequence),
      options
    };
  }
  baseFlowResolver(
    type: string,
    factories: {
      success?: (mapFlow: ZtoMapFlowCorrelation) => ZtoAction<any>[],
      error?: (mapFlow: ZtoMapFlowCorrelation) => ZtoAction<any>[],
      cancel?: (mapFlow: ZtoMapFlowCorrelation) => ZtoAction<any>[],
    },
    options?: ZtoFlowCorrelationResolverOptions,
  ): ZtoFlowCorrelationResolver {
    return {
      type, factories: {
        success: () => [],
        error: () => [],
        cancel: () => [],
        ...factories
      },
      process: (correlation: ZtoCorrelation) => this.process(correlation),
      select: (id: string) => this.select(id),
      wasCanceledFactory: ({flow}: ZtoMapFlowCorrelation) => this.wasCanceledFactory(flow),
      resolveFactory: ({ mapFlow: { flow }, data }: ZtoFlowCorrelationAdapter) => this.resolveFactory(flow, data),
      errorFactory: ({ mapFlow: { flow }, data }: ZtoFlowCorrelationAdapter) => this.errorFactory(flow, data),
      cancelFactory: ({ mapFlow: { flow } }: ZtoFlowCorrelationAdapter) => this.cancelFactory(flow),
      options
    };
  }
}
