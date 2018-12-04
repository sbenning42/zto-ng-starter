import { ZFlowAtom } from './z-flow-atom';
import { ZFlowRetry } from './z-flow-retry';
import { Subject, Observable } from 'rxjs';
import { ZFlowTaskStep } from '../models/z-flow-task-step';

export abstract class ZFlowTask extends ZFlowAtom {
  retry?: ZFlowRetry;
  protected notifier: Subject<ZFlowTaskStep> = new Subject;
  feedback$: Observable<ZFlowTaskStep> = this.notifier.asObservable();
}
