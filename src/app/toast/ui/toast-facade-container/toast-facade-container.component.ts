import { Component, OnInit } from '@angular/core';
import { ToastFlowFacade } from '../../z-flow/toast-flow.facade';
import { ZFlowEngine } from 'src/app/z-flow-redux/models/z-flow-engine';
import { trackEngineLifeCycleObserver } from 'src/app/z-flow-redux/helpers/z-tools';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-toast-facade-container',
  templateUrl: './toast-facade-container.component.html',
  styleUrls: ['./toast-facade-container.component.css']
})
export class ToastFacadeContainerComponent implements OnInit {

  openEngine: ZFlowEngine;
  closeEngine: ZFlowEngine;

  beenOpen: boolean;
  beenOpenTO: any;

  constructor(public toast: ToastFlowFacade) { }

  ngOnInit() {
  }

  open(message: string) {
    const scheduleBeenOpen = () => {
      const schedulCloseBeenOpen = () => {
        this.beenOpen = false;
        this.beenOpenTO = undefined;
      };
      this.beenOpen = true;
      this.beenOpenTO = setTimeout(schedulCloseBeenOpen, 4000);
    };
    this.openEngine = this.toast.open(message);
    this.openEngine.start()
      .pipe(tap(scheduleBeenOpen))
      .subscribe(trackEngineLifeCycleObserver(this.openEngine));
  }
  close() {
    const closeBeenOpen = () => {
      this.beenOpen = false;
      if (this.beenOpenTO !== undefined) {
        clearTimeout(this.beenOpenTO);
      }
    };
    this.closeEngine = this.toast.close();
    this.closeEngine.start()
      .pipe(tap(closeBeenOpen))
      .subscribe(trackEngineLifeCycleObserver(this.closeEngine));
  }

  pauseOpen() {
    if (!this.openEngine) {
      return;
    }
    this.openEngine.pause();
  }
  pauseClose() {
    if (!this.closeEngine) {
      return;
    }
    this.closeEngine.pause();
  }

  resumeOpen() {
    if (!this.openEngine) {
      return;
    }
    this.openEngine.resume();
  }
  resumeClose() {
    if (!this.closeEngine) {
      return;
    }
    this.closeEngine.resume();
  }

  cancelOpen() {
    if (!this.openEngine) {
      return;
    }
    this.openEngine.cancel();
  }
  cancelClose() {
    if (!this.closeEngine) {
      return;
    }
    this.closeEngine.cancel();
  }

}
