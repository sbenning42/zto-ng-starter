import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StorageState } from './storage.state';
import { selectStorage, selectStorageLoaded, selectStorageEntries } from './storage.selectors';
import { StorageEntries } from '../storage.models';
import { StorageLoad, StorageSave, StorageRemove, StorageClear } from './storage.actions';

@Injectable()
export class StorageFacade {

  storage$: Observable<StorageState> = this.store.pipe(select(selectStorage));
  loaded$: Observable<boolean> = this.store.pipe(select(selectStorageLoaded));
  entries$: Observable<StorageEntries> = this.store.pipe(select(selectStorageEntries));

  constructor(private store: Store<any>) { }

  load(storageEntries: StorageEntries) {
    this.store.dispatch(new StorageLoad({ storageEntries }));
  }
  save(storageEntries: StorageEntries) {
    this.store.dispatch(new StorageSave({ storageEntries }));
  }
  remove(keys: string[]) {
    this.store.dispatch(new StorageRemove({ keys }));
  }
  clear() {
    this.store.dispatch(new StorageClear);
  }

}
