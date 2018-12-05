import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerFlowFacade } from '../z-flow/logger-flow.facade';
import { ZtoTaskflowEngine } from 'src/app/zto-task-flow/pattern-engine/zto-taskflow-engine.model';
import { ZFlowEngine } from '../../z-flow-redux/models/z-flow-engine';

const trackLifeCycleObserver = (engine: ZFlowEngine) => ({
  next: next => {
    // console.log('Got next: ', next);
  },
  error: error => {
    // console.error('Got error: ', error);
  },
  complete: () => {
    // console.log('Got complete');
    engine.drop();
  },
});

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

  logEngine: ZFlowEngine;
  errorEngine: ZFlowEngine;

  constructor(public facade: LoggerFlowFacade) { }

  ngOnInit() {
  }

  log(messages: any[]) {
    this.logEngine = this.facade.log(...messages);
    this.logEngine.start().subscribe(trackLifeCycleObserver(this.logEngine));

    setTimeout(() => {
      this.logEngine.pause();
      console.log('Task paused ...');
    }, 5000);

    setTimeout(() => {
      console.log('Task should have ended now ... Resuming it instead ...');
      this.logEngine.resume();
    }, 10000);

    setTimeout(() => {
      console.log('Task should end in 1 second ...');
    }, 19000);

  }
  error(messages: any[]) {
    this.errorEngine = this.facade.error(...messages);
    this.errorEngine.start().subscribe(trackLifeCycleObserver(this.logEngine));
  }
  /*
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
  */

}
