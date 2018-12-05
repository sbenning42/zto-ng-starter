import { Observable, merge, of, concat, defer, empty, throwError, NEVER } from 'rxjs';
import { ZFlowFlow } from '../abstracts/z-flow-flow';
import { ZFlowTaskStep } from './z-flow-task-step';
import { ZFlowContextManager, ZFlowContext, ZFlowContextStatus } from './z-flow-context';
import { ZFlowTaskGraph, ZFlowTaskNode, ZFlowTaskNodeTraverseMode } from './z-flow-task-graph';
import { ZDictionnary } from '../helpers/z-tools';
import { ZFlowTask } from '../abstracts/z-flow-task';
import { ZFlowStoreService } from '../services/z-flow-store.service';
import { tap, catchError, reduce, filter, pluck, switchMap, take, takeWhile, distinctUntilChanged } from 'rxjs/operators';
import { ZFlowRetryDecision } from '../abstracts/z-flow-retry';

const HELP = {

  mapReduceArrSelector: (selector: string = '', arrObj: ZDictionnary[] = []) =>
    arrObj
      .map(obj => obj[selector])
      .filter((innerArr: ZDictionnary[]) => !!innerArr)
      .reduce((arr: ZDictionnary[], innerArr: ZDictionnary[]) => [...arr, ...innerArr], []),

  arrObjToObj: (arr: ZDictionnary[] = []) =>
    arr
      .reduce((obj: ZDictionnary, dict: ZDictionnary) => ({ ...obj, ...dict }), new ZDictionnary()),

};

export class ZFlowEngineOptions {
  notifySteps?: boolean;
  flowDueTimeout?: number;
}

export class ZFlowEngine {
  private graph: ZFlowTaskGraph;
  private context: ZFlowContext;
  private manager: ZFlowContextManager;
  private context$: Observable<ZFlowContext>;

  feedbacks$: Observable<ZFlowTaskStep>;

  constructor(
    public flow: ZFlowFlow,
    public store: ZFlowStoreService,
    public injector: ZDictionnary = new ZDictionnary(),
    public provide: ZDictionnary = new ZDictionnary(),
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
    const mapFeedback = (task: ZFlowTask) => task.feedback$;
    this.feedbacks$ = merge(...this.flow.tasks.map(mapFeedback));
  }

  private addContext() {
    this.store.addFlowContext(this.context);
    this.updateGlobalDataStore();
    this.context$ = this.store.flowContextById(this.context.id);
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

  private step(provide?: ZDictionnary) {
    this.context = this.manager.step(provide);
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
      // @TODO: this.error must be call AFTER any retry logic
      this.error(error);
      return throwError(error);
    };
    // concat take care to run ( node -> [node.childs] ) in serie
    // merge take care to run ( [node.childs] ) in parallele
    const recTraverseGraph = (node: ZFlowTaskNode) => {
      const run$ = defer(() => concat(
        defer(() => this.runTask(node.task)),
        merge(...node.childs.map(recTraverseGraph))
      ));
      node.visit += 1;
      switch (node.traverseMode) {
        case ZFlowTaskNodeTraverseMode.firstParent:
          return node.visit === 0 ? run$ : empty();
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
        catchError(onError)
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
    const isRunning = (status: ZFlowContextStatus) => status === ZFlowContextStatus.running;
    const isPaused = (status: ZFlowContextStatus) => status === ZFlowContextStatus.paused;

    const taskExecution = () => {
      task.injector = Object.entries(this.injector).filter(onlyNeeded).reduce(aggregateEntries, {});
      const taskRequires = task.requiresSymbols.map(getSymbolLocalData).reduce(aggregateEntries, {});
      const recRetryOrErrorLogic = (failedSourceFactory: () => Observable<ZDictionnary>) =>
        (error: Error) => {
          if (task.retry !== undefined) {
            const retryExecution$ = task.retry.execute
              ? defer(() => task.retry.execute(taskRequires).pipe(
                take(1),
                tap(onExecuted),
                switchMap(() => failedSourceFactory())
              ))
              : of({});
            // @TODO: Handle history here
            const decision = task.retry.onFailure(taskRequires, {});
            switch (decision) {
              case ZFlowRetryDecision.retry:
                return retryExecution$;
              default:
                return throwError(error);
            }
          }
          return throwError(error);
        };
      const taskExecution$ = this.context$.pipe(
        pluck<ZFlowContext, ZFlowContextStatus>('status'),
        distinctUntilChanged(),
        // task Cancel logic + Resolved or Error cancel
        takeWhile((status: ZFlowContextStatus) => isRunning(status) || isPaused(status)),
        // pause/resume logic + thanks to switchmap (and distinctUntilChanged) NEVER will be unsubscribe in any case
        switchMap((status: ZFlowContextStatus) => (isRunning(status) ? task.execute(taskRequires) : NEVER)),
        catchError(recRetryOrErrorLogic(() => taskExecution$)),
        take(1),
        tap(onExecuted),
      );
      return taskExecution$;
    };
    return defer(taskExecution);
  }

  start(): Observable<ZDictionnary> {
    return defer(() => {
      this.context = this.manager.start();
      this.updateContext();
      return concat(
        this.run(),
        defer(() => this.resolve(this.context.localDataPool)),
      );
    });
  }
  pause() {
    this.context = this.manager.pause();
    this.updateContext();
  }
  resume() {
    this.context = this.manager.resume();
    this.updateContext();
  }
  cancel() {
    this.context = this.manager.cancel();
    this.updateContext();
  }
  drop() {
    this.removeContext();
  }
}
