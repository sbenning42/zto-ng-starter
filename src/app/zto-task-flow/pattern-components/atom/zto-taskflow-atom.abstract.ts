import { ZtoDictionnary } from '../../helpers/zto-dictionnary.model';
import { uuid } from '../../helpers/zto-uuid';
import { Observable, empty } from 'rxjs';
import { ZtoTaskflowAtomMode } from './zto-taskflow-atom-mode.enum';

export abstract class ZtoTaskflowAtom {

  abstract TYPE: string;
  MODE?: ZtoTaskflowAtomMode = ZtoTaskflowAtomMode.race;
  DEF_PROVIDE?: ZtoDictionnary = {};

  INJECT?: Array<string> = [];

  REQUIRES?: Array<string> = [];
  PROVIDE?: Array<string> = [];
  REBIND?: Array<ZtoDictionnary> = [];

  REVERT_REQUIRES?: Array<string> = [];
  REVERT_PROVIDE?: Array<string> = [];
  REVERT_REBIND?: Array<ZtoDictionnary> = [];

  id: string = uuid();
  injected: ZtoDictionnary = new ZtoDictionnary;


  execute(requires?: ZtoDictionnary, ...rest: any[]): Observable<ZtoDictionnary> {
    return empty();
  }

  revert(requires?: ZtoDictionnary, ...rest: any[]): Observable<ZtoDictionnary> {
    return empty();
  }

}
