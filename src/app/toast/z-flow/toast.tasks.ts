import { ZFlowTask } from '../../z-flow-redux/abstracts/z-flow-task';
import { ZDictionnary, emptyObj } from '../../z-flow-redux/helpers/z-tools';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum ToastSymbol {
  openMessage = '[Toast Symbol] Open Message',
}

export enum ToastTaskType {
  open = '[Toast Task Type] Open',
  close = '[Toast Task Type] Close'
}

export class ToastTaskOpen extends ZFlowTask {

  type = ToastTaskType.open;
  injectSymbols = ['toastService'];
  requiresSymbols = [ToastSymbol.openMessage];

  execute(requires: ZDictionnary): Observable<ZDictionnary> {
    const message = requires[ToastSymbol.openMessage];
    return this.injector.toastService.open(message).pipe(map(emptyObj));
  }

}
export class ToastTaskClose extends ZFlowTask {

  type = ToastTaskType.close;
  injectSymbols = ['toastService'];

  execute(requires: ZDictionnary): Observable<ZDictionnary> {
    return this.injector.toastService.close().pipe(map(emptyObj));
  }

}
