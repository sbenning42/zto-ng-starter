import { ZtoIntent, ZtoIntentFlow, ZtoIntentResolver, ZtoIntentSelectorExtra, ZtoIntentSelector } from "../../zto-intent-system/store/models";
import { StorageEntries } from "../storage.models";
import { StorageService } from "../storage.service";
import { LoggerIntentType, LoggerLogIntent } from "../../logger/store/intents";
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
                    {factory: (data?: any) => new LoggerLogIntent({messages: ['Fetching storage start ...']})}
                ], [], [],
                [
                    {factory: (data?: any) => new LoggerLogIntent({messages: ['Fetching storage success. Got result: ', data]})}
                ],
                [
                    {factory: (data?: any) => new LoggerLogIntent({messages: ['Fetching storage failed.']})}
                ],
                [
                    {factory: (data?: any) => new LoggerLogIntent({messages: ['Fetching storage canceled.']})}
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
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Saving storage start ...']}}
                ], [], [],
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Saving storage success.']}}
                ],
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Saving storage failed.']}}
                ],
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Saving storage canceled.']}}
                ]
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
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Removing storage start ...']}}
                ], [], [],
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Fetching storage success.']}}
                ],
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Fetching storage failed.']}}
                ],
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Fetching storage canceled.']}}
                ]
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
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Fetching storage start ...']}}
                ], [], [],
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Fetching storage success.']}}
                ],
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Fetching storage failed.']}}
                ],
                [
                    {factory: (payload: {messages: any[]}) => new LoggerLogIntent(payload), staticPayload: {messages: ['Fetching storage canceled.']}}
                ]
            )
        );
    }
}

export type StorageIntents = StorageFetchIntent|StorageSaveIntent|StorageRemoveIntent|StorageClearIntent;

