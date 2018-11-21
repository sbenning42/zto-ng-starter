import { Observable, Subscriber, Subscription, zip } from 'rxjs';
import { Action } from '@ngrx/store';
import { first, timeout } from 'rxjs/operators';

export interface Index<T> {
    [key: string]: T;
}
export function indexBy<T>(stack: T[], uniqueFieldName: string): Index<T> {
    return stack.reduce(
        (index: Index<T>, item: T) => ({...index, [item[uniqueFieldName]]: item}), {}
    );
}

export type ZtoIntent = any;
export type ZtoIntentDescriptor = any;

export interface ActionWithPayload<T = any> extends Action {
    payload: T;
}

export type ZtoAction<T = any> = Action|ActionWithPayload<T>;

export enum ZtoIntentActionType {
    process = '[Zto Intent] Process',
    resolve = '[Zto Intent] Resolve',
    error = '[Zto Intent] Error',
    cancel = '[Zto Intent] Cancel'
}

export function ztoIntentActionFactory(type: string, intent: ZtoIntent): ActionWithPayload<{intent: ZtoIntent}> {
    return {type, payload: {intent}};
}
export function ztoIntentActionProcess(intent: ZtoIntent): ActionWithPayload<{intent: ZtoIntent}> {
    return ztoIntentActionFactory(ZtoIntentActionType.process, intent);
}
export function ztoIntentActionResolve(intent: ZtoIntent): ActionWithPayload<{intent: ZtoIntent}> {
    return ztoIntentActionFactory(ZtoIntentActionType.resolve, intent);
}
export function ztoIntentActionError(intent: ZtoIntent): ActionWithPayload<{intent: ZtoIntent}> {
    return ztoIntentActionFactory(ZtoIntentActionType.error, intent);
}
export function ztoIntentActionCancel(intent: ZtoIntent): ActionWithPayload<{intent: ZtoIntent}> {
    return ztoIntentActionFactory(ZtoIntentActionType.cancel, intent);
}

export class ZtoIntentDescriptorRegistery {
    private descriptors: Index<ZtoIntentDescriptor>;
    constructor(descriptors: ZtoIntentDescriptor[]) {
        this.descriptors = indexBy(descriptors, 'type');
    }
    find(type: string): ZtoIntentDescriptor {
        return this.descriptors[type];
    }
}

export class ZtoIntentFactory {
    constructor() {}
    create(descriptor: ZtoIntentDescriptor, payload: any): ZtoIntent {
        return {
            type: descriptor.type,
            payload: payload,
        };
    }
}

export function interpretIntent(
    descriptors: ZtoIntentDescriptorRegistery,
    factory: ZtoIntentFactory,
    intentFeedbackFactory: (id: string) => Observable<ZtoIntent>,
) {
    function createFor(intentTypes: string[], payload?: any): ZtoIntent[] {
        return intentTypes.map((intentType: string) => {
            const descriptor = descriptors.find(intentType);
            return factory.create(descriptor, payload);
        });
    }
    function notifyFor(intentTypes: string[], subscriber: Subscriber<ZtoIntent>, payload?: any) {
        const intents = createFor(intentTypes, payload);
        intents.forEach(subscriber.next);
    }
    function factoriesFor(intents: ZtoIntent[]): Observable<ZtoIntent>[] {
        return intents.map((intent: ZtoIntent) => intentFeedbackFactory(intent.id));
    }
    function prepareSideEffect(
        sideEffectFactory: (intent: ZtoIntent) => Observable<any>,
        options?: any
    ): (intent: ZtoIntent) => Observable<any> {
        return (intent: ZtoIntent) => sideEffectFactory(intent).pipe(
            first(),
            timeout(options && options.delayTime !== undefined ? options.delayTime : 0),
        );
    }
    return (intents: Observable<ZtoIntent>) => {
        return new Observable((subscriber: Subscriber<ZtoIntent>) => {
            const subscription: Subscription = intents.subscribe((intent: ZtoIntent) => {
                subscriber.next(ztoIntentActionProcess(intent));
                const descriptor = descriptors.find(intent.type);
                notifyFor(descriptor.independant.before, subscriber, intent.payload);
                const dependantIntents = createFor(descriptor.dependant.before, intent.payload);
                const feedbacks = factoriesFor(dependantIntents);
                zip(...feedbacks).subscribe((dependantIntentResultAggregat: ZtoIntent[]) => {
                    const hasErrors = (resultIntent: ZtoIntent) => resultIntent.status === 'errored';
                    const hasCancels = (resultIntent: ZtoIntent) => resultIntent.status === 'canceled';
                    if (dependantIntentResultAggregat.some(hasErrors)) {
                        subscriber.next(ztoIntentActionError(intent));
                    } else if (dependantIntentResultAggregat.some(hasCancels)) {
                        subscriber.next(ztoIntentActionCancel(intent));
                    } else {

                        // notifyFor(descriptor.independant.after, subscriber, intent.payload);
                    }
                });
            });
            return () => {
                if (subscription.closed !== true) {
                    subscription.unsubscribe();
                }
            };
        });
    };
}
