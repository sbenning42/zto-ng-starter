import { ZtoTaskflowTask } from '../../zto-task-flow/pattern-components/task/zto-taskflow-task.abstract';
import { ZtoDictionnary } from 'src/app/zto-task-flow/helpers/zto-dictionnary.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum ToastTaskType {
  open = '[Toast Task] Open',
  close = '[Toast Task] Close',
}

export class ToastTaskOpen extends ZtoTaskflowTask {
  TYPE = ToastTaskType.open;
  INJECT = ['toastService'];
  REQUIRES = ['toastMessage'];
  execute(requires: ZtoDictionnary): Observable<ZtoDictionnary> {
    const message = requires.toastMessage;
    const mapProvide = () => ({});
    return this.injected.toastService.open(message).pipe(map(mapProvide));
  }
}

export class ToastTaskClose extends ZtoTaskflowTask {
  TYPE = ToastTaskType.close;
  INJECT = ['toastService'];
  execute(): Observable<ZtoDictionnary> {
    const mapProvide = () => ({});
    return this.injected.toastService.close().pipe(map(mapProvide));
  }
}
