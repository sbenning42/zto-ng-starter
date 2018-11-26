import { MonoTypeOperatorFunction, Observable, of, defer, NEVER, timer, throwError, concat, zip, from } from 'rxjs';
import {
  ZtoAction,
  ZtoMapAsyncCorrelation,
  ZtoAsyncCorrelationAdapter,
  ZtoCorrelationStatus,
  ZtoAsyncCorrelationResolver,
  ZtoAsyncCorrelationResolverOptions,
  ZtoSequenceCorrelationResolverOptions,
  ZtoSequenceCorrelationResolver,
  ZtoMapSequenceCorrelation,
  ZtoSequenceCorrelationAdapter,
  ZtoCorrelation,
  ZtoIndex,
  ZtoFlowCorrelationResolverOptions,
  ZtoFlowCorrelationResolver,
  ZtoMapFlowCorrelation,
  ZtoFlowCorrelationAdapter
} from './zas.models';
import { filter, map, mergeMap, take, timeout, catchError, takeUntil, switchMap, first, delay, last, tap } from 'rxjs/operators';

export function NOOP() {}

/**ASYNC Correlation */
export function zasPrepareAsyncResolverOptions(options: ZtoAsyncCorrelationResolverOptions = {}): ZtoAsyncCorrelationResolverOptions {
  return {
    dueTimeout: 30000,
    delayTimeBeforeFactory: 0,
    delayTimeAfterFactory: 0,
    cancelOnTimeout: false,
    forceRandomErrorAtRate: 0,
    ...options,
  };
}
export function zasInterpretAsyncCorrelation(
  resolvers: ZtoIndex<ZtoAsyncCorrelationResolver>,
): MonoTypeOperatorFunction<ZtoAction<any>> {
  const hasAsyncCorrelation = (action: ZtoAction<any>) => !!(action.correlations && action.correlations.async);
  const mapAsyncCorrelation = (action: ZtoAction<any>) => ({ action, async: action.correlations.async });

  /**OnCancel */
  const adaptCancel = (mapAsync: ZtoMapAsyncCorrelation) => ({ mapAsync, status: ZtoCorrelationStatus.cancel });
  /**OnSuccess */
  const adaptSuccess = (mapAsync: ZtoMapAsyncCorrelation) => result => ({mapAsync, status: ZtoCorrelationStatus.success, data: result});

  /**OnError */
  const adaptCatchedErrorWithTimeoutError = (mapAsync: ZtoMapAsyncCorrelation) => (error: Error) => defer(
    () => of({ mapAsync, status: ZtoCorrelationStatus.error, data: error })
  );
  const adaptCatchedErrorWithCancelOnTimeout = (mapAsync: ZtoMapAsyncCorrelation) => (error: Error) => defer(
    () => of(error.name === 'TimeoutError' ? adaptCancel(mapAsync) : { mapAsync, status: ZtoCorrelationStatus.error, data: error })
  );
  const adaptCatchedError = (mapAsync: ZtoMapAsyncCorrelation) => options(mapAsync).cancelOnTimeout
    ? adaptCatchedErrorWithCancelOnTimeout(mapAsync)
    : adaptCatchedErrorWithTimeoutError(mapAsync);

  const resolverFactory = (mapAsync: ZtoMapAsyncCorrelation) => resolvers[`${mapAsync.action.type}@async`];
  const adaptResponse = (adapter: ZtoAsyncCorrelationAdapter) => adapter.status === ZtoCorrelationStatus.success
    ? resolverFactory(adapter.mapAsync).resolveFactory(adapter)
    : (
      adapter.status === ZtoCorrelationStatus.cancel
        ? resolverFactory(adapter.mapAsync).cancelFactory(adapter)
        : resolverFactory(adapter.mapAsync).errorFactory(adapter)
    );

  const options = (mapAsync: ZtoMapAsyncCorrelation) => zasPrepareAsyncResolverOptions(resolverFactory(mapAsync).options);
  return (actions: Observable<ZtoAction<any>>) => actions.pipe(
    filter(hasAsyncCorrelation),
    map(mapAsyncCorrelation),
    mergeMap((mapAsync: ZtoMapAsyncCorrelation) => timer(options(mapAsync).delayTimeBeforeFactory).pipe(first(),
      switchMap(() => (
        options((mapAsync)).forceRandomErrorAtRate !== 0 && Math.random() < options((mapAsync)).forceRandomErrorAtRate
          ? throwError(new Error(`zasInterpretAsyncCorrelation Random Error at rate: ${options((mapAsync)).forceRandomErrorAtRate}`))
          : resolverFactory(mapAsync).factory(mapAsync)
        ).pipe(
          delay(options((mapAsync)).delayTimeAfterFactory),
          take(1),
          map(adaptSuccess(mapAsync)),
          takeUntil(resolverFactory(mapAsync).wasCanceledFactory(mapAsync)),
          timeout(options((mapAsync)).dueTimeout),
          catchError(adaptCatchedError(mapAsync)),
          map(adaptResponse)
        )
      )
    ))
  );
}

