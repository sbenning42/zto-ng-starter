import { Injectable } from '@angular/core';
import { ZFlowStoreService } from '../../z-flow-redux/services/z-flow-store.service';
import { ZFlowEngine } from '../../z-flow-redux/models/z-flow-engine';
import { LoggerService } from '../logger.service';
import { LoggerFlowLog, LoggerFlowError } from './logger.flows';
import { LoggerSymbol } from './logger.tasks';
import { ZDictionnary } from 'src/app/z-flow-redux/helpers/z-tools';

@Injectable()
export class LoggerFlowFacade {

  injector: ZDictionnary;

  constructor(
    public zFlowStore: ZFlowStoreService,
    public loggerService: LoggerService
  ) {
    this.injector = { loggerService };
  }

  log(...messages: any[]): ZFlowEngine {
    return new ZFlowEngine(
      new LoggerFlowLog(),
      this.zFlowStore,
      this.injector,
      { [LoggerSymbol.logMessages]: messages }
    );
  }
  error(...messages: any[]): ZFlowEngine {
    return new ZFlowEngine(
      new LoggerFlowError(),
      this.zFlowStore,
      this.injector,
      { [LoggerSymbol.errorMessages]: messages }
    );
  }
}
