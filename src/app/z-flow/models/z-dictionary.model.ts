export class ZDictionary<T = any> {
    [key: string]: T;
    constructor(arr: Array<T>, selector: string) {
        arr.forEach(item => this[item[selector]] = item);
    }
}