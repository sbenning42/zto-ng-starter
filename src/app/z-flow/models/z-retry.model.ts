import { ZAtom } from './z-atom.model';
import { ZRetryDecision } from './z-retry-decision.model';
import { ZDictionary } from './z-dictionary.model';

export abstract class ZRetry extends ZAtom {
    abstract onFailure(): ZRetryDecision;
}

export class ZAlwaysRevert extends ZRetry {
    version = '1.0.0';
    onFailure(): ZRetryDecision {
        return ZRetryDecision.revert;
    }
    execute(args: any[], kwargs: ZDictionary): any {}
    revert(args: any[], kwargs: ZDictionary): any {}
    preExecute() {}
    postExecute() {}
    preRevert() {}
    postRevert() {}
}

export class ZAlwaysRevertAll extends ZRetry {
    version = '1.0.0';
    onFailure(): ZRetryDecision {
        return ZRetryDecision.revertAll;
    }
    execute(args: any[], kwargs: ZDictionary): any {}
    revert(args: any[], kwargs: ZDictionary): any {}
    preExecute() {}
    postExecute() {}
    preRevert() {}
    postRevert() {}
}

export class ZTimes extends ZRetry {
    version = '1.0.0';
    onFailure(): ZRetryDecision {
        return ZRetryDecision.revert;
    }
    execute(args: any[], kwargs: ZDictionary): any {}
    revert(args: any[], kwargs: ZDictionary): any {}
    preExecute() {}
    postExecute() {}
    preRevert() {}
    postRevert() {}
}

export class ZForEach extends ZRetry {
    version = '1.0.0';
    onFailure(): ZRetryDecision {
        return ZRetryDecision.revert;
    }
    execute(args: any[], kwargs: ZDictionary): any {}
    revert(args: any[], kwargs: ZDictionary): any {}
    preExecute() {}
    postExecute() {}
    preRevert() {}
    postRevert() {}
}

export class ZParameterizedForEach extends ZRetry {
    version = '1.0.0';
    onFailure(): ZRetryDecision {
        return ZRetryDecision.revert;
    }
    execute(args: any[], kwargs: ZDictionary): any {}
    revert(args: any[], kwargs: ZDictionary): any {}
    preExecute() {}
    postExecute() {}
    preRevert() {}
    postRevert() {}
}
