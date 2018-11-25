import { Injectable } from '@angular/core';
import { ZasFacade } from '../../zto-action-system/zas.facade';
import { LoggerService } from '../logger.service';
import { LoggerActionType } from './logger.actions';

@Injectable()
export class LoggerResolver {
  log = this.zas.baseAsyncResolver(`${LoggerActionType.log}@async`, mapAsync => this.logger.log(...mapAsync.action.payload.messages));
  error = this.zas.baseAsyncResolver(`${LoggerActionType.error}@async`, mapAsync => this.logger.error(...mapAsync.action.payload.messages));
  constructor(public zas: ZasFacade, public logger: LoggerService) { }
}
