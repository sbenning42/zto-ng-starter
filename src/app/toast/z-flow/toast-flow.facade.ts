import { Injectable } from '@angular/core';
import { ZFlowStoreService } from '../../z-flow-redux/services/z-flow-store.service';
import { ZFlowEngine } from '../../z-flow-redux/models/z-flow-engine';
import { ToastService } from '../toast.service';
import { ToastFlowOpen, ToastFlowClose } from './toast.flows';
import { ToastSymbol } from './toast.tasks';
import { ZDictionnary } from 'src/app/z-flow-redux/helpers/z-tools';

@Injectable()
export class ToastFlowFacade {
  injector: ZDictionnary;

  constructor(
    public zFlowStore: ZFlowStoreService,
    public toastService: ToastService
  ) {
    this.injector = { toastService };
  }

  open(message: string): ZFlowEngine {
    return new ZFlowEngine(
      new ToastFlowOpen,
      this.zFlowStore,
      this.injector,
      { [ToastSymbol.openMessage]: message }
    );
  }
  close(): ZFlowEngine {
    return new ZFlowEngine(
      new ToastFlowClose,
      this.zFlowStore,
      this.injector
    );
  }
}
