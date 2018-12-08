import { ZFlowFlow } from '../../../z-flow-redux/abstracts/z-flow-flow';
import { LoggerFlowLog } from 'src/app/logger/z-flow/logger.flows';
import { ZFlowTask } from 'src/app/z-flow-redux/abstracts/z-flow-task';
import { LoggerTaskType, LoggerSymbol } from 'src/app/logger/z-flow/logger.tasks';
import { ToastTaskType, ToastSymbol } from 'src/app/toast/z-flow/toast.tasks';
import { ToastFlowOpen } from 'src/app/toast/z-flow/toast.flows';
import { StorageFlowLoad } from 'src/app/storage/z-flow/storage.flows';
import { StorageSymbol } from 'src/app/storage/z-flow/storage.tasks';
import { ZDictionnary } from 'src/app/z-flow-redux/helpers/z-tools';
import { delay, tap } from 'rxjs/operators';

export enum SampleFlowsSymbol {
  sample1LogBeforeMessages = '[Sample Flows Symbol] Sample 1 Log Before Messages',
  sample1LogAfterMessages = '[Sample Flows Symbol] Sample 1 Log After Messages',
  sample2LogBeforeMessages = '[Sample Flows Symbol] Sample 2 Log Before Messages',
  sample2LogAfterMessages = '[Sample Flows Symbol] Sample 2 Log After Messages',
  sample3LogBeforeMessages = '[Sample Flows Symbol] Sample 3 Log Before Messages',
  sample3LogAfterMessages = '[Sample Flows Symbol] Sample 3 Log After Messages',
  sample4LogBeforeMessages = '[Sample Flows Symbol] Sample 4 Log Before Messages',
  sample4LogAfterMessages = '[Sample Flows Symbol] Sample 4 Log After Messages',
  sample1ToastOpenBeforeMessage = '[Sample Flows Symbol] Sample 1 Toast Open Before Message',
  sample2ToastOpenBeforeMessage = '[Sample Flows Symbol] Sample 2 Toast Open Before Message',
  sample3ToastOpenBeforeMessage = '[Sample Flows Symbol] Sample 3 Toast Open Before Message',
  sample4ToastOpenBeforeMessage = '[Sample Flows Symbol] Sample 4 Toast Open Before Message',
  sample1ToastOpenAfterMessage = '[Sample Flows Symbol] Sample 1 Toast Open After Message',
  sample2ToastOpenAfterMessage = '[Sample Flows Symbol] Sample 2 Toast Open After Message',
  sample3ToastOpenAfterMessage = '[Sample Flows Symbol] Sample 3 Toast Open After Message',
  sample4ToastOpenAfterMessage = '[Sample Flows Symbol] Sample 4 Toast Open After Message',
}

export enum SampleFlowsFlowType {
  sample1 = '[Sample Flows Flow Type] Sample 1',
  sample2 = '[Sample Flows Flow Type] Sample 2',
  sample3 = '[Sample Flows Flow Type] Sample 3',
  sample4 = '[Sample Flows Flow Type] Sample 4',
}

const getTask = (type: string, tasks: ZFlowTask[]) => tasks.find(task => task.type === type);

export abstract class RebindFlowLoggerLog extends LoggerFlowLog {
  constructor(symbol: string) {
    super();
    const log = getTask(LoggerTaskType.log, this.tasks);
    log.rebindSymbols = [
      ...(log.rebindSymbols || []),
      [LoggerSymbol.logMessages, symbol],
    ];
  }
}
export abstract class RebindFlowToastOpen extends ToastFlowOpen {
  constructor(symbol: string) {
    super();
    const open = getTask(ToastTaskType.open, this.tasks);
    open.rebindSymbols = [
      ...(open.rebindSymbols || []),
      [ToastSymbol.openMessage, symbol],
    ];
  }
}
export class SampleFlowsRebindFlowLogBeforeSample1 extends RebindFlowLoggerLog {
  constructor() { super(SampleFlowsSymbol.sample1LogBeforeMessages); }
}
export class SampleFlowsRebindFlowLogAfterSample1 extends RebindFlowLoggerLog {
  constructor() { super(SampleFlowsSymbol.sample1LogAfterMessages); }
}
export class SampleFlowsRebindFlowToastOpenBeforeSample1 extends RebindFlowToastOpen {
  constructor() { super(SampleFlowsSymbol.sample1ToastOpenBeforeMessage); }
}
export class SampleFlowsRebindFlowToastOpenAfterSample1 extends RebindFlowToastOpen {
  constructor() { super(SampleFlowsSymbol.sample1ToastOpenAfterMessage); }
}

