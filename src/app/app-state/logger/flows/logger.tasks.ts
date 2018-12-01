import { ZtoTaskflowTask } from '../../../zto-task-flow/pattern-components/task/zto-taskflow-task.abstract';
import { ZtoDictionnary } from 'src/app/zto-task-flow/helpers/zto-dictionnary.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @TODO: Rebinding (eg: REBIND/REVERT_REBIND) should be use to subclass generic tasks
 * the REQUIRES/PROVIDE properties may be overidden
 * (to avoid collision, aka: using the same task class multiple time in a flow)
 * anyway the requires parameter use REBIND/REVERT_REBIND to resolve to the parent task
 * keys. That way the execute method of the parent task may be left free of override.
 */

export enum LoggerTaskType {
  log = '[Logger Task] Log',
  error = '[Logger Task] Error',
}

export class LoggerTaskLog extends ZtoTaskflowTask {
  TYPE = LoggerTaskType.log;
  INJECT = ['loggerService'];
  REQUIRES = ['logMessages'];
  PROVIDE = ['messagesLogged'];
  execute(requires: ZtoDictionnary): Observable<ZtoDictionnary> {
    const messages = requires.logMessages;
    const provide = new ZtoDictionnary({ messagesLogged: messages });
    return this.injected.loggerService.log(...messages).pipe(map(() => provide));
  }
}

export class LoggerTaskError extends ZtoTaskflowTask {
  TYPE = LoggerTaskType.error;
  INJECT = ['loggerService'];
  REQUIRES = ['errorMessages'];
  PROVIDE = ['messagesErrored'];
  execute(requires: ZtoDictionnary): Observable<ZtoDictionnary> {
    const messages = requires.errorMessages;
    const provide = new ZtoDictionnary({ messagesErrored: messages });
    return this.injected.loggerService.error(...messages).pipe(map(() => provide));
  }
}
