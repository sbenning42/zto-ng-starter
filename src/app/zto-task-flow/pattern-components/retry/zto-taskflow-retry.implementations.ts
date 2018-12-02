import { ZtoTaskflowRetry } from './zto-taskflow-retry.abstract';
import { ZtoTaskflowRetryType } from './zto-taskflow-retry-type.enum';
import { ZtoTaskflowRetryDecision } from './zto-taskflow-retry-decision.enum';
import { ZtoDictionnary } from '../../helpers/zto-dictionnary.model';
import { of, Observable } from 'rxjs';

export class ZtoTaskflowCountRetry extends ZtoTaskflowRetry {
  TYPE = ZtoTaskflowRetryType.countRetry;
  REQUIRES = ['retryCount', 'retryTime'];
  PROVIDE = ['retryTime'];
  onFailure(requires: ZtoDictionnary): ZtoTaskflowRetryDecision {
    const retryCount = requires.retryCount || 0;
    const retryTime = requires.retryTime || 0;
    return retryTime < retryCount ? ZtoTaskflowRetryDecision.retry : undefined;
  }
  execute(requires: ZtoDictionnary): Observable<ZtoDictionnary> {
    return of({
      ...requires,
      retryTime: (requires.retryTime || 0) + 1
    });
  }
}
