import { AppStateModule } from './app-state.module';

describe('AppStateModule', () => {
  let appStateModule: AppStateModule;

  beforeEach(() => {
    appStateModule = new AppStateModule();
  });

  it('should create an instance', () => {
    expect(appStateModule).toBeTruthy();
  });
});
