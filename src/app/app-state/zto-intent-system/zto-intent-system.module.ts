import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { ztoIntentSystemRootKey } from './store/selectors';
import { ztoIntentSystemReducer } from './store/reducer';
import { ZtoIntentSystemEffects } from './store/effects';
import { EffectsModule } from '@ngrx/effects';
import { ZtoIntentSystemFacade } from './store/facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(ztoIntentSystemRootKey, ztoIntentSystemReducer),
    EffectsModule.forFeature([ZtoIntentSystemEffects]),
  ],
  declarations: [],
  providers: [
    ZtoIntentSystemFacade,
    ZtoIntentSystemEffects
  ]
})
export class ZtoIntentSystemModule { }
