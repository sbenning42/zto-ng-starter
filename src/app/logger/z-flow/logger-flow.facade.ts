import { Injectable } from '@angular/core';
import { ZFlowStoreService } from '../../z-flow-redux/services/z-flow-store.service';
import { ZFlowEngine } from '../../z-flow-redux/models/z-flow-engine';
import { LoggerService } from '../logger.service';
import { LoggerFlowLog, LoggerFlowError } from './logger.flows';
import { LoggerSymbol } from './logger.tasks';

@Injectable()
export class LoggerFlowFacade {
    constructor(
        public zFlowStore: ZFlowStoreService,
        public loggerService: LoggerService,
    ) {}

    log(...messages: any[]): ZFlowEngine {
        return new ZFlowEngine(
            new LoggerFlowLog,
            this.zFlowStore,
            { loggerService: this.loggerService },
            { [LoggerSymbol.logMessages]: messages }
        );
    }
    error(...messages: any[]): ZFlowEngine {
        return new ZFlowEngine(
            new LoggerFlowError,
            this.zFlowStore,
            { loggerService: this.loggerService },
            { [LoggerSymbol.errorMessages]: messages }
        );
    }
}
