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
  constructor() {
    super();
    this.add(new LoggerTaskLog, { rootAtom: true, target: true });
  }
}

export class LoggerFlowError extends ZtoTaskflowFlow {
  TYPE = LoggerFlowType.error;
  constructor() {
    super();
    this.add(new LoggerTaskError, { rootAtom: true, target: true });
  }
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
    const engine = this.createEngine(new LoggerFlowLog, { logMessages: messages });
    return engine.run$;
  }

  error(...messages: any[]): Observable<ZtoDictionnary> {
    const engine = this.createEngine(new LoggerFlowError, { errorMessages: messages });
    return engine.run$;
  }

}
