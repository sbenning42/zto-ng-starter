import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './storage.service';
import { StorageFacade } from './store/storage.facade';
import { EffectsModule } from '@ngrx/effects';
import { StorageLoadAsyncResolver } from './store/storage.resolver';
import { StoreModule } from '@ngrx/store';
import { storageStateKey, storageStateReducer } from './store/storage.reducer';
import { StorageFacadeContainerComponent } from './storage-facade-container/storage-facade-container.component';
import { StorageFacadePresenterComponent } from './storage-facade-presenter/storage-facade-presenter.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(storageStateKey, storageStateReducer),
    SharedModule
  ],
  declarations: [StorageFacadeContainerComponent, StorageFacadePresenterComponent],
  providers: [
    StorageService,
    StorageFacade,
    StorageLoadAsyncResolver,
  ],
  exports: [StorageFacadeContainerComponent]
})
export class StorageModule { }
