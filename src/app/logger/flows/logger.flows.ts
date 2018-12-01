import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';
import { LoggerTaskLog, LoggerTaskError } from './logger.tasks';
import { ZtoTaskflowEngine, ZtoTaskflowAtomGraph } from '../../zto-task-flow/pattern-engine/zto-taskflow-engine.model';
import { ZtoTaskflowFacade } from '../../zto-task-flow/pattern-store/zto-taskflow.facade';
import { ZtoTaskflowFlow } from 'src/app/zto-task-flow/pattern-components/flow/zto-taskflow-flow.abstract';
import { ZtoDictionnary } from 'src/app/zto-task-flow/helpers/zto-dictionnary.model';
import { Observable } from 'rxjs';
import { ZtoTaskflowAtomMode } from 'src/app/zto-task-flow/pattern-components/atom/zto-taskflow-atom-mode.enum';

export enum LoggerFlowType {
  log = '[Logger Flow] Log',
  error = '[Logger Flow] Error',
}

export class LoggerFlowLog extends ZtoTaskflowFlow {
  TYPE = LoggerFlowType.log;
}
export class LoggerFlowError extends ZtoTaskflowFlow {
  TYPE = LoggerFlowType.error;
}

export function loggerFlowLogFactory(): LoggerFlowLog {
  const logTask = new LoggerTaskLog;
  const logFlow = new LoggerFlowLog;
  logFlow.add(logTask, { rootAtom: true, target: true });
  return logFlow;
}

export function loggerFlowErrorFactory(): LoggerFlowError {
  const errorTask = new LoggerTaskError;
  const errorFlow = new LoggerFlowError;
  errorFlow.add(errorTask, { rootAtom: true, target: true });
  return errorFlow;
}

@Injectable()
export class LoggerFlowFacade {

  constructor(
    public taskflowFacade: ZtoTaskflowFacade,
    public loggerService: LoggerService,
  ) { }

  private createEngine(
    flow: ZtoTaskflowFlow,
    provide: ZtoDictionnary = new ZtoDictionnary,
    options: ZtoDictionnary = new ZtoDictionnary
  ): ZtoTaskflowEngine {
    const inject = { loggerService: this.loggerService };
    return new ZtoTaskflowEngine(this.taskflowFacade, flow, inject, provide, options);
  }

  log(...messages: any[]): Observable<ZtoDictionnary> {
    const engine = this.createEngine(
      loggerFlowLogFactory(),
      { logMessages: messages },
      // { steps: true }
    );
    return engine.run$;
  }

  error(...messages: any[]): Observable<ZtoDictionnary> {
    const engine = this.createEngine(
      loggerFlowErrorFactory(),
      { errorMessages: messages }
    );
    return engine.run$;
  }

}
