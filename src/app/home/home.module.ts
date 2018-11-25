import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { LoggerModule } from '../app-state/logger/logger.module';
import { StorageModule } from '../app-state/storage/storage.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoggerModule,
    StorageModule
  ],
  declarations: [HomePageComponent]
})
export class HomeModule { }
