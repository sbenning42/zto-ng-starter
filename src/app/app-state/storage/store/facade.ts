import { Injectable } from "@angular/core";
import { Store, Action } from "@ngrx/store";
import { StorageEntries } from "../storage.models";
import { StorageFetchIntent, StorageSaveIntent, StorageRemoveIntent, StorageClearIntent } from "./intents";
import { StorageService } from "../storage.service";

@Injectable()
export class StorageFacade {
    constructor(private store: Store<any>, public service: StorageService) {}
    private dispatch(action: Action) {
        this.store.dispatch(action);
    }
    fetch() {
        const intent = new StorageFetchIntent(this.service);
        this.dispatch(intent);
    }
    save(entries: StorageEntries) {
        const intent = new StorageSaveIntent({entries}, this.service);
        this.dispatch(intent);
    }
    remove(keys: string[]) {
        const intent = new StorageRemoveIntent({keys}, this.service);
        this.dispatch(intent);
    }
    clear() {
        const intent = new StorageClearIntent(this.service);
        this.dispatch(intent);
    }
}