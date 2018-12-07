import { ZFlowAtom } from './z-flow-atom';
import { ZFlowRetry } from './z-flow-retry';
import { Subject, Observable } from 'rxjs';
import { ZFlowTaskStep } from '../models/z-flow-task-step';

export abstract class ZFlowTask extends ZFlowAtom {
  retry?: ZFlowRetry;
  messageBus: Subject<ZFlowTaskStep> = new Subject;
}
