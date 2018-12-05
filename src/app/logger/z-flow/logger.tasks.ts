import { ZFlowTask } from '../../z-flow-redux/abstracts/z-flow-task';
import { ZDictionnary } from '../../z-flow-redux/helpers/z-tools';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const provideNothing = () => ({});

export enum LoggerSymbol {
  logMessages = '[Logger Symbol] Log Messages',
  errorMessages = '[Logger Symbol] Error Messages'
}

export enum LoggerTaskType {
  log = '[Logger Task Type] Log',
  error = '[Logger Task Type] Error'
}

export class LoggerTaskLog extends ZFlowTask {
  type = LoggerTaskType.log;
  injectSymbols = ['loggerService'];
  requiresSymbols = [LoggerSymbol.logMessages];
  execute(requires: ZDictionnary): Observable<ZDictionnary> {
    return this.injector.loggerService
      .log(...requires[LoggerSymbol.logMessages])
      .pipe(map(provideNothing));
  }
}
export class LoggerTaskError extends ZFlowTask {
  type = LoggerTaskType.error;
  injectSymbols = ['loggerService'];
  requiresSymbols = [LoggerSymbol.errorMessages];
  execute(requires: ZDictionnary): Observable<ZDictionnary> {
    return this.injector.loggerService
      .error(...requires[LoggerSymbol.errorMessages])
      .pipe(map(provideNothing));
  }
}
