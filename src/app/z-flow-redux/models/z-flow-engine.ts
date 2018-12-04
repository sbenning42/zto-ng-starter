import { Observable, merge, of, concat, defer, empty, throwError } from 'rxjs';
import { ZFlowFlow } from '../abstracts/z-flow-flow';
import { ZFlowTaskStep } from './z-flow-task-step';
import { ZFlowContextManager, ZFlowContext } from './z-flow-context';
import { ZFlowTaskGraph, ZFlowTaskNode } from './z-flow-task-graph';
import { ZDictionnary } from '../helpers/z-tools';
import { ZFlowTask } from '../abstracts/z-flow-task';
import { ZFlowStoreService } from '../services/z-flow-store.service';
import { tap, catchError, reduce } from 'rxjs/operators';

const HELP = {
  mapReduceArrSelector: (selector: string, arrObj: ZDictionnary[]) =>
    arrObj.map(obj => obj[selector])
    .reduce((arr: ZDictionnary[], dict: ZDictionnary) => ([...arr, dict])),
  arrObjToObj: (arr: ZDictionnary[]) =>
    arr.reduce((obj: ZDictionnary[], dict: ZDictionnary) => ({ ...obj, ...dict }), new ZDictionnary),
};

export class ZFlowEngine {

  private graph: ZFlowTaskGraph;
  private context: ZFlowContext;
  private manager: ZFlowContextManager;

  feedbacks$: Observable<ZFlowTaskStep>;

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
    const localDataPool = HELP.arrObjToObj([
      defProvideSymbolsAggregat,
      this.provide
    ]);
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
    const feedbacks = this.flow.tasks.map(mapFeedback);
    this.feedbacks$ = merge(...feedbacks);
  }

  private addContext() {
    this.store.addFlowContext(this.context);
  }
  private updateContext() {
    this.store.updateFlowContext({
      id: this.context.id,
      changes: {
        ...this.context
      }
    });
  }
  private removeContext() {
    this.store.removeFlowContext(this.context.id);
  }

  private step(provide?: ZDictionnary) {
    this.context = this.manager.step(provide);
    this.updateContext();
  }
  private error(error?: Error) {
    this.context = this.manager.error(error);
    this.updateContext();
    this.removeContext();
  }
  private resolve(result?: ZDictionnary) {
    this.context = this.manager.resolve(result);
    this.updateContext();
    this.removeContext();
  }

  private run(): Observable<ZDictionnary> {
    const onStart$ = defer(() => {
      this.start();
      return empty();
    });
    const onError = (error: Error) => {
      this.error(error);
      return throwError(error);
    };
    const onResolve = (result: ZDictionnary) => {
      this.resolve(result);
    };
    const traverseGraph = (node: ZFlowTaskNode) => defer(() => concat(
      this.runTask(node.task),
      merge(...node.childs.map(traverseGraph))
    ));
    const flowExection$ = traverseGraph(this.graph.tree).pipe(
      reduce((provide: ZDictionnary, partialProvide: ZDictionnary) => ({ ...provide, ...partialProvide }))
    );
    return defer(() => concat(onStart$, flowExection$).pipe(tap(onResolve), catchError(onError)));
  }

  private runTask(task: ZFlowTask): Observable<ZDictionnary> {
    const taskExecution$ = task.execute ? defer(() => {
      const findSymbol = (symbol: string) => ([sym]: [string, string]) => symbol === sym;
      const mapRebind = ([, to]: [string, string]) => to;
      const rebind = (symbol: string) => {
        const rebinded = task.rebindSymbols.find(findSymbol(symbol));
        return rebinded ? mapRebind(rebinded) : symbol;
      };
      const requires = task.requiresSymbols
        .map(symbol => rebind(symbol))
        .map(symbol => [symbol, this.context.localDataPool[symbol]])
        .reduce((localDataPool, [symbol, data]) => ({ ...localDataPool, [symbol]: data }));
      const onExecuted = (provide?: ZDictionnary) => this.step(provide);
      return task.execute(requires).pipe(tap(onExecuted));
    }) : empty();
    return taskExecution$;
  }

  start(): Observable<ZDictionnary> {
    this.context = this.manager.start();
    this.updateContext();
    return this.run();
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
    this.removeContext();
  }

}
