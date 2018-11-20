import { ZtoIntentSystemModule } from './zto-intent-system.module';

describe('ZtoIntentSystemModule', () => {
  let ztoIntentSystemModule: ZtoIntentSystemModule;

  beforeEach(() => {
    ztoIntentSystemModule = new ZtoIntentSystemModule();
  });

  it('should create an instance', () => {
    expect(ztoIntentSystemModule).toBeTruthy();
  });
});
