import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, Effect } from '@ngrx/effects';
import { Observable, of, NEVER } from "rxjs";
import { filter, tap, first, timeout, defaultIfEmpty, map, catchError, takeUntil, mergeMap } from 'rxjs/operators';

import { ZtoIntentSystemFacade } from './facade';
import { ZtoIntent, ZtoIntentStatus, ZtoIntentSelector } from "./models";

@Injectable()
export class ZtoIntentSystemEffects {
    constructor(
        public actions: Actions,
        public system: ZtoIntentSystemFacade,
        public store: Store<any>
    ) {}
    @Effect({dispatch: false})
    interceptIntents = this.actions.pipe(
        filter((intent: ZtoIntent) => !!intent.id),
        tap((intent: ZtoIntent) => {
            // console.log('Intercept intent: ', intent);
        }),
        tap((intent: ZtoIntent) => {
            this.system.process(intent);
        }),
        tap((intent: ZtoIntent) => {
            if (intent.flow && intent.flow.independantBefore && intent.flow.independantBefore.length > 0) {
                this.dispatchAllSync(intent.flow.independantBefore);
            }
        }),
        tap((intent: ZtoIntent) => {
            if (intent.flow && intent.flow.resolver) {
                const source$ = this.prepare(intent.flow.resolver.sourceFactory(intent), NEVER);
                source$.subscribe((result: {status: ZtoIntentStatus, data: any}) => {
                    switch (result.status) {
                        case ZtoIntentStatus.resolved: {
                            if (intent.flow.independantAfter && intent.flow.independantAfter.length > 0) {
                                this.dispatchAllSync(intent.flow.independantAfter);
                            }
                            intent.results = result.data;
                            this.system.resolve(intent);
                            if (intent.flow.onResolve) {
                                this.dispatchAllSync(intent.flow.onResolve);
                            }
                            break ;
                        }
                        case ZtoIntentStatus.errored: {
                            intent.results = result.data;
                            this.system.error(intent);
                            if (intent.flow.onError) {
                                this.dispatchAllSync(intent.flow.onError);
                            }
                            break ;
                        }
                        case ZtoIntentStatus.canceled: {
                            if (intent.flow.onCancel) {
                                this.dispatchAllSync(intent.flow.onCancel);
                            }
                        }
                        case ZtoIntentStatus.idle:
                        case ZtoIntentStatus.processing:
                        default:
                            break;
                    }
                });
            }
        })
    );

    prepare(
        source$: Observable<any>,
        cancels$: Observable<any>,
    ): Observable<any> {
        return source$.pipe(
            first(),
            map((result: any) => ({status: ZtoIntentStatus.resolved, data: result})),
            defaultIfEmpty({status: ZtoIntentStatus.canceled}),
            takeUntil(cancels$),
            timeout(15000),
            catchError((error: Error) => {
                return of({status: ZtoIntentStatus.errored, data: error});
            })
        );
    }

    dispatchAllSync(selectors: ZtoIntentSelector[]) {
        selectors
            .map((selector: ZtoIntentSelector) => this.system.resolveSelector(selector))
            .forEach((intent: ZtoIntent) => this.store.dispatch(intent));
    }
}