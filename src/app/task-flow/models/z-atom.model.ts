import { ZDictionary } from './z-dictionary.model';

export abstract class ZAtom {
    version: string;
    saveAs: ZDictionary;
    priority = 0;
    constructor(
        public name?: string,
        public provides?: ZDictionary,
        public inject?: ZDictionary,
        public requires?: ZDictionary,
        public rebind?: ZDictionary,
        public revertRequires?: ZDictionary,
        public revertRebind?: ZDictionary,
        public ignoreList?: ZDictionary,
        public autoExtract: boolean = true,
    ) {}
    preExecute?(): void {}
    postExecute?(): void {}
    preRevert?(): void {}
    postRevert?(): void {}
    execute?(args: any[], kwargs: ZDictionary, ...others: any[]): any {}
    revert?(args: any[], kwargs: ZDictionary, ...others: any[]): any {}
}
