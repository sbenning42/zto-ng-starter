import { ZDictionary } from './z-dictionary.model';

export class ZHistory {
  failure?: Error;
  _outcomes: Error[] = [];
  _provided: ZDictionary = new ZDictionary;
  outcomes(index?: number): Error|Error[] {
    return index === undefined ? this._outcomes : this._outcomes[index];
  }
  provided(): ZDictionary {
    return this._provided;
  }
  causedBy(name: string, index?: number, includeRetry: boolean = false): boolean {
    return this.failure && this.failure.name === name
      || (
        includeRetry && (
          index === undefined
            ? this._outcomes.some(e => e.name === name)
            : (this._outcomes[index] && this._outcomes[index].name === name)
        )
      );
  }
}
