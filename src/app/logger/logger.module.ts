import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from './logger.service';
import { LoggerFacadePresenterComponent } from './ui/logger-facade-presenter/logger-facade-presenter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoggerFlowFacade } from './z-flow/logger-flow.facade';
import { LoggerFacadeContainerComponent } from './ui/logger-facade-container/logger-facade-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [LoggerFacadePresenterComponent, LoggerFacadeContainerComponent],
  providers: [
    LoggerService,
    LoggerFlowFacade,
  ],
  exports: [LoggerFacadeContainerComponent]
})
export class LoggerModule { }
