import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { ZtoTaskflowModule } from './zto-task-flow/zto-taskflow.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { LoggerModule } from './logger/logger.module';
import { StorageModule } from './storage/storage.module';
import { ToastModule } from './toast/toast.module';
import { ZFlowReduxModule } from './z-flow-redux/z-flow-redux.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({maxAge: 100, logOnly: !environment.production}),
    ZFlowReduxModule,
    ZtoTaskflowModule,
    LoggerModule,
    StorageModule,
    ToastModule,
    HeaderModule,
    HomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
