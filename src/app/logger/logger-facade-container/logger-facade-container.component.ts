import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerFlowFacade } from '../z-flow/logger-flow.facade';
import { ZtoTaskflowEngine } from 'src/app/zto-task-flow/pattern-engine/zto-taskflow-engine.model';
import { ZFlowEngine } from '../../z-flow-redux/models/z-flow-engine';
import { pluck, filter, map, takeWhile } from 'rxjs/operators';
import { ZFlowContext, ZFlowContextStatus } from '../../z-flow-redux/models/z-flow-context';

const trackLifeCycleObserver = (engine: ZFlowEngine) => ({
  next: next => {
    // console.log('Got next: ', next);
  },
  error: error => {
    // console.error('Got error: ', error);
  },
  complete: () => {
    console.log('Got complete');
    engine.drop();
  },
});

@Component({
  selector: 'app-logger-facade-container',
  templateUrl: './logger-facade-container.component.html',
  styleUrls: ['./logger-facade-container.component.css']
})
export class LoggerFacadeContainerComponent implements OnInit {

  logRunning$: Observable<any>;
  errorRunning$: Observable<any>;

  logPaused$: Observable<any>;
  errorPaused$: Observable<any>;

  logRunner: ZtoTaskflowEngine;
  errorRunner: ZtoTaskflowEngine;

  logEngine: ZFlowEngine;
  errorEngine: ZFlowEngine;

  constructor(public facade: LoggerFlowFacade) { }

  ngOnInit() {
  }

  log(messages: any[]) {
    this.logEngine = this.facade.log(...messages);
    this.logRunning$ = this.logEngine.context$.pipe(
      takeWhile((ctx: ZFlowContext) => !!ctx),
      map((ctx: ZFlowContext) => ctx && ctx.status === ZFlowContextStatus.running || ctx.status === ZFlowContextStatus.paused),
    );
    this.logPaused$ = this.logEngine.context$.pipe(
      takeWhile((ctx: ZFlowContext) => !!ctx),
      map((ctx: ZFlowContext) => ctx && ctx.status === ZFlowContextStatus.paused),
    );
    this.logEngine.start().subscribe(trackLifeCycleObserver(this.logEngine));
  }

  error(messages: any[]) {
    this.errorEngine = this.facade.error(...messages);
    this.errorRunning$ = this.errorEngine.context$.pipe(
      takeWhile((ctx: ZFlowContext) => !!ctx),
      map((ctx: ZFlowContext) => ctx && ctx.status === ZFlowContextStatus.running || ctx.status === ZFlowContextStatus.paused),
    );
    this.errorPaused$ = this.errorEngine.context$.pipe(
      takeWhile((ctx: ZFlowContext) => !!ctx),
      map((ctx: ZFlowContext) => ctx && ctx.status === ZFlowContextStatus.paused),
    );
    this.errorEngine.start().subscribe(trackLifeCycleObserver(this.errorEngine));
  }
  cancelLog() {
    this.logEngine.cancel();
    console.log('Flow canceled.');
  }
  pauseLog() {
    this.logEngine.pause();
    console.log('Flow paused.');
  }
  resumeLog() {
    this.logEngine.resume();
    console.log('Flow resumed.');
  }
  cancelError() {
    this.errorEngine.cancel();
    console.log('Flow canceled.');
  }
  pauseError() {
    this.errorEngine.pause();
    console.log('Flow paused.');
  }
  resumeError() {
    this.errorEngine.resume();
    console.log('Flow resumed.');
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

  cancelError() {
    this.errorRunner.doCancel();
  }
  */

}
