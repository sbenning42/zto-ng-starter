import { Component, OnInit } from '@angular/core';
import { StorageFlowFacade } from '../flows/storage.flows';
import { Observable } from 'rxjs';
import { StorageEntries } from '../storage.models';
import { ZtoTaskflowEngine } from '../../zto-task-flow/pattern-engine/zto-taskflow-engine.model';
import { ZtoTaskflowFacade } from '../../zto-task-flow/pattern-store/zto-taskflow.facade';
import { map, filter } from 'rxjs/operators';
import { StorageFacade } from '../store/storage.facade';

@Component({
  selector: 'app-storage-facade-container',
  templateUrl: './storage-facade-container.component.html',
  styleUrls: ['./storage-facade-container.component.css']
})
export class StorageFacadeContainerComponent implements OnInit {

  getRunner: ZtoTaskflowEngine;
  saveRunner: ZtoTaskflowEngine;
  removeRunner: ZtoTaskflowEngine;
  clearRunner: ZtoTaskflowEngine;

  loaded$: Observable<boolean> = this.facade.loaded$;
  entries$: Observable<StorageEntries> = this.facade.entries$;

  constructor(
    public facade: StorageFacade,
    public storage: StorageFlowFacade
  ) { }

  ngOnInit() {
  }

  get(keys?: string[]) {
    this.getRunner = this.storage.logGet(keys);
    this.getRunner.run$.subscribe();
  }
  save(entries: StorageEntries) {
    this.saveRunner = this.storage.logSave(entries);
    this.saveRunner.run$.subscribe();
  }
  remove(keys?: string[]) {
    this.removeRunner = this.storage.logRemove(keys);
    this.removeRunner.run$.subscribe();
  }
  clear() {
    this.clearRunner = this.storage.logClear();
    this.clearRunner.run$.subscribe();
  }

  cancelGet() {
    this.getRunner.doCancel();
  }
  cancelSave() {
    this.saveRunner.doCancel();
  }
  cancelRemove() {
    this.removeRunner.doCancel();
  }
  cancelClear() {
    this.clearRunner.doCancel();
  }

}
