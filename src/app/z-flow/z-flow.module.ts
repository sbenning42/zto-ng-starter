import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    /*
    StoreModule.forFeature(zflowStoreKey, zflowStoreReducer),
    EffectsModule.forFeature([ZFlowEffects]),
    */
  ],
  declarations: [],
  /*
  providers: [
    ZFlowEffects,
  ]
  */
})
export class ZFlowModule { }
