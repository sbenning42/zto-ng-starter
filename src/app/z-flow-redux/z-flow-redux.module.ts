import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { zFlowStoreSelector, zFlowStoreReducer } from './store/z-flow.reducer';
import { ZFlowStoreService } from './services/z-flow-store.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(zFlowStoreSelector, zFlowStoreReducer),
  ],
  declarations: [],
  providers: [
    ZFlowStoreService
  ]
})
export class ZFlowReduxModule { }
