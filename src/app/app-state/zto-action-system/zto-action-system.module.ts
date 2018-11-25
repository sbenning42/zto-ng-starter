import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { zasStateKey } from './zas.selectors';
import { zasReducer } from './zas.reducer';
import { ZasFacade } from './zas.facade';
import { ZasEffects } from './zas.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(zasStateKey, zasReducer),
    EffectsModule.forFeature([ZasEffects])
  ],
  declarations: [],
  providers: [
    ZasEffects,
    ZasFacade,
  ]
})
export class ZtoActionSystemModule { }
