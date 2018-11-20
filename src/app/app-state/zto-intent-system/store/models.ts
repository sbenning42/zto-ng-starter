import { Observable } from "rxjs";
import * as uuid from 'uuid';

export enum ZtoIntentStatus {
    idle = 'idle',
    processing = 'processing',
    resolved = 'resolved',
    errored = 'errored',
    canceled = 'canceled',
}
export const ZtoIntentStatusMap = {
    idle: ZtoIntentStatus.idle,
    processing: ZtoIntentStatus.processing,
    resolved: ZtoIntentStatus.resolved,
    errored: ZtoIntentStatus.errored,
    canceled: ZtoIntentStatus.canceled,
};

export class ZtoIntentSelectorExtra<T = any> {
    constructor(
        public type: string,
        public payload?: T,
        public params?: any,
        public results?: any,
    ) {}
}

export type ZtoIntentSelector = string|ZtoIntentSelectorExtra;

export class ZtoIntentResolver {
    constructor(
        public sourceFactory: (intent?: ZtoIntent) => Observable<any>
    ) {}
}

export class ZtoIntentFlow {
    constructor(
        public resolver: ZtoIntentResolver,
        public independantBefore: ZtoIntentSelector[] = [],
        public dependantBefore: ZtoIntentSelector[] = [],
        public independantAfter: ZtoIntentSelector[] = [],
        public onResolve: ZtoIntentSelector[] = [],
        public onError: ZtoIntentSelector[] = [],
        public onCancel: ZtoIntentSelector[] = [],
    ) {}
}

export class ZtoIntent<T = any> {
    status = ZtoIntentStatus.idle;
    id = uuid();
    constructor(
        public type: string,
        public payload?: T,
        public params?: any,
        public flow?: ZtoIntentFlow,
        public results?: any,
    ) {}
}
