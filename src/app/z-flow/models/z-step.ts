import { ZStepStatus } from './z-step-status';

export class ZStep<T = any> {
  constructor(
    public status: ZStepStatus,
    public data?: T,
  ) {}
}
