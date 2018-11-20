import { Injectable } from "@angular/core";
import { Store, select, Action } from "@ngrx/store";
import { Observable } from "rxjs";
import { ZtoIntentSystemState } from "./state";
import {
    ztoIntentSystemRootSelector,
    ztoIntentSystemProcessingSelector,
    ztoIntentSystemAllResolvedSelector,
    ztoIntentSystemResolvedSelector,
    ztoIntentSystemErroredSelector,
    ztoIntentSystemCanceledSelector,
    ztoIntentSystemByIdSelector
} from "./selectors";
import { ZtoIntent, ZtoIntentSelector } from "./models";
import {
    ZtoIntentSystemProcess,
    ZtoIntentSystemResolve,
    ZtoIntentSystemError,
    ZtoIntentSystemCancel
} from "./actions";
import { ZtoIntentSelectorResolver } from "./tools";

@Injectable()
export class ZtoIntentSystemFacade {

    private resolvers: ZtoIntentSelectorResolver[] = [];
    
    state$: Observable<ZtoIntentSystemState> = this.store.pipe(select(ztoIntentSystemRootSelector));
    
    processing$: Observable<{[id: string]: ZtoIntent}> = this.store.pipe(select(ztoIntentSystemProcessingSelector));
    allResolved$: Observable<{[id: string]: ZtoIntent}> = this.store.pipe(select(ztoIntentSystemAllResolvedSelector));
    resolved$: Observable<{[id: string]: ZtoIntent}> = this.store.pipe(select(ztoIntentSystemResolvedSelector));
    errored$: Observable<{[id: string]: ZtoIntent}> = this.store.pipe(select(ztoIntentSystemErroredSelector));
    canceled$: Observable<{[id: string]: ZtoIntent}> = this.store.pipe(select(ztoIntentSystemCanceledSelector));

    intentById: (id: string) => Observable<ZtoIntent> = (id: string) => this.store.pipe(select(ztoIntentSystemByIdSelector(id)));
    
    constructor(private store: Store<any>) {}

    private dispatch(action: Action) {
        this.store.dispatch(action);
    }
    registerSelector(resolver: ZtoIntentSelectorResolver) {
        this.resolvers.push(resolver);
    }
    resolveSelector(selector: ZtoIntentSelector): ZtoIntent {
        let resolvedIntent: ZtoIntent;
        this.resolvers.find((resolver: ZtoIntentSelectorResolver) => {
            resolvedIntent = resolver.resolve(selector);
            return !!resolvedIntent;
        });
        return resolvedIntent;
    }

    process(intent: ZtoIntent) {
        const action = ZtoIntentSystemProcess({intent});
        this.dispatch(action);
    }
    resolve(intent: ZtoIntent) {
        const action = ZtoIntentSystemResolve({intent});
        this.dispatch(action);
    }
    error(intent: ZtoIntent) {
        const action = ZtoIntentSystemError({intent});
        this.dispatch(action);
    }
    cancel(intent: ZtoIntent) {
        const action = ZtoIntentSystemCancel({intent});
        this.dispatch(action);
    }
}