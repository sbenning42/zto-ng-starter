import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';
import { LoggerTaskLog, LoggerTaskError } from './logger.tasks';
import { ZtoTaskflowEngine } from '../../../zto-task-flow/pattern-engine/zto-taskflow-engine.model';
import { ZtoTaskflowFacade } from '../../../zto-task-flow/pattern-store/zto-taskflow.facade';
import { ZtoTaskflowFlow } from 'src/app/zto-task-flow/pattern-components/flow/zto-taskflow-flow.abstract';
import { ZtoDictionnary } from 'src/app/zto-task-flow/helpers/zto-dictionnary.model';
import { Observable } from 'rxjs';

export enum LoggerFlowType {
  log = '[Logger Flow] Log',
  error = '[Logger Flow] Error',
}

export class LoggerFlowLogErrorTask extends LoggerTaskError {
  REQUIRES = ['messagesLogged'];
  execute(provide: ZtoDictionnary): Observable<ZtoDictionnary> {
    return super.execute({ errorMessages: provide.messagesLogged });
  }
}

export class LoggerFlowLog extends ZtoTaskflowFlow {
  TYPE = LoggerFlowType.log;
}
export function loggerFlowLogFactory(): LoggerFlowLog {
  const logTask = new LoggerTaskLog;
  const errorTask = new LoggerFlowLogErrorTask;
  const logFlow = new LoggerFlowLog;
  logFlow.add(logTask, true);
  logFlow.add(errorTask);
  logFlow.link([
    [logTask, errorTask],
  ]);
  return logFlow;
}

@Injectable()
export class LoggerFlowFacade {
  constructor(
    public taskflowFacade: ZtoTaskflowFacade,
    public loggerService: LoggerService,
  ) { }
  log(...messages: any[]) {
    const logFlow = loggerFlowLogFactory();
    const engine = new ZtoTaskflowEngine(
      this.taskflowFacade, logFlow,
      { loggerService: this.loggerService },
      { logMessages: messages },
      { steps: true }
    );

    console.log('Engine Start');
    engine.run$.subscribe(
      (result: any) => console.log('Engine Next: ', result),
      (error: Error) => console.log('Engine Error: ', error),
      () => console.log('Engine Stop'),
    );

  }
}