export class SampleFlowsRebindFlowLogBeforeSample2 extends RebindFlowLoggerLog {
  constructor() { super(SampleFlowsSymbol.sample2LogBeforeMessages); }
}
// The following shows how an extended Flow can override a particular task execution,
// and still be able to access the overriden execute method (aka: same as super.execute(...) in OOP)
// in that override function.

// It can be useful in order to access localDataPool/globalDataPool with
// an overriden requiresSymbols array for a particular task, and wrap the call
// to it's original execute method in an override method, who hook the engine and inject
// a reformated representation of some additional requires values who fit in the
// original requires values.

// If a call is made to the overriden/original execute method, "this" in original, can be dinamically re-bind to itself
// Look at the following const superLogExecute definition
export class SampleFlowsRebindFlowLogAfterSample2 extends RebindFlowLoggerLog {
  constructor() {
    super(SampleFlowsSymbol.sample2LogAfterMessages);
    // superLog will act as the "super" reference of the task we want to dynamically override
    const superLog = getTask(LoggerTaskType.log, this.tasks);
    // we first override it's requiresSymbols array by injecting StorageSymbol.storageEntries
    // we can do it, because we know that this flow (aka: SampleFlowsRebindFlowLogAfterSample2)
    // will be executed after another task or flow who will provide StorageSymbol.storageEntries value.
    superLog.requiresSymbols = [
      ...(superLog.requiresSymbols || []),
      StorageSymbol.storageEntries,
    ];
    // Now, because we don't want to re-implement the original logger.log's execute method
    // but still use StorageSymbol.storageEntries in it's payload/execute parameter (aka: LoggerSymbol.logMessages)
    // if and when the engine will choose to runs it, we'll grab and re-bind superLog.execute, and with that
    // sain reference we can now override the original (aka: in superLog)

    // We could instead override superLog.rebindSymbols but we would not have the opportunity to re-format
    // StorageSymbol.storageEntries value before mapping-it to LoggerSymbol.logMessages that way.
    // so, we grab superLog.execute, bind it to superLog and format a new LoggerSymbol.logMessages to
    // give to original superLog.execute
    const superLogExecute = superLog.execute.bind(superLog);
    // we keep also in mind that by extending RebindFlowLoggerLog, our message is
    // actualy in requires[LoggerSymbol.logMessages]
    // and not in requires[SampleFlowsSymbol.sample2LogAfterMessages]..
    superLog.execute = (requires: ZDictionnary) => {
      const overridenRequires = {
        [LoggerSymbol.logMessages]: [
          ...requires[LoggerSymbol.logMessages],
          ' and got localStorage entries: ',
          requires[StorageSymbol.storageEntries]
        ]
      };
      superLog.messageBus.next({ payload: { source: superLog.type, youCanHookHereToDoAdditionalThingsWith: requires } });
      return superLogExecute(overridenRequires).pipe(
        /*
        tap(() => {
          superLog.messageBus.next({ payload: { source: superLog.type, progress: 0 } });
        }),
        delay(5000),
        tap(() => {
          superLog.messageBus.next({ payload: { source: superLog.type, progress: 0.5 } });
        }),
        delay(5000),
        tap(() => {
          superLog.messageBus.next({ payload: { source: superLog.type, progress: 1 } });
        }),
        */
      );
    };

  }
}
export class SampleFlowsRebindFlowToastOpenBeforeSample2 extends RebindFlowToastOpen {
  constructor() { super(SampleFlowsSymbol.sample2ToastOpenBeforeMessage); }
}
export class SampleFlowsRebindFlowToastOpenAfterSample2 extends RebindFlowToastOpen {
  constructor() { super(SampleFlowsSymbol.sample2ToastOpenAfterMessage); }
}

