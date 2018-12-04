import { ZDictionnary, uuid } from '../helpers/z-tools';
import { Observable } from 'rxjs';

export enum ZFlowAtomAsyncMode {
  race = '[Zto Atom Async Mode] Race',
  all = '[Zto Atom Async Mode] All'
}

export abstract class ZFlowAtom {

  id: string = uuid();

  abstract type: string;
  defProvide?: ZDictionnary;
  asyncMode?: ZFlowAtomAsyncMode;
  injectSymbols?: string[];

  requiresSymbols?: string[];
  provideSymbols?: string[];
  rebindSymbols?: [string, string][];

  revertRequiresSymbols?: string[];
  revertProvideSymbols?: string[];
  revertRebindSymbols?: [string, string][];

  preExecute?(requires: ZDictionnary, ...rest: any[]);
  execute?(requires: ZDictionnary, ...rest: any[]): Observable<ZDictionnary>;
  postExecute?(provide: ZDictionnary, ...rest: any[]);

  preRevert?(requires: ZDictionnary, ...rest: any[]);
  revert?(requires: ZDictionnary, ...rest: any[]): Observable<ZDictionnary>;
  postRevert?(provide: ZDictionnary, ...rest: any[]);

}
