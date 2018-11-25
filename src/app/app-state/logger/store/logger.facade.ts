import { Injectable } from '@angular/core';
import { ZasFacade } from '../../zto-action-system/zas.facade';
import { LoggerResolver } from './logger.resolver';
import { ZtoLazyAction } from '../../zto-action-system/zas.models';
import { LoggerLog, LoggerError } from './logger.actions';

@Injectable()
export class LoggerFacade {
  constructor(private zas: ZasFacade, private resolver: LoggerResolver) {
    this.zas.registers(this.resolver);
  }
  lazyLog(...messages: any[]): ZtoLazyAction {
    return this.zas.toLazy(new LoggerLog({messages}));
  }
  lazyError(...messages: any[]): ZtoLazyAction {
    return this.zas.toLazy(new LoggerError({messages}));
  }
}
