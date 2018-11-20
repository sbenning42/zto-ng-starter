import { ZtoIntent, ZtoIntentFlow, ZtoIntentResolver, ZtoIntentSelectorExtra, ZtoIntentSelector } from "../../zto-intent-system/store/models";
import { StorageEntries } from "../storage.models";
import { StorageService } from "../storage.service";
import { LoggerIntentType } from "../../logger/store/intents";
import { ZtoIntentSelectorResolver } from "../../zto-intent-system/store/tools";

export enum StorageIntentType {
    fetch = '[Storage] Fetch',
    save = '[Storage] Save',
    remove = '[Storage] Remove',
    clear = '[Storage] Clear',
}

export class StorageFetchIntent extends ZtoIntent {
    constructor(service: StorageService) {
        super(
            StorageIntentType.fetch,
            undefined, {service},
            new ZtoIntentFlow(
                new ZtoIntentResolver(() => this.params.service.getAll()),
                [
                    new ZtoIntentSelectorExtra(LoggerIntentType.log, {messages: ['Fetching storage start ...']}),
                ], [], [],
                [
                    new ZtoIntentSelectorExtra(LoggerIntentType.log, {messages: ['Fetching storage success.']}),
                ],
                [
                    new ZtoIntentSelectorExtra(LoggerIntentType.log, {messages: ['Fetching storage failed.']}),
                ],
                [
                    new ZtoIntentSelectorExtra(LoggerIntentType.log, {messages: ['Fetching storage was canceled.']}),
                ]
            )
        );
    }
}
export class StorageSaveIntent extends ZtoIntent {
    constructor(payload: {entries: StorageEntries}, service: StorageService) {
        super(
            StorageIntentType.save,
            payload, {service},
            new ZtoIntentFlow(
                new ZtoIntentResolver(() => this.params.service.save(this.payload.entries)),
                [], [], [], [], [], []
            ),
        );
    }
}
export class StorageRemoveIntent extends ZtoIntent {
    constructor(payload: {keys: string[]}, service: StorageService) {
        super(
            StorageIntentType.remove,
            payload, {service},
            new ZtoIntentFlow(
                new ZtoIntentResolver(() => this.params.service.remove(this.payload.keys)),
                [], [], [], [], [], []
            ),
        );
    }
}
export class StorageClearIntent extends ZtoIntent {
    constructor(service: StorageService) {
        super(
            StorageIntentType.clear,
            undefined, {service},
            new ZtoIntentFlow(
                new ZtoIntentResolver(() => this.params.service.clear()),
                [], [], [], [], [], []
            )
        );
    }
}

export type StorageIntents = StorageFetchIntent|StorageSaveIntent|StorageRemoveIntent|StorageClearIntent;

export class StorageSelectorResolver extends ZtoIntentSelectorResolver {
    constructor(public service: StorageService) {
        super();
    }
    resolve(selector: ZtoIntentSelector) {
        const extra = typeof(selector) === 'string' ? {type: selector} : selector;
        switch (extra.type) {
            case StorageIntentType.fetch:
                return new StorageFetchIntent(this.service);
            case StorageIntentType.save:
                return new StorageSaveIntent(extra.payload, this.service);
            case StorageIntentType.remove:
                return new StorageRemoveIntent(extra.payload, this.service);
            case StorageIntentType.clear:
                return new StorageClearIntent(this.service);
            default:
                return undefined;
        }
    }
}
