import { ZtoIntent, ZtoIntentStatus, ZtoIntentSelector } from './models';

export const ztoIntentProcessing = (intent: ZtoIntent) => ({...intent, status: ZtoIntentStatus.processing});
export const ztoIntentResolved = (intent: ZtoIntent) => ({...intent, status: ZtoIntentStatus.resolved});
export const ztoIntentErrored = (intent: ZtoIntent) => ({...intent, status: ZtoIntentStatus.errored});
export const ztoIntentCanceled = (intent: ZtoIntent) => ({...intent, status: ZtoIntentStatus.canceled});

export abstract class ZtoIntentSelectorResolver {
    abstract resolve(selector: ZtoIntentSelector): ZtoIntent;
}

export class ZtoIntentFactory {
    create(selector: ZtoIntentSelector, data?: any) {
        return selector.factory(data);
    }
}