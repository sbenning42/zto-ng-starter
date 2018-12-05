import { Observable, merge, of, concat, defer, empty, throwError, NEVER } from 'rxjs';
import { ZFlowFlow } from '../abstracts/z-flow-flow';
import { ZFlowTaskStep } from './z-flow-task-step';
import { ZFlowContextManager, ZFlowContext, ZFlowContextStatus } from './z-flow-context';
import { ZFlowTaskGraph, ZFlowTaskNode, ZFlowTaskNodeTraverseMode } from './z-flow-task-graph';
import { ZDictionnary } from '../helpers/z-tools';
import { ZFlowTask } from '../abstracts/z-flow-task';
import { ZFlowStoreService } from '../services/z-flow-store.service';
import {
  tap,
  catchError,
  reduce,
  filter,
  pluck,
  switchMap,
  take,
  takeWhile,
  distinctUntilChanged,
  concatMap,
  takeUntil,
  map
} from 'rxjs/operators';
import { ZFlowRetryDecision } from '../abstracts/z-flow-retry';

const HELP = {

  objExists: function <T = any>(obj: T): boolean { return obj !== undefined; },
  objNotExists: function <T = any>(obj: T): boolean { return obj === undefined; },

  objTruthy: function (obj: any): boolean { return !!obj; },

  arrObjToObj: (arr: ZDictionnary[] = []) =>
    arr
      .reduce((obj: ZDictionnary, dict: ZDictionnary) => ({ ...obj, ...dict }), new ZDictionnary()),


  mapReduceArrSelector: (selector: string = '', arrObj: ZDictionnary[] = []) =>
    arrObj
      .map(obj => obj[selector])
      .filter((innerArr: ZDictionnary[]) => !!innerArr)
      .reduce((arr: ZDictionnary[], innerArr: ZDictionnary[]) => [...arr, ...innerArr], []),

};

export class ZFlowEngineOptions {
  notifySteps?: boolean;
  flowDueTimeout?: number;
}

export class ZFlowEngine {

  private graph: ZFlowTaskGraph;
  private context: ZFlowContext;
  private manager: ZFlowContextManager;

  context$: Observable<ZFlowContext>; // does not complete
  whileContext$: Observable<ZFlowContext>; // complete on this.drop call

  messages$: Observable<ZFlowTaskStep>; // complete IF and on all this.graph.tree taskNode's messagesBus complete

  // All those Observable complete on this.drop call
  isIdle$: Observable<boolean>;
  isRunning$: Observable<boolean>;
  isPaused$: Observable<boolean>;
  isCanceled$: Observable<boolean>;
  isErrored$: Observable<boolean>;
  isResolved$: Observable<boolean>;

  idle$: Observable<ZFlowContextStatus>;
  running$: Observable<ZFlowContextStatus>;
  paused$: Observable<ZFlowContextStatus>;
  canceled$: Observable<ZFlowContextStatus>;
  errored$: Observable<ZFlowContextStatus>;
  resolved$: Observable<ZFlowContextStatus>;

  constructor(
    public flow: ZFlowFlow,
    public store: ZFlowStoreService,
    public injector: ZDictionnary = new ZDictionnary,
    public provide: ZDictionnary = new ZDictionnary,
  ) {
    this.setup();
    this.addContext();
  }

  private setup() {
    this.makeGraph();
    this.makeContext();
    this.makeManager();
    this.makeFeedbacks();
  }

  private makeGraph() {
    this.graph = new ZFlowTaskGraph(this.flow);
  }
  private makeContext() {
    const injectSymbolsAggregat = HELP.mapReduceArrSelector('injectSymbols', this.flow.tasks);
    const requiresSymbolsAggregat = HELP.mapReduceArrSelector('requiresSymbols', this.flow.tasks);
    const provideSymbolsAggregat = HELP.mapReduceArrSelector('provideSymbols', this.flow.tasks);
    const defProvideSymbolsAggregat = HELP.mapReduceArrSelector('defProvide', this.flow.tasks);
    const localDataPool = HELP.arrObjToObj([ defProvideSymbolsAggregat, this.provide ]);
    this.context = new ZFlowContext(
      this.flow.id,
      injectSymbolsAggregat,
      requiresSymbolsAggregat,
      provideSymbolsAggregat,
      localDataPool
    );
  }
  private makeManager() {
    this.manager = new ZFlowContextManager(this.context);
  }
  private makeFeedbacks() {
    const mapMessageBus = (task: ZFlowTask) => task.messageBus.asObservable();
    this.messages$ = merge(...this.flow.tasks.map(mapMessageBus));
  }

