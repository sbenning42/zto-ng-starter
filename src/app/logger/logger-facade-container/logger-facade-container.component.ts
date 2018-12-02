import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerFlowFacade } from '../flows/logger.flows';
import { ZtoTaskflowEngine } from 'src/app/zto-task-flow/pattern-engine/zto-taskflow-engine.model';

@Component({
  selector: 'app-logger-facade-container',
  templateUrl: './logger-facade-container.component.html',
  styleUrls: ['./logger-facade-container.component.css']
})
export class LoggerFacadeContainerComponent implements OnInit {

  logRunning$: Observable<boolean>;
  errorRunning$: Observable<boolean>;

  logRunner: ZtoTaskflowEngine;
  errorRunner: ZtoTaskflowEngine;

  constructor(public logger: LoggerFlowFacade) { }

  ngOnInit() {
  }

  log(messages: any[]) {
    this.logRunner = this.logger.log(...messages);
    this.logRunner.run$.subscribe();
  }
  error(messages: any[]) {
    this.errorRunner = this.logger.error(...messages);
    this.errorRunner.run$.subscribe();
  }

  cancelLog() {
    this.logRunner.doCancel();
  }
  cancelError() {
    this.errorRunner.doCancel();
  }

}
