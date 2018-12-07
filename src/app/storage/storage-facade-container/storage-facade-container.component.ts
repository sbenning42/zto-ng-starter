import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageEntries } from '../storage.models';
import { map, filter } from 'rxjs/operators';
import { StorageFacade } from '../store/storage.facade';

@Component({
  selector: 'app-storage-facade-container',
  templateUrl: './storage-facade-container.component.html',
  styleUrls: ['./storage-facade-container.component.css']
})
export class StorageFacadeContainerComponent implements OnInit {

  loaded$: Observable<boolean> = this.facade.loaded$;
  entries$: Observable<StorageEntries> = this.facade.entries$;

  constructor(
    public facade: StorageFacade,
  ) { }

  ngOnInit() {
  }

  get(keys?: string[]) {
  }
  save(entries: StorageEntries) {
  }
  remove(keys?: string[]) {
  }
  clear() {
  }

  cancelGet() {
  }
  cancelSave() {
  }
  cancelRemove() {
  }
  cancelClear() {
  }

}
