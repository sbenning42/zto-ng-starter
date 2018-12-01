import { ZtoTaskflowAtom } from '../atom/zto-taskflow-atom.abstract';
import { ZtoTaskflowRetryDecision } from './zto-taskflow-retry-decision.enum';
import { ZtoDictionnary } from '../../helpers/zto-dictionnary.model';
import { ZtoTaskflowHistory } from '../history/zto-taskflow-history.model';
import { Observable, empty } from 'rxjs';

export abstract class ZtoTaskflowRetry extends ZtoTaskflowAtom {

  abstract onFailure(requires?: ZtoDictionnary, history?: ZtoTaskflowHistory): ZtoTaskflowRetryDecision;

  execute(requires?: ZtoDictionnary, history?: ZtoTaskflowHistory): Observable<ZtoDictionnary> {
    return empty();
  }

  revert(requires?: ZtoDictionnary, history?: ZtoTaskflowHistory): Observable<ZtoDictionnary> {
    return empty();
  }

}
