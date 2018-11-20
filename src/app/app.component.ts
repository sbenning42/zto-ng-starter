import { Component } from '@angular/core';
import { ZtoIntentSystemFacade } from './app-state/zto-intent-system/store/facade';
import { LoggerSelectorResolver } from './app-state/logger/store/intents';
import { StorageSelectorResolver } from './app-state/storage/store/intents';
import { StorageService } from './app-state/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zto-intent-starter';
  constructor(
    public system: ZtoIntentSystemFacade,
    public storage: StorageService
  ) {
    this.system.registerSelector(new LoggerSelectorResolver);
    this.system.registerSelector(new StorageSelectorResolver(this.storage));
  }
}
