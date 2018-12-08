import { Injectable } from '@angular/core';
import { ZFlowStoreService } from 'src/app/z-flow-redux/services/z-flow-store.service';
import { LoggerFlowFacade } from 'src/app/logger/z-flow/logger-flow.facade';
import { ToastFlowFacade } from 'src/app/toast/z-flow/toast-flow.facade';
import { StorageFlowFacade } from 'src/app/storage/z-flow/storage-flow.facade';
import { ZFlowEngine, ZFlowEngineOptions } from 'src/app/z-flow-redux/models/z-flow-engine';
import { ZDictionnary } from 'src/app/z-flow-redux/helpers/z-tools';
import { SampleFlowsFlowSample1, SampleFlowsSymbol, SampleFlowsFlowSample2 } from './sample-flows.flows';

@Injectable()
export class SampleFlowsFlowFacade {

  injector: ZDictionnary;

  constructor(
    public zFlowStoreService: ZFlowStoreService,
    public logger: LoggerFlowFacade,
    public toast: ToastFlowFacade,
    public storage: StorageFlowFacade,
  ) {
    this.injector = {
      ...this.logger.injector,
      ...this.storage.injector,
      ...this.toast.injector,
    };
  }

  sample1(): ZFlowEngine {
    return new ZFlowEngine(
      new SampleFlowsFlowSample1,
      this.zFlowStoreService,
      this.injector,
      {
        [SampleFlowsSymbol.sample1LogBeforeMessages]: ['Launching Flow Sample 1'],
        [SampleFlowsSymbol.sample1ToastOpenBeforeMessage]: 'Launching Flow Sample 1',
        [SampleFlowsSymbol.sample1LogAfterMessages]: ['Flow Sample 1 Executed with Success'],
        [SampleFlowsSymbol.sample1ToastOpenAfterMessage]: 'Flow Sample 1 Executed with Success',
      }
    );
  }
  sample2(engineOptions?: ZFlowEngineOptions): ZFlowEngine {
    return new ZFlowEngine(
      new SampleFlowsFlowSample2,
      this.zFlowStoreService,
      this.injector,
      {
        [SampleFlowsSymbol.sample2LogBeforeMessages]: ['Launching Flow Sample 2'],
        [SampleFlowsSymbol.sample2ToastOpenBeforeMessage]: 'Launching Flow Sample 2',
        [SampleFlowsSymbol.sample2LogAfterMessages]: ['Flow Sample 2 Executed with Success'],
        [SampleFlowsSymbol.sample2ToastOpenAfterMessage]: 'Flow Sample 2 Executed with Success',
      },
      engineOptions
    );
  }
  sample3(): ZFlowEngine {
    return new ZFlowEngine(
      undefined,
      this.zFlowStoreService,
      this.injector,
      {}
    );
  }
  sample4(): ZFlowEngine {
    return new ZFlowEngine(
      undefined,
      this.zFlowStoreService,
      this.injector,
      {}
    );
  }

}
