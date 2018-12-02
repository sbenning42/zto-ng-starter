import { Component, OnInit } from '@angular/core';
import { ZtoTaskflowEngine } from 'src/app/zto-task-flow/pattern-engine/zto-taskflow-engine.model';
import { ToastFlowFacade } from '../flows/toast.flows';

@Component({
  selector: 'app-toast-facade-container',
  templateUrl: './toast-facade-container.component.html',
  styleUrls: ['./toast-facade-container.component.css']
})
export class ToastFacadeContainerComponent implements OnInit {

  openRunner: ZtoTaskflowEngine;
  closeRunner: ZtoTaskflowEngine;

  constructor(public toast: ToastFlowFacade) { }

  ngOnInit() {
  }

  open(message: string) {
    this.openRunner = this.toast.open(message);
    this.openRunner.run$.subscribe();
  }
  close() {
    this.closeRunner = this.toast.close();
    this.closeRunner.run$.subscribe();
  }

  cancelOpen() {
    this.openRunner.doCancel();
  }
  cancelClose() {
    this.closeRunner.doCancel();
  }

}
