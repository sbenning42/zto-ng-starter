import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from './logger.service';
import { LoggerFacadePresenterComponent } from './logger-facade-presenter/logger-facade-presenter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoggerFlowFacade } from './flows/logger.flows';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [LoggerFacadePresenterComponent],
  providers: [
    LoggerService,
    LoggerFlowFacade,
  ],
  exports: []
})
export class LoggerModule { }
