import { ZAtom } from './z-atom.model';
import { Subject } from 'rxjs';

export abstract class ZTask extends ZAtom {
    notifier$: Subject<any> = new Subject;
    copy(retainListeners: boolean = true): ZTask {
        const o = this as any;
        return {...(this as any)}
    }
}