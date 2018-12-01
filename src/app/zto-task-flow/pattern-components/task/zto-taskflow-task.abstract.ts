import { ZtoTaskflowAtom } from '../atom/zto-taskflow-atom.abstract';
import { ZtoTaskflowRetry } from '../retry/zto-taskflow-retry.abstract';

export abstract class ZtoTaskflowTask extends ZtoTaskflowAtom {
  retry?: ZtoTaskflowRetry;
}
