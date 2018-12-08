import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './storage.service';
import { StorageFacadePresenterComponent } from './storage-facade-presenter/storage-facade-presenter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StorageFacadeContainerComponent } from './storage-facade-container/storage-facade-container.component';
import { StorageFlowFacade } from './z-flow/storage-flow.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [StorageFacadePresenterComponent, StorageFacadeContainerComponent],
  providers: [
    StorageService,
    StorageFlowFacade
  ],
  exports: [StorageFacadeContainerComponent]
})
export class StorageModule { }
