import { ZtoActionSystemModule } from './zto-action-system.module';

describe('ZtoActionSystemModule', () => {
  let ztoActionSystemModule: ZtoActionSystemModule;

  beforeEach(() => {
    ztoActionSystemModule = new ZtoActionSystemModule();
  });

  it('should create an instance', () => {
    expect(ztoActionSystemModule).toBeTruthy();
  });
});
