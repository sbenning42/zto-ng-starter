import { ZDictionary } from "./z-dictionary.model";

export abstract class ZAtom {
    abstract version: string;
    saveAs: ZDictionary;
    priority: number = 0;
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
    abstract preExecute(): void;
    abstract execute(args: any[], kwargs: ZDictionary): any;
    abstract postExecute(): void;
    abstract preRevert(): void;
    abstract revert(args: any[], kwargs: ZDictionary): any;
    abstract postRevert(): void;
}
