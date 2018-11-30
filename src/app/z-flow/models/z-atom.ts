import { ZDictionary } from './z-helpers';
import { Observable } from 'rxjs';

export abstract class ZAtom<I = any, R = any, P = any, RR = any, RP = any> {
  abstract name: string;
  version = '1.0.0';
  priority = 0;
  constructor(
    public inject?: ZDictionary<I>,
    public requires?: ZDictionary<R>,
    public provide?: ZDictionary<P>,
    public rebind?: ZDictionary<string>,
    public revertRequires?: ZDictionary<RR>,
    public revertProvide?: ZDictionary<RP>,
    public revertRebind?: ZDictionary<string>,
  ) { }
  execute?(args: ZDictionary<R>, ...rest: any[]): Observable<ZDictionary<P>>;
  revert?(args: ZDictionary<RR>, ...rest: any[]): Observable<ZDictionary<RP>>;
  preExecute?(): void;
  postExecute?(): void;
  preRevert?(): void;
  postRevert?(): void;
}
