import { Component } from '@angular/core';
import { ToastFacade } from './app-state/toast/store/toast.facade';
import { test } from './app-state/storage/storage.flow';
import { StorageService } from './app-state/storage/storage.service';
import { ZDictionary } from './z-flow/models/z-helpers';
import { LoggerService } from './app-state/logger/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zto-intent-starter';
  constructor(
    public toast: ToastFacade,
    public storageService: StorageService,
    public loggerService: LoggerService
  ) {
    test(new ZDictionary({storageService, loggerService}));
  }
}