/**SEQUENCE Correlation */
export function zasPrepareSequenceResolverOptions(
  options: ZtoSequenceCorrelationResolverOptions = {}
): ZtoSequenceCorrelationResolverOptions {
  return {
    dueTimeout: 30000,
    delayTimeBeforeFactory: 0,
    delayTimeAfterFactory: 0,
    cancelOnTimeout: false,
    ...options,
  };
}
export function zasInterpretSequenceCorrelation(
  resolvers: ZtoIndex<ZtoSequenceCorrelationResolver>,
): MonoTypeOperatorFunction<ZtoAction<any>> {
  const hasSequenceCorrelation = (action: ZtoAction<any>) => !!(action.correlations && action.correlations.sequence);
  const mapSequenceCorrelation = (action: ZtoAction<any>) => ({ action, sequence: action.correlations.sequence });

  const resolverFactory = (mapSequence: ZtoMapSequenceCorrelation) => resolvers[`${mapSequence.action.type}@sequence`];
  /**OnCancel */
  const adaptCancel = (mapSequence: ZtoMapSequenceCorrelation) => ({ mapSequence, status: ZtoCorrelationStatus.cancel });
  /**OnSuccess */
  const adaptSuccess = (mapSequence: ZtoMapSequenceCorrelation) =>
    result => ({ mapSequence, status: ZtoCorrelationStatus.success, data: result });

  /**OnError */
  const adaptError = (mapSequence: ZtoMapSequenceCorrelation) =>
    error => ({ mapSequence, status: ZtoCorrelationStatus.error, data: error });
  const adaptResponse = (adapter: ZtoSequenceCorrelationAdapter) => adapter.status === ZtoCorrelationStatus.success
    ? resolverFactory(adapter.mapSequence).resolveFactory(adapter)
    : (
      adapter.status === ZtoCorrelationStatus.cancel
        ? resolverFactory(adapter.mapSequence).cancelFactory(adapter)
        : resolverFactory(adapter.mapSequence).errorFactory(adapter)
    );

  const options = (mapSequence: ZtoMapSequenceCorrelation) => zasPrepareSequenceResolverOptions(resolverFactory(mapSequence).options);

  const notEmpty = v => !!v;

  return (actions: Observable<ZtoAction<any>>) => actions.pipe(
    filter(hasSequenceCorrelation),
    map(mapSequenceCorrelation),
    mergeMap((mapSequence: ZtoMapSequenceCorrelation) => {
      const toResolve = [];
      return concat(
        timer(options(mapSequence).delayTimeBeforeFactory).pipe(
          mergeMap(() => {
            return resolverFactory(mapSequence).factories.map((factory) => {
              const sequecedAction = factory(mapSequence);
              Object.values(sequecedAction.correlations).filter(notEmpty).forEach((correlation: ZtoCorrelation) => {
                toResolve.push(resolverFactory(mapSequence).select(correlation.id).pipe(last()));
                resolverFactory(mapSequence).process(correlation);
              });
              return sequecedAction;
            });
          }),
        ),
        defer(() => zip(...toResolve).pipe(
          map((aggregat: ZtoCorrelation[]) => {
            if (aggregat.some((correlation: ZtoCorrelation) => correlation.status === ZtoCorrelationStatus.cancel)) {
              return adaptCancel(mapSequence);
            } else if (aggregat.some((correlation: ZtoCorrelation) => correlation.status === ZtoCorrelationStatus.error)) {
              return adaptError(mapSequence)(aggregat);
            } else {
              return adaptSuccess(mapSequence)(aggregat);
            }
          }),
          map(adaptResponse),
          takeUntil(resolverFactory(mapSequence).wasCanceledFactory(mapSequence)),
        ))
      );
    })
  );
}