  private addContext() {
    const statusIs = (status: ZFlowContextStatus) => (innerStatus: ZFlowContextStatus) => status === innerStatus;
    const statusIsIdle = statusIs(ZFlowContextStatus.idle);
    const statusIsRunning = statusIs(ZFlowContextStatus.running);
    const statusIsPaused = statusIs(ZFlowContextStatus.paused);
    const statusIsCanceled = statusIs(ZFlowContextStatus.canceled);
    const statusIsErrored = statusIs(ZFlowContextStatus.errored);
    const statusIsResolved = statusIs(ZFlowContextStatus.resolved);
    const pluckStatus = pluck<ZFlowContext, ZFlowContextStatus>('status');

    this.store.addFlowContext(this.context);
    this.updateGlobalDataStore();

    this.context$ = this.store.flowContextById(this.context.id);
    this.whileContext$ = this.context$.pipe(takeWhile(HELP.objExists));

    const whileStatus$ = this.whileContext$.pipe(pluckStatus);

    this.isIdle$ = whileStatus$.pipe(map(statusIsIdle), distinctUntilChanged());
    this.idle$ = whileStatus$.pipe(filter(statusIsIdle), distinctUntilChanged());

    this.isRunning$ = whileStatus$.pipe(map(statusIsRunning), distinctUntilChanged());
    this.running$ = whileStatus$.pipe(filter(statusIsRunning), distinctUntilChanged());

    this.isPaused$ = whileStatus$.pipe(map(statusIsPaused), distinctUntilChanged());
    this.paused$ = whileStatus$.pipe(filter(statusIsPaused), distinctUntilChanged());

    this.isCanceled$ = whileStatus$.pipe(map(statusIsCanceled), distinctUntilChanged());
    this.canceled$ = whileStatus$.pipe(filter(statusIsCanceled), distinctUntilChanged());

    this.isErrored$ = whileStatus$.pipe(map(statusIsErrored), distinctUntilChanged());
    this.errored$ = whileStatus$.pipe(filter(statusIsErrored), distinctUntilChanged());

    this.isResolved$ = whileStatus$.pipe(map(statusIsResolved), distinctUntilChanged());
    this.resolved$ = whileStatus$.pipe(filter(statusIsResolved), distinctUntilChanged());

  }
  private updateContext(updateGlobalDataStore: boolean = false) {
    this.store.updateFlowContext({ id: this.context.id, changes: { ...this.context } });
    if (updateGlobalDataStore) {
      this.updateGlobalDataStore();
    }
  }
  private removeContext() {
    this.store.removeFlowContext(this.context.id);
  }

  private updateGlobalDataStore() {
    this.store.updateGlobalDataStore(this.context.localDataPool);
  }

  private step(provide?: ZDictionnary, finish: boolean = true) {
    this.context = this.manager.step(provide, finish);
    this.updateContext(true);
  }
  private error(error?: Error) {
    this.context = this.manager.error(error);
    this.updateContext();
  }
  private resolve(result?: ZDictionnary) {
    this.context = this.manager.resolve(result);
    this.updateContext(true);
  }

  private run(): Observable<ZDictionnary> {
    const onError = (error: Error) => {
      // @PRIVATE_NOTE: this.error must be call AFTER any retry logic
      this.error(error);
      return throwError(error);
    };
    // @PUBLIC_NOTE: concat take care to run ( node -> [node.childs] ) in serie
    // @PUBLIC_NOTE: merge take care to run ( [node.childs] ) in parallele
    const recTraverseGraph = (node: ZFlowTaskNode) => {
      const run$ = defer(() => concat(
        defer(() => this.runTask(node.task)),
        merge(...node.childs.map(recTraverseGraph))
      ));
      node.visit += 1;
      switch (node.traverseMode) {
        case ZFlowTaskNodeTraverseMode.firstParent:
          return node.visit === 1 ? run$ : empty();
        case ZFlowTaskNodeTraverseMode.lastParent:
          return ++node.visit >= node.parents.length ? run$ : empty();
        default:
          return empty();
      }
    };
    const flowExection$ = defer(() => {
      return recTraverseGraph(this.graph.tree).pipe(
        reduce((provide: ZDictionnary, partialProvide: ZDictionnary) => ({
          ...provide,
          ...partialProvide
        })),
        // @TODO handle retry/revert logic
        catchError(onError),
        takeUntil(this.canceled$),
      );
    });
    return flowExection$;
  }

