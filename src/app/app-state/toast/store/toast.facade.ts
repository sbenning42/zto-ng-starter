import { Injectable } from '@angular/core';
import { ZasFacade } from '../../zto-action-system/zas.facade';
import { ToastResolver } from './toas.resolver';
import { ZtoLazyAction } from '../../zto-action-system/zas.models';
import { ToastOpen, ToastClose } from './toas.actions';

@Injectable()
export class ToastFacade {
  constructor(private zas: ZasFacade, private resolver: ToastResolver) {
    this.zas.registers(this.resolver);
  }
  open(message: string): ZtoLazyAction {
    return this.zas.toLazy(new ToastOpen({message}));
  }
  close(): ZtoLazyAction {
    return this.zas.toLazy(new ToastClose());
  }
}
