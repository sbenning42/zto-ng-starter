import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { LoggerModule } from '../app-state/logger/logger.module';
import { StorageModule } from '../app-state/storage/storage.module';
import { ToastModule } from '../app-state/toast/toast.module';

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
