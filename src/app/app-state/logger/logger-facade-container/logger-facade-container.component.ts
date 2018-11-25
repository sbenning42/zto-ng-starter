import { Component, OnInit } from '@angular/core';
import { LoggerFacade } from '../../logger/store/logger.facade';
import { NOOP } from '../../zto-action-system/zas.functions';

@Component({
  selector: 'app-logger-facade-container',
  templateUrl: './logger-facade-container.component.html',
  styleUrls: ['./logger-facade-container.component.css']
})
export class LoggerFacadeContainerComponent implements OnInit {

  actions: { [name: string]: any } = {
    log: { closed$: undefined, cancel: NOOP },
    error: { closed$: undefined, cancel: NOOP },
  };
  constructor(public logger: LoggerFacade) { }

  ngOnInit() {
  }

  log(messages: any[]) {
    const log = this.logger.lazyLog(...messages);
    this.actions.log.closed$ = log.closed$;
    this.actions.log.cancel = log.cancels.async;
    log.dispatch();
  }
  error(messages: any[]) {
    const error = this.logger.lazyError(...messages);
    this.actions.error.closed$ = error.closed$;
    this.actions.error.cancel = error.cancels.async;
    error.dispatch();
  }

}
