import * as uuid from 'uuid/v4';
import { Observable, defer, of, Subject, Subscription } from 'rxjs';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';

export interface ZtoUnique {
  readonly id: string;
}
export interface ZtoIndexable<T> {
  [key: string]: T;
}
export class ZtoIndex<T> implements ZtoIndexable<T> {
  [key: string]: T;
  constructor(arr: Array<T>, selector: string) {
    arr.forEach((item: T) => this[item[selector]] = item);
  }
}

export interface ZtoAction<T> {
  readonly type: string;
  payload?: T;
  correlations?: ZtoIndex<ZtoCorrelation>;
}
export interface ZtoDocument<T> extends ZtoAction<T> {
  readonly documentId: string;
}
export interface ZtoEvent<T> extends ZtoAction<T> {
  readonly createdAt: number;
}
export interface ZtoCommand<T> extends ZtoAction<T> {
  readonly commandId: string;
  readonly commandSrc: string;
}

export abstract class ZtoBaseAction<T> implements ZtoAction<T> {
  abstract readonly type: string;
  constructor(public payload?: T) {}
}
export abstract class ZtoBaseDocument<T> implements ZtoDocument<T> {
  abstract readonly type: string;
  readonly documentId: string = uuid();
  constructor(public payload?: T) {}
}
export abstract class ZtoBaseEvent<T> implements ZtoEvent<T> {
  abstract readonly type: string;
  readonly createdAt: number = Date.now();
  constructor(public payload?: T) {}
}
export abstract class ZtoBaseCommand<T> implements ZtoCommand<T> {
  abstract readonly type: string;
  readonly commandId: string = uuid();
  constructor(public readonly commandSrc: string, public payload?: T) {}
}
export abstract class ZtoBaseCommandWithoutSrc<T> extends ZtoBaseCommand<T> {
  abstract readonly type: string;
  constructor(payload?: T) {
    super('ZtoBaseCommandWithoutSrc', payload);
  }
}

export class ZtoBaseActionCreator<T> extends ZtoBaseAction<T> {
  constructor(public readonly type: string, payload?: T, public correlations?: ZtoIndex<ZtoCorrelation>) {
    super(payload);
  }
}
export class ZtoBaseDocumentCreator<T> extends ZtoBaseDocument<T> {
  constructor(public readonly type: string, payload?: T, public correlations?: ZtoIndex<ZtoCorrelation>) {
    super(payload);
  }
}
export class ZtoBaseEventCreator<T> extends ZtoBaseEvent<T> {
  constructor(public readonly type: string, payload?: T, public correlations?: ZtoIndex<ZtoCorrelation>) {
    super(payload);
  }
}
export class ZtoBaseCommandCreator<T> extends ZtoBaseCommand<T> {
  constructor(public readonly type: string, commandSrc: string, payload?: T, public correlations?: ZtoIndex<ZtoCorrelation>) {
    super(commandSrc, payload);
  }
}
export class ZtoBaseCommandWithoutSrcCreator<T> extends ZtoBaseCommandWithoutSrc<T> {
  constructor(public readonly type: string, payload?: T, public correlations?: ZtoIndex<ZtoCorrelation>) {
    super(payload);
  }
}

// T MUST implements ZtoAction<any>
export class ZtoLazyAction {
  private _closed: ZtoIndex<boolean> = {};
  private closed: Subject<ZtoIndex<boolean>> = new Subject;
  readonly closed$: Observable<ZtoIndex<boolean>>;
  constructor(
    public action: ZtoAction<any>,
    private dispatchFn: (action: ZtoAction<any>) => void,
    public wasPendings: ZtoIndex<Observable<ZtoCorrelation>>,
    public wasResolveds: ZtoIndex<Observable<ZtoCorrelation>>,
    public wasErroreds: ZtoIndex<Observable<ZtoCorrelation>>,
    public wasCanceleds: ZtoIndex<Observable<ZtoCorrelation>>,
    public cancels: ZtoIndex<() => void>,
  ) {
    this.closed$ = this.closed.asObservable();
    const observerFactory = (closed: boolean) => (name: string) => () => {
      this._closed[name] = closed;
      this.closed.next(this._closed);
    };
    const forEntryFactory = (closed: boolean) =>
      ([name, correlation$]) => correlation$.subscribe(observerFactory(closed)(name));
    Object.entries(wasPendings).forEach(forEntryFactory(false));
    Object.entries(wasResolveds).forEach(forEntryFactory(true));
    Object.entries(wasErroreds).forEach(forEntryFactory(true));
    Object.entries(wasCanceleds).forEach(forEntryFactory(true));
  }
  dispatch() {
    this.dispatchFn(this.action);
  }
}

export enum ZtoCorrelationStatus {
  idle = 'idle',
  pending = 'pending',
  success = 'success',
  error = 'error',
  cancel = 'cancel',
}
export interface ZtoCorrelation<T = any, U = any> extends ZtoUnique {
  readonly name: string;
  readonly type: string;
  status: ZtoCorrelationStatus;
  params?: T;
  result?: U;
  error?: Error;
  processAt?: number;
  resolvedAt?: number;
}
export abstract class ZtoBaseCorrelation<T = any, U = any> implements ZtoCorrelation<T, U> {
  abstract readonly name: string;
  readonly id = uuid();
  status = ZtoCorrelationStatus.idle;
  constructor(public type: string, public params?: T) {}
}
export class ZtoBaseCorrelationCreator<T = any, U = any> extends ZtoBaseCorrelation<T, U> {
  constructor(public readonly name: string, public type: string, params?: T) {
    super(type, params);
  }
}

