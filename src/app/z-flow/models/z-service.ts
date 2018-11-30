import { ZEngine } from './z-engine';
import { ZFlow } from './z-flow';
import { ZDictionary } from './z-helpers';
import { ZStep } from './z-step';
import { Observable } from 'rxjs';

export abstract class ZService {
  getFlowExecution(services: ZDictionary, flow: ZFlow): Observable<ZStep> {
    return new ZEngine(services, flow).execution$;
  }
}
