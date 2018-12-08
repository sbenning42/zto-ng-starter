import * as UUIDV4 from 'uuid/v4';
import { ZFlowEngine } from '../models/z-flow-engine';

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

export const noOp: (...args: any[]) => any = () => {};
export const emptyObj: (...args: any[]) => any = () => ({});
export const emptyArr: (...args: any[]) => any[] = () => [];


export const trackEngineLifeCycleObserver = (engine: ZFlowEngine) => ({
  next: next => {
    console.log(`Component for Engine ${engine.flow.type} Got Flow Next: `, next);
  },
  error: error => {
    console.error(`Component for Engine ${engine.flow.type} Got Flow Error: `, error);
  },
  complete: () => {
    console.log(`Component for Engine ${engine.flow.type} Got Flow Complete`);
    engine.drop();
  },
});
