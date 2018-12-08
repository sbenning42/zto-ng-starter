import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './storage.service';
import { StorageFacadePresenterComponent } from './storage-facade-presenter/storage-facade-presenter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StorageFacadeContainerComponent } from './storage-facade-container/storage-facade-container.component';
import { StoreModule } from '@ngrx/store';
import { storageStoreSelectorKey } from './store/storage.selectors';
import { storageReducer } from './store/storage.reducer';
import { StorageFacade } from './store/storage.facade';
import { StorageFlowFacade } from './z-flow/storage-flow.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature(storageStoreSelectorKey, storageReducer),
  ],
  declarations: [StorageFacadePresenterComponent, StorageFacadeContainerComponent],
  providers: [
    StorageService,
    StorageFacade,
    StorageFlowFacade
  ],
  exports: [StorageFacadeContainerComponent]
})
export class StorageModule { }
