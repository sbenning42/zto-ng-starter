import { Component, OnInit } from '@angular/core';
import { StorageFacade } from '../../storage/store/storage.facade';
import { Observable } from 'rxjs';
import { StorageEntries } from '../../storage/storage.models';
import { NOOP } from '../../zto-action-system/zas.functions';

@Component({
  selector: 'app-storage-facade-container',
  templateUrl: './storage-facade-container.component.html',
  styleUrls: ['./storage-facade-container.component.css']
})
export class StorageFacadeContainerComponent implements OnInit {

  loaded$: Observable<boolean> = this.storage.loaded$;
  entries$: Observable<StorageEntries> = this.storage.entries$;

  actions: { [name: string]: any } = {
    load: { cancel: NOOP, closed$: undefined },
    save: { cancel: NOOP, closed$: undefined },
    remove: { cancel: NOOP, closed$: undefined },
    clear: { cancel: NOOP, closed$: undefined },
  };
  constructor(public storage: StorageFacade) { }

  ngOnInit() {
  }

  load(keys?: string[]) {
    const load = this.storage.lazyLoadFactory(keys);
    this.actions.load.cancel = load.cancels.async;
    this.actions.load.closed$ = load.closed$;
    load.dispatch();
  }
  save(entries: StorageEntries) {
    const save = this.storage.lazySaveFactory(entries);
    this.actions.save.cancel = save.cancels.async;
    this.actions.save.closed$ = save.closed$;
    save.dispatch();
  }
  remove(keys?: string[]) {
    const remove = this.storage.lazyRemoveFactory(keys);
    this.actions.remove.cancel = remove.cancels.async;
    this.actions.remove.closed$ = remove.closed$;
    remove.dispatch();
  }
  clear() {
    const clear = this.storage.lazyClearFactory();
    this.actions.clear.cancel = clear.cancels.async;
    this.actions.clear.closed$ = clear.closed$;
    clear.dispatch();
  }

  cancelLoad() {
    this.actions.load.cancel();
  }
  cancelSave() {
    this.actions.save.cancel();
  }
  cancelRemove() {
    this.actions.remove.cancel();
  }
  cancelClear() {
    this.actions.clear.cancel();
  }

}
