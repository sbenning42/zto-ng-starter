import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { LoggerModule } from '../logger/logger.module';
import { StorageModule } from '../storage/storage.module';
import { ToastModule } from '../toast/toast.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoggerModule,
    StorageModule,
    ToastModule
  ],
  declarations: [HomePageComponent]
})
export class HomeModule { }
