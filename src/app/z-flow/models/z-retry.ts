import { ZAtom } from './z-atom';
import { ZDictionary } from 'src/app/task-flow/models/z-dictionary.model';
import { ZHistory } from './z-history';
import { Observable } from 'rxjs';

export enum ZRetryStrategyDecision {
  revert = '[ZTO Retry Strategy Decision] Revert',
  revertAll = '[ZTO Retry Strategy Decision] Revert All',
  retry = '[ZTO Retry Strategy Decision] Retry',
}

export abstract class ZRetry<I = any, R = any, P = any, RR = any, RP = any> extends ZAtom<I, R, P, RR, RP> {
  abstract onFailure(history: ZHistory, ...rest: any[]): ZRetryStrategyDecision;
  execute?(args: ZDictionary<R>, history: ZHistory): Observable<ZDictionary<P>>;
  revert?(args: ZDictionary<RR>, history: ZHistory): Observable<ZDictionary<RP>>;
}

export abstract class ZAlwaysRevert<I = any, R = any, P = any, RR = any, RP = any> extends ZRetry<I, R, P, RR, RP> {
  onFailure(): ZRetryStrategyDecision {
    return ZRetryStrategyDecision.revert;
  }
}

export abstract class ZAlwaysRevertAll<I = any, R = any, P = any, RR = any, RP = any> extends ZRetry<I, R, P, RR, RP> {
  onFailure(): ZRetryStrategyDecision {
    return ZRetryStrategyDecision.revertAll;
  }
}

export abstract class ZRetryCount<I = any, R = any, P = any, RR = any, RP = any> extends ZRetry<I, R, P, RR, RP> {
  constructor(
    public count: number,
    public inject?: ZDictionary<I>,
    public requires?: ZDictionary<R>,
    public provide?: ZDictionary<P>,
    public rebind?: ZDictionary<string>,
    public revertRequires?: ZDictionary<RR>,
    public revertProvide?: ZDictionary<RP>,
    public revertRebind?: ZDictionary<string>,
  ) {
    super(inject, requires, provide, rebind, revertRequires, revertProvide, revertRebind);
  }
  onFailure(history: ZHistory, attempt: number = 1, revertAll: boolean = true): ZRetryStrategyDecision {
    return this.count > attempt
      ? ZRetryStrategyDecision.retry
      : (revertAll ? ZRetryStrategyDecision.revertAll : ZRetryStrategyDecision.revert);
  }
}
