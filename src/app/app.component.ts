import { Component } from '@angular/core';
import { LoggerFlowFacade } from './logger/flows/logger.flows';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zto-intent-starter';
  constructor(
    public loggerFlowFacade: LoggerFlowFacade,
  ) {
    this.loggerFlowFacade.log('Hello World').subscribe();
    this.loggerFlowFacade.error('Bye World').subscribe();
  }
}
