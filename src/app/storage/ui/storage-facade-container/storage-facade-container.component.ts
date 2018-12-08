import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageEntries } from '../../storage.models';
import { ZFlowEngine } from 'src/app/z-flow-redux/models/z-flow-engine';
import { StorageFlowFacade } from '../../z-flow/storage-flow.facade';
import { trackEngineLifeCycleObserver } from 'src/app/z-flow-redux/helpers/z-tools';
import { StorageSymbol } from '../../z-flow/storage.tasks';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-storage-facade-container',
  templateUrl: './storage-facade-container.component.html',
  styleUrls: ['./storage-facade-container.component.css']
})
export class StorageFacadeContainerComponent implements OnInit {

  loaded$: Observable<boolean> = this.storage.zFlowStoreService.globalData<StorageEntries>(StorageSymbol.storageEntries).pipe(
    map(entries => !!entries)
  );
  entries$: Observable<StorageEntries> = this.storage.zFlowStoreService.globalData<StorageEntries>(StorageSymbol.storageEntries);

  loadEngine: ZFlowEngine;
  saveEngine: ZFlowEngine;
  removeEngine: ZFlowEngine;
  clearEngine: ZFlowEngine;

  constructor(
    public storage: StorageFlowFacade
  ) { }

  ngOnInit() {
  }

  load(keys?: string[]) {
    this.loadEngine = this.storage.load(keys);
    this.loadEngine.start().subscribe(
      trackEngineLifeCycleObserver(this.loadEngine)
    );
  }
  pauseLoad() {
    if (!this.loadEngine) {
      return ;
    }
    this.loadEngine.pause();
  }
  resumeLoad() {
    if (!this.loadEngine) {
      return ;
    }
    this.loadEngine.resume();
  }
  cancelLoad() {
    if (!this.loadEngine) {
      return ;
    }
    this.loadEngine.cancel();
  }

  save(entries: StorageEntries) {
    this.saveEngine = this.storage.save(entries);
    this.saveEngine.start().subscribe(
      trackEngineLifeCycleObserver(this.saveEngine)
    );
  }
  pauseSave() {
    if (!this.saveEngine) {
      return ;
    }
    this.saveEngine.pause();
  }
  resumeSave() {
    if (!this.saveEngine) {
      return ;
    }
    this.saveEngine.resume();
  }
  cancelSave() {
    if (!this.saveEngine) {
      return ;
    }
    this.saveEngine.cancel();
  }

  remove(keys?: string[]) {
    this.removeEngine = this.storage.remove(keys);
    this.removeEngine.start().subscribe(
      trackEngineLifeCycleObserver(this.removeEngine)
    );
  }
  pauseRemove() {
    if (!this.removeEngine) {
      return ;
    }
    this.removeEngine.pause();
  }
  resumeRemove() {
    if (!this.removeEngine) {
      return ;
    }
    this.removeEngine.resume();
  }
  cancelRemove() {
    if (!this.removeEngine) {
      return ;
    }
    this.removeEngine.cancel();
  }

  clear() {
    this.clearEngine = this.storage.clear();
    this.clearEngine.start().subscribe(
      trackEngineLifeCycleObserver(this.clearEngine)
    );
  }
  pauseClear() {
    if (!this.clearEngine) {
      return ;
    }
    this.clearEngine.pause();
  }
  resumeClear() {
    if (!this.clearEngine) {
      return ;
    }
    this.clearEngine.resume();
  }
  cancelClear() {
    if (!this.clearEngine) {
      return ;
    }
    this.clearEngine.cancel();
  }

}
