import { ZAtom } from './z-atom.model';
import { ZRetryDecision } from './z-retry-decision.model';
import { ZDictionary } from './z-dictionary.model';
import { ZHistory } from './z-history.model';

export abstract class ZRetry extends ZAtom {
  abstract onFailure(args: any[], kwargs: ZDictionary, history: ZHistory): ZRetryDecision;
  execute?(args: any[], kwargs: ZDictionary, history: ZHistory): any;
  revert?(args: any[], kwargs: ZDictionary, history: ZHistory): any;
}

export class ZAlwaysRevert extends ZRetry {
  version = '1.0.0';
  onFailure(args: any[], kwargs: ZDictionary, history: ZHistory): ZRetryDecision {
    return ZRetryDecision.revert;
  }
  execute(args: any[], kwargs: ZDictionary, history: ZHistory): any {}
  revert(args: any[], kwargs: ZDictionary, history: ZHistory): any {}
}

export class ZAlwaysRevertAll extends ZRetry {
  version = '1.0.0';
  onFailure(args: any[], kwargs: ZDictionary, history: ZHistory): ZRetryDecision {
    return ZRetryDecision.revertAll;
  }
  execute(args: any[], kwargs: ZDictionary, history: ZHistory): any {}
  revert(args: any[], kwargs: ZDictionary, history: ZHistory): any {}
}

export class ZTimes extends ZRetry {
  version = '1.0.0';
  onFailure(args: any[], kwargs: ZDictionary, history: ZHistory): ZRetryDecision {
    return ZRetryDecision.revert;
  }
  execute(args: any[], kwargs: ZDictionary, history: ZHistory): any {}
  revert(args: any[], kwargs: ZDictionary, history: ZHistory): any {}
}

export class ZForEach extends ZRetry {
  version = '1.0.0';
  onFailure(args: any[], kwargs: ZDictionary, history: ZHistory): ZRetryDecision {
    return ZRetryDecision.revert;
  }
  execute(args: any[], kwargs: ZDictionary, history: ZHistory): any {}
  revert(args: any[], kwargs: ZDictionary, history: ZHistory): any {}
}

export class ZParameterizedForEach extends ZRetry {
  version = '1.0.0';
  onFailure(args: any[], kwargs: ZDictionary, history: ZHistory): ZRetryDecision {
    return ZRetryDecision.revert;
  }
  execute(args: any[], kwargs: ZDictionary, history: ZHistory): any {}
  revert(args: any[], kwargs: ZDictionary, history: ZHistory): any {}
}
