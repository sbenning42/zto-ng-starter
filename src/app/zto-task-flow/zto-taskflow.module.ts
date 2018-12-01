import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { ztoTaskflowStoreSelector } from './pattern-store/zto-taskflow.selectors';
import { ztoTaskflowReducer } from './pattern-store/zto-taskflow.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ZtoTaskflowEffects } from './pattern-store/zto-taskflow.effects';
import { ZtoTaskflowFacade } from './pattern-store/zto-taskflow.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(ztoTaskflowStoreSelector, ztoTaskflowReducer),
    EffectsModule.forFeature([ZtoTaskflowEffects]),
  ],
  declarations: [],
  providers: [
    ZtoTaskflowEffects,
    ZtoTaskflowFacade,
  ]
})
export class ZtoTaskflowModule { }
