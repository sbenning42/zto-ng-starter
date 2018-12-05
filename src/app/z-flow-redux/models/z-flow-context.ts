import { ZDictionnary } from '../helpers/z-tools';

export enum ZFlowContextStatus {
  idle = '[Zto Flow Context Status] Idle',
  running = '[Zto Flow Context Status] Running',
  paused = '[Zto Flow Context Status] Paused',
  resolved = '[Zto Flow Context Status] Resolved',
  errored = '[Zto Flow Context Status] Errored',
  canceled = '[Zto Flow Context Status] Canceled'
}

export class ZFlowContext {

  status: ZFlowContextStatus = ZFlowContextStatus.idle;
  createdAt: number = Date.now();
  startedAt: number;
  pausedAt: number[] = [];
  resumedAt: number[] = [];
  finishStepAt: number[] = [];
  retryStepAt: number[] = [];
  finishAt: number;
  failure: Error;
  result: ZDictionnary;

  constructor(
    public id: string,
    public injectSymbolAggregat: string[] = [],
    public requiresSymbolAggregat: string[] = [],
    public provideSymbolAggregat: string[] = [],
    public localDataPool: ZDictionnary = new ZDictionnary()
  ) {}
}

export class ZFlowContextManager {
  constructor(public flowContext: ZFlowContext) {}
  private patch(changes: Partial<ZFlowContext>) {
    this.flowContext = {
      ...this.flowContext,
      ...changes
    };
  }
  start() {
    this.patch({ status: ZFlowContextStatus.running, startedAt: Date.now() });
    return this.flowContext;
  }
  pause() {
    this.patch({ status: ZFlowContextStatus.paused, pausedAt: [ ...this.flowContext.pausedAt, Date.now() ] });
    return this.flowContext;
  }
  resume() {
    this.patch({ status: ZFlowContextStatus.running, resumedAt: [ ...this.flowContext.resumedAt, Date.now() ] });
    return this.flowContext;
  }
  cancel() {
    this.patch({ status: ZFlowContextStatus.canceled, finishAt: Date.now() });
    return this.flowContext;
  }
  error(failure?: Error) {
    this.patch({ status: ZFlowContextStatus.errored, failure, finishAt: Date.now() });
    return this.flowContext;
  }
  step(partialLocalDataPool: ZDictionnary, finish: boolean = true) {
    this.patch({
      localDataPool: {
        ...this.flowContext.localDataPool,
        ...partialLocalDataPool
      },
      [(finish ? 'finishStepAt' : 'retryStepAt')]: [ ...this.flowContext[(finish ? 'finishStepAt' : 'retryStepAt')], Date.now() ],
    });
    return this.flowContext;
  }
  resolve(result?: ZDictionnary) {
    this.patch({
      status: ZFlowContextStatus.resolved,
      localDataPool: {
        ...this.flowContext.localDataPool,
        ...result
      },
      result, finishAt: Date.now()
    });
    return this.flowContext;
  }
}
