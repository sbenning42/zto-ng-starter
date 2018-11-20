import { ZtoIntent, ZtoIntentFlow, ZtoIntentResolver, ZtoIntentSelector } from "../../zto-intent-system/store/models";
import { ZtoIntentSelectorResolver } from "../../zto-intent-system/store/tools";
import { of } from "rxjs";

export enum LoggerIntentType {
    log = '[Logger] Log',
}

export class LoggerLogIntent extends ZtoIntent {
    constructor(payload: {messages: any[]}) {
        super(
            LoggerIntentType.log,
            payload, {service: console},
            new ZtoIntentFlow(
                new ZtoIntentResolver(() => {
                    this.params.service.log(...this.payload.messages);
                    return of(this.payload.messages);
                }),
                [], [], [], [], [], []
            )
        );
    }
}
