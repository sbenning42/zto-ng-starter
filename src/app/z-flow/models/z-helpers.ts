import * as UUID from 'uuid/v4';

export const uuid = () => UUID();

export class ZDictionary<T = any> {
  [key: string]: T;
  constructor(o?: any) {
    const assignToThis = ([key, value]: [string, any]) => this[key] = value;
    Object.entries(o || {}).forEach(assignToThis);
  }
}
export class ZDictionaryFromArray<T = any> implements ZDictionary<T> {
  [key: string]: T;
  constructor(array?: Array<T>, itemField?: string) {
    if (Array.isArray(array)) {
      // filter predicate: be sure that itemField is a string and that item[itemField] is a string as well
      const validateItem = item => !!item
        && typeof (itemField) === 'string'
        && typeof (item[itemField]) === 'string';
      const assignToThis = item => this[item[itemField]] = item;
      array.filter(validateItem).forEach(assignToThis);
    }
  }
}
