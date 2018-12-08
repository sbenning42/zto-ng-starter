import { ZFlowFlow } from '../../z-flow-redux/abstracts/z-flow-flow';
import { ToastTaskOpen, ToastTaskClose } from './toast.tasks';

export enum ToastFlowType {
  open = '[Toast Flow Type] Open',
  close = '[Toast Flow Type] Close'
}

export class ToastFlowOpen extends ZFlowFlow {
  type = ToastFlowType.open;
  constructor() {
    super();
    const openTask = new ToastTaskOpen();
    this.addTask(openTask, { root: true, target: true });
  }
}

export class ToastFlowClose extends ZFlowFlow {
  type = ToastFlowType.close;
  constructor() {
    super();
    const closeTask = new ToastTaskClose();
    this.addTask(closeTask, { root: true, target: true });
  }
}
