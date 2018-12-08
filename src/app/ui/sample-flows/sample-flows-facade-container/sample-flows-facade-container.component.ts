import { Component, OnInit } from '@angular/core';
import { SampleFlowsFlowFacade } from '../z-flow/sample-flows-flow.facade';
import { ZFlowEngine, ZFlowEngineOptions } from 'src/app/z-flow-redux/models/z-flow-engine';
import { trackEngineLifeCycleObserver } from 'src/app/z-flow-redux/helpers/z-tools';
import { ToastFlowFacade } from 'src/app/toast/z-flow/toast-flow.facade';
import { catchError, switchMap, first, finalize, filter } from 'rxjs/operators';
import { throwError, concat } from 'rxjs';
import { ZFlowTaskStep } from 'src/app/z-flow-redux/models/z-flow-task-step';

@Component({
  selector: 'app-sample-flows-facade-container',
  templateUrl: './sample-flows-facade-container.component.html',
  styleUrls: ['./sample-flows-facade-container.component.css']
})
export class SampleFlowsFacadeContainerComponent implements OnInit {

  sample1Engine: ZFlowEngine;
  sample2Engine: ZFlowEngine;

  toastIfErrorEngine: ZFlowEngine;

  constructor(
    public sampleFlows: SampleFlowsFlowFacade,
    public toast: ToastFlowFacade
  ) { }

  ngOnInit() {
  }

  sample1() {
    this.sample1Engine = this.sampleFlows.sample1();
    this.sample1Engine.start()
      // .pipe()
      .subscribe(trackEngineLifeCycleObserver(this.sample1Engine));
  }
  pauseSample1() {
    if (!this.sample1Engine) {
      return;
    }
    this.sample1Engine.pause();
  }
  resumeSample1() {
    if (!this.sample1Engine) {
      return;
    }
    this.sample1Engine.resume();
  }
  cancelSample1() {
    if (!this.sample1Engine) {
      return;
    }
    this.sample1Engine.cancel();
  }

  sample2() {
    this.sample2Engine = this.sampleFlows.sample2(/*new ZFlowEngineOptions(false, undefined, undefined, false)*/);
    const ifError = (error: Error) => {
      const toastIfErrorEngine = this.toast.open('An error occured: ' + error.message);
      const cleanUp = () => toastIfErrorEngine.drop();
      const dropAll = () => false;
      return concat(toastIfErrorEngine.start().pipe(filter(dropAll), finalize(cleanUp)), throwError(error));
    };
    this.sample2Engine.messages$.subscribe(
      (message: ZFlowTaskStep) => console.log('A Step Message of sample2Engine arrived: ', message),
      () => console.error('Got a Step Message Error for sample2Engine'),
      () => console.log('Got a Step Message Completion for sample2Engine'),
    );
    this.sample2Engine.start()
      .pipe(catchError(ifError))
      .subscribe(trackEngineLifeCycleObserver(this.sample2Engine));
  }
  pauseSample2() {
    if (!this.sample2Engine) {
      return;
    }
    this.sample2Engine.pause();
  }
  resumeSample2() {
    if (!this.sample2Engine) {
      return;
    }
    this.sample2Engine.resume();
  }
  cancelSample2() {
    if (!this.sample2Engine) {
      return;
    }
    this.sample2Engine.cancel();
  }

}
