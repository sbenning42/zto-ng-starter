import { ZAtom } from './z-atom';
import { BehaviorSubject, Observable } from 'rxjs';
import { ZDictionary } from 'src/app/task-flow/models/z-dictionary.model';

export abstract class ZTask<I = any, R = any, P = any, RR = any, RP = any> extends ZAtom<I, R, P, RR, RP> {
  progress$: BehaviorSubject<number> = new BehaviorSubject(0);
  execute?(args: ZDictionary<R>): Observable<ZDictionary<P>>;
  revert?(args: ZDictionary<RR>): Observable<ZDictionary<RP>>;
}