export class SampleFlowsRebindFlowLogBeforeSample3 extends RebindFlowLoggerLog {
  constructor() { super(SampleFlowsSymbol.sample3LogBeforeMessages); }
}
export class SampleFlowsRebindFlowLogAfterSample3 extends RebindFlowLoggerLog {
  constructor() { super(SampleFlowsSymbol.sample3LogAfterMessages); }
}
export class SampleFlowsRebindFlowToastOpenBeforeSample3 extends RebindFlowToastOpen {
  constructor() { super(SampleFlowsSymbol.sample3ToastOpenBeforeMessage); }
}
export class SampleFlowsRebindFlowToastOpenAfterSample3 extends RebindFlowToastOpen {
  constructor() { super(SampleFlowsSymbol.sample3ToastOpenAfterMessage); }
}

export class SampleFlowsRebindFlowLogBeforeSample4 extends RebindFlowLoggerLog {
  constructor() { super(SampleFlowsSymbol.sample4LogBeforeMessages); }
}
export class SampleFlowsRebindFlowLogAfterSample4 extends RebindFlowLoggerLog {
  constructor() { super(SampleFlowsSymbol.sample4LogAfterMessages); }
}
export class SampleFlowsRebindFlowToastOpenBeforeSample4 extends RebindFlowToastOpen {
  constructor() { super(SampleFlowsSymbol.sample4ToastOpenBeforeMessage); }
}
export class SampleFlowsRebindFlowToastOpenAfterSample4 extends RebindFlowToastOpen {
  constructor() { super(SampleFlowsSymbol.sample4ToastOpenAfterMessage); }
}


export class SampleFlowsFlowSample1 extends ZFlowFlow {
  type = SampleFlowsFlowType.sample1;
  constructor() {
    super();
    const logBefore = new SampleFlowsRebindFlowLogBeforeSample1;
    const openToastBefore = new SampleFlowsRebindFlowToastOpenBeforeSample1;
    const loadStorage = new StorageFlowLoad;
    const logAfter = new SampleFlowsRebindFlowLogAfterSample1;
    const openToastAfter = new SampleFlowsRebindFlowToastOpenAfterSample1;

    this.addTask(logBefore, { root: true, target: false });
    this.addTask(openToastBefore, { root: true, target: false });
    this.addTask(loadStorage, { root: true, target: false });
    this.addTask(logAfter);
    this.addTask(openToastAfter);

    this.targets.push(loadStorage.targets[1]);

    this.addLink([loadStorage.targets[1], logAfter]);
    this.addLink([loadStorage.targets[1], openToastAfter]);

  }
}

export class SampleFlowsFlowSample2 extends ZFlowFlow {
  type = SampleFlowsFlowType.sample2;
  constructor() {
    super();
    const logBefore = new SampleFlowsRebindFlowLogBeforeSample2;
    const openToastBefore = new SampleFlowsRebindFlowToastOpenBeforeSample2;
    const loadStorage = new StorageFlowLoad;
    const logAfter = new SampleFlowsRebindFlowLogAfterSample2;
    const openToastAfter = new SampleFlowsRebindFlowToastOpenAfterSample2;

    this.addTask(logBefore, { root: true, target: false });
    this.addTask(openToastBefore, { root: true, target: false });
    this.addTask(loadStorage, { root: true, target: false });
    this.addTask(logAfter, { root: false, target: true });
    this.addTask(openToastAfter, { root: false, target: true });

    this.addLink([loadStorage.targets[1], logAfter]);
    this.addLink([loadStorage.targets[1], openToastAfter]);
  }
}

export class SampleFlowsFlowSample3 extends ZFlowFlow {
  type = SampleFlowsFlowType.sample3;
  constructor() {
    super();
  }
}

export class SampleFlowsFlowSample4 extends ZFlowFlow {
  type = SampleFlowsFlowType.sample4;
  constructor() {
    super();
  }
}
