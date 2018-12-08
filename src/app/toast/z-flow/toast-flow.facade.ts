import { Injectable } from '@angular/core';
import { ZFlowStoreService } from '../../z-flow-redux/services/z-flow-store.service';
import { ZFlowEngine } from '../../z-flow-redux/models/z-flow-engine';
import { ToastService } from '../toast.service';
import { ToastFlowOpen, ToastFlowClose } from './toast.flows';
import { ToastSymbol } from './toast.tasks';

@Injectable()
export class ToastFlowFacade {
    constructor(
        public zFlowStore: ZFlowStoreService,
        public toastService: ToastService,
    ) {}

    open(message: string): ZFlowEngine {
        return new ZFlowEngine(
            new ToastFlowOpen,
            this.zFlowStore,
            { toastService: this.toastService },
            { [ToastSymbol.openMessage]: message }
        );
    }
    close(): ZFlowEngine {
        return new ZFlowEngine(
            new ToastFlowClose,
            this.zFlowStore,
            { toastService: this.toastService },
        );
    }
}
