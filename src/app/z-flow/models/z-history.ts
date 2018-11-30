import { ZDictionary } from './z-helpers';

export class ZHistory {
  failure: ZDictionary<Error>;
  outcomes: ZDictionary;
}
