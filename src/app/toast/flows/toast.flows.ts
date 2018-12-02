import { Injectable } from '@angular/core';
import { ToastService } from '../toast.service';
import { ToastTaskOpen, ToastTaskClose } from './toast.tasks';
import { ZtoTaskflowEngine } from '../../zto-task-flow/pattern-engine/zto-taskflow-engine.model';
import { ZtoTaskflowFacade } from '../../zto-task-flow/pattern-store/zto-taskflow.facade';
import { ZtoTaskflowFlow } from 'src/app/zto-task-flow/pattern-components/flow/zto-taskflow-flow.abstract';
import { ZtoDictionnary } from 'src/app/zto-task-flow/helpers/zto-dictionnary.model';
import { Observable } from 'rxjs';

export enum ToastFlowType {
  open = '[Toast Flow] Open',
  close = '[Toast Flow] Close',
}

export class ToastFlowOpen extends ZtoTaskflowFlow {
  TYPE = ToastFlowType.open;
  constructor() {
    super();
    this.add(new ToastTaskOpen, { rootAtom: true, target: true });
  }
}

export class ToastFlowClose extends ZtoTaskflowFlow {
  TYPE = ToastFlowType.close;
  constructor() {
    super();
    this.add(new ToastTaskClose, { rootAtom: true, target: true });
  }
}

@Injectable()
export class ToastFlowFacade {

  constructor(
    public taskflowFacade: ZtoTaskflowFacade,
    public toastService: ToastService,
  ) { }

  private createEngine(
    flow: ZtoTaskflowFlow,
    provide: ZtoDictionnary = new ZtoDictionnary,
    options: ZtoDictionnary = new ZtoDictionnary
  ): ZtoTaskflowEngine {
    const inject = { toastService: this.toastService };
    return new ZtoTaskflowEngine(this.taskflowFacade, flow, inject, provide, options);
  }

  open(message: string): ZtoTaskflowEngine {
    const engine = this.createEngine(new ToastFlowOpen, { toastMessage: message });
    return engine;
  }

  close(): ZtoTaskflowEngine {
    const engine = this.createEngine(new ToastFlowClose);
    return engine;
  }

}
