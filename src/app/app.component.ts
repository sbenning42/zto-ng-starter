import { Component } from '@angular/core';
import { StorageFlowFacade } from './storage/flows/storage.flows';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zto-intent-starter';
  constructor(public storage: StorageFlowFacade) {
    this.storage.logGet().subscribe();
  }
}
