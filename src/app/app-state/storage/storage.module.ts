import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './storage.service';
import { StorageFacade } from './store/facade';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    StorageService,
    StorageFacade
  ]
})
export class StorageModule { }
