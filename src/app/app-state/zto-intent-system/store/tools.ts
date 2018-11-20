import { ZtoIntent, ZtoIntentStatus, ZtoIntentSelector } from './models';

export const ztoIntentProcessing = (intent: ZtoIntent) => ({...intent, status: ZtoIntentStatus.processing});
export const ztoIntentResolved = (intent: ZtoIntent) => ({...intent, status: ZtoIntentStatus.resolved});
export const ztoIntentErrored = (intent: ZtoIntent) => ({...intent, status: ZtoIntentStatus.errored});
export const ztoIntentCanceled = (intent: ZtoIntent) => ({...intent, status: ZtoIntentStatus.canceled});

export abstract class ZtoIntentSelectorResolver {
    abstract resolve(selector: ZtoIntentSelector): ZtoIntent;
}

export class ZtoIntentFactory {
    create(selector: ZtoIntentSelector) {
        const extra = typeof(selector) === 'string' ? {type: selector} : selector;
        return new ZtoIntent(extra.type, extra.payload, extra.params);
    }
}