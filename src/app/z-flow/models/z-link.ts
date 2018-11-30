import { ZHistory } from './z-history';
import { ZDeciderDepth } from './z-decider-depth';

export class ZLink {
  constructor(
    readonly providerName: string,
    readonly dependantName: string,
    readonly decider: (history: ZHistory) => boolean = () => true,
    readonly deciderDepth: ZDeciderDepth = ZDeciderDepth.all,
  ) {}
}
