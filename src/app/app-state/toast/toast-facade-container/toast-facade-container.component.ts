import { Component, OnInit } from '@angular/core';
import { ToastFacade } from '../store/toast.facade';
import { NOOP } from '../../zto-action-system/zas.functions';

@Component({
  selector: 'app-toast-facade-container',
  templateUrl: './toast-facade-container.component.html',
  styleUrls: ['./toast-facade-container.component.css']
})
export class ToastFacadeContainerComponent implements OnInit {

  actions = {
    open: {closed$: undefined, cancel: NOOP},
    close: {closed$: undefined, cancel: NOOP},
  };
  constructor(public toast: ToastFacade) { }

  ngOnInit() {
  }

  open(message: string) {
    const open = this.toast.open(message);
    this.actions.open.closed$ = open.closed$;
    this.actions.open.cancel = open.cancels.async;
    open.dispatch();
  }

  close() {
    const close = this.toast.close();
    this.actions.close.closed$ = close.closed$;
    this.actions.close.cancel = close.cancels.async;
    close.dispatch();
  }

  cancelOpen() {
    this.actions.open.cancel();
  }

  cancelClose() {
    this.actions.close.cancel();
  }

}
