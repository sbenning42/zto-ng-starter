import * as UUIDV4 from 'uuid/v4';

export function uuid() {
  return UUIDV4();
}

export class ZDictionnaryContract<T = any> {
  [key: string]: T;
}

export class ZDictionnary<T = any> extends ZDictionnaryContract<T> {
  constructor(source: Array<any> | { [key: string]: T } = {}, selectorFn?: (item: T) => string) {
    super();
    const entries = Array.isArray(source)
      ? source.map(item => [selectorFn(item), item])
      : Object.entries(source);
    const assignToThis = ([key, item]: [string, T]) => this[key] = item;
    entries.forEach(assignToThis);
  }
}
