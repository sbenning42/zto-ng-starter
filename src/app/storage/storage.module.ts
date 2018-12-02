import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './storage.service';
import { StorageFacadePresenterComponent } from './storage-facade-presenter/storage-facade-presenter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StorageFlowFacade } from './flows/storage.flows';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [StorageFacadePresenterComponent],
  providers: [
    StorageService,
    StorageFlowFacade,
  ],
  exports: []
})
export class StorageModule { }
