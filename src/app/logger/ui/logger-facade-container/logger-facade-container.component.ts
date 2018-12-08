import { Component, OnInit } from '@angular/core';
import { LoggerFlowFacade } from '../../z-flow/logger-flow.facade';
import { ZFlowEngine } from '../../../z-flow-redux/models/z-flow-engine';
import { trackEngineLifeCycleObserver } from 'src/app/z-flow-redux/helpers/z-tools';

@Component({
  selector: 'app-logger-facade-container',
  templateUrl: './logger-facade-container.component.html',
  styleUrls: ['./logger-facade-container.component.css']
})
export class LoggerFacadeContainerComponent implements OnInit {

  logEngine: ZFlowEngine;
  errorEngine: ZFlowEngine;

  constructor(public facade: LoggerFlowFacade) { }

  ngOnInit() {
  }

  log(messages: any[]) {
    this.logEngine = this.facade.log(...messages);
    this.logEngine.start().subscribe(
      trackEngineLifeCycleObserver(this.logEngine)
    );
  }
  cancelLog() {
    if (!this.logEngine) {
      return;
    }
    this.logEngine.cancel();
  }
  pauseLog() {
    if (!this.logEngine) {
      return;
    }
    this.logEngine.pause();
  }
  resumeLog() {
    if (!this.logEngine) {
      return;
    }
    this.logEngine.resume();
  }

  error(messages: any[]) {
    this.errorEngine = this.facade.error(...messages);
    this.errorEngine.start().subscribe(
      trackEngineLifeCycleObserver(this.errorEngine)
    );
  }
  cancelError() {
    if (!this.errorEngine) {
      return;
    }
    this.errorEngine.cancel();
  }
  pauseError() {
    if (!this.errorEngine) {
      return;
    }
    this.errorEngine.pause();
  }
  resumeError() {
    if (!this.errorEngine) {
      return;
    }
    this.errorEngine.resume();
  }

}
