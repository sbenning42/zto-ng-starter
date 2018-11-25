import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { SharedModule } from '../shared/shared.module';
import { environment } from '../../environments/environment';
import { StorageModule } from './storage/storage.module';
import { LoggerModule } from './logger/logger.module';
import { ZtoActionSystemModule } from './zto-action-system/zto-action-system.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 100, logOnly: !environment.production }),
    ZtoActionSystemModule,
    LoggerModule,
    StorageModule
  ],
  declarations: [],
})
export class AppStateModule { }
