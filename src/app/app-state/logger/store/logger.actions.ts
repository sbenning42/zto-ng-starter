import { ZtoBaseCommand, ZtoAsyncCorrelation } from '../../zto-action-system/zas.models';

export enum LoggerActionType {
  log = '[Logger] Log',
  error = '[Logger] Error',
}

export class LoggerLog extends ZtoBaseCommand<{ messages: any[] }> {
  type = LoggerActionType.log;
  correlations = {
    async: new ZtoAsyncCorrelation(LoggerActionType.log),
  };
  constructor(payload: { messages: any[] }) {
    super('', payload);
  }
}

export class LoggerError extends ZtoBaseCommand<{ messages: any[] }> {
  type = LoggerActionType.error;
  correlations = {
    async: new ZtoAsyncCorrelation(LoggerActionType.error),
  };
  constructor(payload: { messages: any[] }) {
    super('', payload);
  }
}
