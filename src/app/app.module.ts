import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { AppStateModule } from './app-state/app-state.module';
import { ZtoTaskflowModule } from './zto-task-flow/zto-taskflow.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    ZtoTaskflowModule,
    AppStateModule,
    HeaderModule,
    HomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