/**FLOW Correlation */
export function zasPrepareFlowResolverOptions(
  options: ZtoFlowCorrelationResolverOptions = {}
): ZtoFlowCorrelationResolverOptions {
  return {
    dueTimeout: 30000,
    delayTimeBeforeFactory: 0,
    delayTimeAfterFactory: 0,
    cancelOnTimeout: false,
    ...options,
  };
}
export function zasInterpretFlowCorrelation(
  resolvers: ZtoIndex<ZtoFlowCorrelationResolver>,
): MonoTypeOperatorFunction<ZtoAction<any>> {
  const hasFlowCorrelation = (action: ZtoAction<any>) => !!(action.correlations && action.correlations.flow);
  const mapFlowCorrelation = (action: ZtoAction<any>) => ({ action, flow: action.correlations.flow });

  const resolverFactory = (mapFlow: ZtoMapFlowCorrelation) => resolvers[`${mapFlow.action.type}@flow`];
  /**OnCancel */
  const adaptCancel = (mapFlow: ZtoMapFlowCorrelation) => ({ mapFlow, status: ZtoCorrelationStatus.cancel });
  /**OnSuccess */
  const adaptSuccess = (mapFlow: ZtoMapFlowCorrelation) =>
    result => ({ mapFlow, status: ZtoCorrelationStatus.success, data: result });

  /**OnError */
  const adaptError = (mapFlow: ZtoMapFlowCorrelation) =>
    error => ({ mapFlow, status: ZtoCorrelationStatus.error, data: error });
  const adaptResponse = (adapter: ZtoFlowCorrelationAdapter) => adapter.status === ZtoCorrelationStatus.success
    ? [
      ZtoCorrelationStatus.success,
      ...resolverFactory(adapter.mapFlow).factories.success({...adapter.mapFlow, result: adapter.data})
    ]
    : (
      adapter.status === ZtoCorrelationStatus.cancel
        ? [
          ZtoCorrelationStatus.cancel,
          ...resolverFactory(adapter.mapFlow).factories.cancel({...adapter.mapFlow, result: adapter.data}),
        ]
        : [
          ZtoCorrelationStatus.error,
          ...resolverFactory(adapter.mapFlow).factories.error({...adapter.mapFlow, error: adapter.data}),
        ]
    );

  const innerAdaptResponse = (adapter: ZtoFlowCorrelationAdapter) => adapter.status === ZtoCorrelationStatus.success
    ? resolverFactory(adapter.mapFlow).resolveFactory(adapter)
    : (
      adapter.status === ZtoCorrelationStatus.cancel
        ? resolverFactory(adapter.mapFlow).cancelFactory(adapter)
        : resolverFactory(adapter.mapFlow).errorFactory(adapter)
    );

  const options = (mapFlow: ZtoMapFlowCorrelation) => zasPrepareFlowResolverOptions(resolverFactory(mapFlow).options);

  const notEmpty = v => !!v;

  return (actions: Observable<ZtoAction<any>>) => actions.pipe(
    filter(hasFlowCorrelation),
    map(mapFlowCorrelation),
    mergeMap((mapFlow: ZtoMapFlowCorrelation) => {
      const toResolve = Object.values(mapFlow.action.correlations)
        .filter((correlation: ZtoCorrelation) => correlation && correlation.name !== 'flow')
        .map((correlation: ZtoCorrelation) => resolverFactory(mapFlow).select(correlation.id).pipe(last()));
      return timer(options(mapFlow).delayTimeBeforeFactory).pipe(
        switchMap(() => {
          return defer(() => zip(...toResolve).pipe(
            map((aggregat: ZtoCorrelation[]) => {
              if (aggregat.some((correlation: ZtoCorrelation) => correlation.status === ZtoCorrelationStatus.cancel)) {
                return adaptCancel(mapFlow);
              } else if (aggregat.some((correlation: ZtoCorrelation) => correlation.status === ZtoCorrelationStatus.error)) {
                return adaptError(mapFlow)(aggregat);
              } else {
                return adaptSuccess(mapFlow)(aggregat);
              }
            }),
            map(adaptResponse),
            mergeMap(([status, ...toResponde]: ZtoAction<any>[]) => {
              const innerToResolve = [];
              toResponde.forEach(tr => {
                Object.values(tr.correlations).filter(notEmpty).forEach(correlation => {
                  resolverFactory(mapFlow).process(correlation);
                  innerToResolve.push(resolverFactory(mapFlow).select(correlation.id).pipe(last()));
                });
              });
              return concat(from(toResponde), zip(...innerToResolve).pipe(
                map((flowAggregat: ZtoCorrelation[]) => {
                  if (flowAggregat.some((correlation: ZtoCorrelation) =>
                    correlation.status === ZtoCorrelationStatus.cancel)
                    || (status as any as ZtoCorrelationStatus) === ZtoCorrelationStatus.cancel) {
                    return adaptCancel(mapFlow);
                  } else if (flowAggregat.some((correlation: ZtoCorrelation) =>
                    correlation.status === ZtoCorrelationStatus.error)
                    || (status as any as ZtoCorrelationStatus) === ZtoCorrelationStatus.error) {
                    return adaptError(mapFlow)(flowAggregat);
                  } else {
                    return adaptSuccess(mapFlow)(flowAggregat);
                  }
                }),
                map(innerAdaptResponse),
              ));
            }),
            takeUntil(resolverFactory(mapFlow).wasCanceledFactory(mapFlow)),
          ));
        }),
      );
    })
  );
}
