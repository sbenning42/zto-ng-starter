import { Component } from '@angular/core';
import { StorageFlowFacade } from './storage/flows/storage.flows';
import { first, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zto-intent-starter';
  constructor(public storage: StorageFlowFacade) {

    /**
     * Chart:
     *
     *  flow    = Entry point
     *  [name]  = Task or Subflow
     *  => |    = Execute in parallele
     *  ->      = Execute in serie
     *  :       = Task in mode ALL (eg: wait for all parents to resolve before executing)
     *  %       = Task in mode RACE (eg: execute once after the first parent to resolve)
     *  *       = target of the flow (eg: the flow is considered RESOLVED if it's target Task resolve)
     *
     * FLOW:
     *          [log before]
     *  flow => |
     *          [load storage]* -> [log after]
     */
  //  const engine = this.storage.logGet();

    /*
    const cancelObserver = () => console.log('Canceled');

    const runObserver = {
      next: next => console.log('Resolved: ', next),
      error: error => console.error('Errored: ', error),
      complete: () => console.log('Completed')
    };
    */

  //  engine.run$.subscribe(/* runObserver */);
  //  engine.cancels$.subscribe(cancelObserver);

  //  setTimeout(() => console.log('Pause in 1 second ...'), 1000);
  //  setTimeout(() => engine.doPause(), 2000);

  //  setTimeout(() => console.log('Cancel in 1 second ...'), 3000);
  //  setTimeout(() => engine.doCancel(), 4000);

  /*
    setTimeout(() => console.log('Resume in 5 seconds ...'), 5000);
    setTimeout(() => console.log('Resume in 4 seconds ...'), 6000);
    setTimeout(() => console.log('Resume in 3 seconds ...'), 7000);
    setTimeout(() => console.log('Resume in 2 seconds ...'), 8000);
    setTimeout(() => console.log('Resume in 1 seconds ...'), 9000);
    setTimeout(() => engine.doResume(), 10000);
  */

  }
}
