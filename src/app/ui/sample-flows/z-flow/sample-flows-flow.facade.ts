import { Injectable } from '@angular/core';
import { ZFlowStoreService } from 'src/app/z-flow-redux/services/z-flow-store.service';
import { LoggerFlowFacade } from 'src/app/logger/z-flow/logger-flow.facade';
import { ToastFlowFacade } from 'src/app/toast/z-flow/toast-flow.facade';
import { StorageFlowFacade } from 'src/app/storage/z-flow/storage-flow.facade';

@Injectable()
export class SampleFlowsFlowFacade {
  constructor(
    public zFlowStoreService: ZFlowStoreService,
    public logger: LoggerFlowFacade,
    public toast: ToastFlowFacade,
    public storage: StorageFlowFacade,
  ) {}
}
