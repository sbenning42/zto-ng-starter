import { ZFlowAtom } from './z-flow-atom';
import { ZDictionnary } from '../helpers/z-tools';
import { ZFlowHistory } from '../models/z-flow-history';
import { ZFlowInternalSymbol } from '../symbols/z-flow-internal.symbols';

export enum ZFlowRetryDecision {
  retry = '[Zto Flow Retry Decision] Retry',
  revert = '[Zto Flow Retry Decision] Revert',
  revertAll = '[Zto Flow Retry Decision] RevertAll',
}

export enum ZFlowRetryType {
  alwaysRevert = '[Zto Flow Retry Type] Always Revert',
  alwaysRevertAll = '[Zto Flow Retry Type] Always RevertAll',
  retryCount = '[Zto Flow Retry Type] Retry Count',
}

export abstract class ZFlowRetry extends ZFlowAtom {
  abstract onFailure(requires?: ZDictionnary, history?: ZFlowHistory): ZFlowRetryDecision;
}

// @TODO: At this point no revert/revertAll logic is implemented.
// @TODO: This Class is Useless
export class ZFlowAlwayRevert extends ZFlowRetry {
  type = ZFlowRetryType.alwaysRevert;
  onFailure(): ZFlowRetryDecision {
    return ZFlowRetryDecision.revert;
  }
}

// @TODO: At this point no revert/revertAll logic is implemented.
// @TODO: This Class is Useless
export class ZFlowAlwayRevertAll extends ZFlowRetry {
  type = ZFlowRetryType.alwaysRevertAll;
  onFailure(): ZFlowRetryDecision {
    return ZFlowRetryDecision.revertAll;
  }
}

// @TODO: At this point ne retry logic has been tested.
// @TODO: This Class is Unsafe
// @TODO: that why it's at this time, logicaly patched to the Useless ZFlowAlwayRevert
export class ZFlowRetryCount extends ZFlowRetry {
  requiresSymbols = [ZFlowInternalSymbol.retryCount];
  type = ZFlowRetryType.retryCount;

  retryTime = 0;
  onFailure(requires?: ZDictionnary): ZFlowRetryDecision {
    return ++this.retryTime > requires[ZFlowInternalSymbol.retryCount]
      ? ZFlowRetryDecision.revert
      : ZFlowRetryDecision./*retry*/revert;
  }
}
