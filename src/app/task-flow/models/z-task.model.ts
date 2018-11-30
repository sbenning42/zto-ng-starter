import { ZAtom } from './z-atom.model';
import { Subject } from 'rxjs';

export abstract class ZTask extends ZAtom {
  notifier$: Subject<any> = new Subject();
  progress = 0;
  copy(retainListeners: boolean = true): ZTask {
    const o = this as any;
    return {
      ...(this as any),
      notifier$: retainListeners ? this.notifier$ : new Subject()
    };
  }
  upgradeProgress(progress: number) {
    this.progress = progress;
    this.notifier$.next(progress);
  }
}