  private runTask(task: ZFlowTask): Observable<ZDictionnary> {
    if (!task.execute) {
      return empty();
    }

    const aggregateEntries = (aggregate: any, [symbol, value]) => ({...aggregate, [symbol]: value});
    const findSymbol = (symbol: string) => ([sym]: [string, string]) => symbol === sym;
    const mapRebind = ([, to]: [string, string]) => to;
    const onlyNeeded = ([symbol]: [string, any]) => task.injectSymbols.includes(symbol);
    const rebind = (symbol: string) => {
      const rebinded = task.rebindSymbols ? task.rebindSymbols.find(findSymbol(symbol)) : undefined;
      return rebinded ? mapRebind(rebinded) : symbol;
    };
    const getSymbolLocalData = (symbol: string) => {
      const rebindedSymbol = rebind(symbol);
      return [rebindedSymbol, this.context.localDataPool[rebindedSymbol]];
    };
    const onExecuted = (provide?: ZDictionnary) => this.step(provide);
    const onRetryed = (provide?: ZDictionnary) => this.step(provide, false);

    const isRunning = (status: ZFlowContextStatus) => status === ZFlowContextStatus.running;
    const isPaused = (status: ZFlowContextStatus) => status === ZFlowContextStatus.paused;

    const executeTask = () => {

      task.injector = Object.entries(this.injector).filter(onlyNeeded).reduce(aggregateEntries, {});
      const taskRequires = task.requiresSymbols.map(getSymbolLocalData).reduce(aggregateEntries, {});

      const recRetryOrErrorLogic = (taskFactory: () => Observable<ZDictionnary>) => (error: Error) => {
        // @TODO: Handle history here
        if (
          task.retry === undefined
          || task.retry.onFailure(taskRequires, {}) !== ZFlowRetryDecision.retry
        ) {
          return throwError(error);
        } else if (!task.retry.execute) {
          return taskFactory();
        }
        const retry = () => task.retry.execute(taskRequires).pipe(
          take(1),
          tap(onRetryed),
          switchMap(() => taskFactory())
        );
        return defer(retry);
      };

      const taskExecution$ = this.whileContext$.pipe(
        pluck<ZFlowContext, ZFlowContextStatus>('status'),
        distinctUntilChanged(),
        // task Cancel logic + Resolved or Error cancel
        // concatMap + takeWhile = inclusive takeWhile
        concatMap((status: ZFlowContextStatus) => isRunning(status) || isPaused(status) ? of(status) : of(status, null)),
        takeWhile((status: ZFlowContextStatus) => !!status),
        // pause/resume logic + thanks to switchmap (and distinctUntilChanged) NEVER will be unsubscribe in any case
        switchMap((status: ZFlowContextStatus) => (isRunning(status) ? task.execute(taskRequires) : NEVER)),
        catchError(recRetryOrErrorLogic(executeTask)),
        take(1),
        tap(onExecuted),
      );
      return taskExecution$;
    };

    return defer(executeTask);
  }

  start(): Observable<ZDictionnary> {
    if (this.context.status !== ZFlowContextStatus.idle) {
      return throwError(new Error('Cannot start the same engine twice. Make a new engine instance instead.'));
    }
    const resolveOrNothing = () => this.context.status === ZFlowContextStatus.running
      ? this.resolve(this.context.localDataPool)
      : undefined;
    return defer(() => {
      this.context = this.manager.start();
      this.updateContext();
      return concat(
        this.run(),
        defer(resolveOrNothing),
      );
    });
  }
  pause() {
    if (this.context.status !== ZFlowContextStatus.running) {
      return throwError(new Error('Cannot pause a non running engine.'));
    }
    this.context = this.manager.pause();
    this.updateContext();
  }
  resume() {
    if (this.context.status !== ZFlowContextStatus.paused) {
      return throwError(new Error('Cannot resume a non paused engine.'));
    }
    this.context = this.manager.resume();
    this.updateContext();
  }
  cancel() {
    if (this.context.status !== ZFlowContextStatus.running && this.context.status !== ZFlowContextStatus.paused) {
      return throwError(new Error('Cannot cancel a non running|paused engine.'));
    }
    this.context = this.manager.cancel();
    this.updateContext();
  }
  drop() {
    this.removeContext();
  }
}