/** ASYNC Correlation (comes with a set of rxjs custom operators) */
export class ZtoAsyncCorrelation<T = any, U = any> extends ZtoBaseCorrelation<T, U> {
  readonly name = 'async';
}
export interface ZtoMapAsyncCorrelation {
  action: ZtoAction<any>;
  async: ZtoCorrelation;
  result?: any;
  error?: Error;
  processAt?: number;
  resolvedAt?: number;
}
export interface ZtoAsyncCorrelationAdapter {
  mapAsync: ZtoMapAsyncCorrelation;
  status: ZtoCorrelationStatus;
  data?: any;
  processAt?: number;
  resolvedAt?: number;
}
export interface ZtoAsyncCorrelationResolverOptions {
  dueTimeout?: number;
  cancelOnTimeout?: boolean;
  delayTimeBeforeFactory?: number;
  delayTimeAfterFactory?: number;
  forceRandomErrorAtRate?: number;
}
export interface ZtoAsyncCorrelationResolver {
  type: string;
  factory: (mapAsync: ZtoMapAsyncCorrelation) => Observable<any>;
  wasCanceledFactory: (mapAsync: ZtoMapAsyncCorrelation) => Observable<any>;
  resolveFactory: (adapter: ZtoAsyncCorrelationAdapter) => ZtoAction<any>;
  errorFactory: (adapter: ZtoAsyncCorrelationAdapter) => ZtoAction<any>;
  cancelFactory?: (adapter: ZtoAsyncCorrelationAdapter) => ZtoAction<any>;
  options?: ZtoAsyncCorrelationResolverOptions;
}

/** SEQUENCE Correlation (comes with a set of rxjs custom operators) */
export class ZtoSequenceCorrelation<T = any, U = any> extends ZtoBaseCorrelation<T, U> {
  readonly name = 'sequence';
}
export interface ZtoMapSequenceCorrelation {
  action: ZtoAction<any>;
  sequence: ZtoCorrelation;
  result?: any;
  error?: Error;
  processAt?: number;
  resolvedAt?: number;
}
export interface ZtoSequenceCorrelationAdapter {
  mapSequence: ZtoMapSequenceCorrelation;
  status: ZtoCorrelationStatus;
  data?: any;
  processAt?: number;
  resolvedAt?: number;
}
export interface ZtoSequenceCorrelationResolverOptions {
  dueTimeout?: number;
  cancelOnTimeout?: boolean;
  delayTimeBeforeFactory?: number;
  delayTimeAfterFactory?: number;
}
export interface ZtoSequenceCorrelationResolver {
  type: string;
  factories: ((mapSequence: ZtoMapSequenceCorrelation) => ZtoAction<any>)[];
  process: (correlation: ZtoCorrelation) => void;
  select: (id: string) => Observable<ZtoCorrelation>;
  wasCanceledFactory: (mapSequence: ZtoMapSequenceCorrelation) => Observable<any>;
  resolveFactory: (adapter: ZtoSequenceCorrelationAdapter) => ZtoAction<any>;
  errorFactory: (adapter: ZtoSequenceCorrelationAdapter) => ZtoAction<any>;
  cancelFactory?: (adapter: ZtoSequenceCorrelationAdapter) => ZtoAction<any>;
  options?: ZtoSequenceCorrelationResolverOptions;
}

/** FLOW Correlation (comes with a set of rxjs custom operators) */
export class ZtoFlowCorrelation<T = any, U = any> extends ZtoBaseCorrelation<T, U> {
  readonly name = 'flow';
}
export interface ZtoMapFlowCorrelation {
  action: ZtoAction<any>;
  flow: ZtoCorrelation;
  result?: any;
  error?: Error;
  processAt?: number;
  resolvedAt?: number;
}
export interface ZtoFlowCorrelationAdapter {
  mapFlow: ZtoMapFlowCorrelation;
  status: ZtoCorrelationStatus;
  data?: any;
  processAt?: number;
  resolvedAt?: number;
}
export interface ZtoFlowCorrelationResolverOptions {
  dueTimeout?: number;
  cancelOnTimeout?: boolean;
  delayTimeBeforeFactory?: number;
  delayTimeAfterFactory?: number;
}
export interface ZtoFlowCorrelationResolver {
  type: string;
  factories: {
    success?: (mapFlow: ZtoMapFlowCorrelation) => ZtoAction<any>[],
    error?: (mapFlow: ZtoMapFlowCorrelation) => ZtoAction<any>[],
    cancel?: (mapFlow: ZtoMapFlowCorrelation) => ZtoAction<any>[],
  };
  process: (correlation: ZtoCorrelation) => void;
  select: (id: string) => Observable<ZtoCorrelation>;
  wasCanceledFactory: (mapFlow: ZtoMapFlowCorrelation) => Observable<any>;
  resolveFactory: (adapter: ZtoFlowCorrelationAdapter) => ZtoAction<any>;
  errorFactory: (adapter: ZtoFlowCorrelationAdapter) => ZtoAction<any>;
  cancelFactory?: (adapter: ZtoFlowCorrelationAdapter) => ZtoAction<any>;
  options?: ZtoFlowCorrelationResolverOptions;
}

