import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from './logger.service';
import { LoggerResolver } from './store/logger.resolver';
import { LoggerFacade } from './store/logger.facade';
import { LoggerFacadeContainerComponent } from './logger-facade-container/logger-facade-container.component';
import { LoggerFacadePresenterComponent } from './logger-facade-presenter/logger-facade-presenter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoggerFlowFacade } from './flows/logger.flows';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [LoggerFacadeContainerComponent, LoggerFacadePresenterComponent],
  providers: [
    LoggerService,
    LoggerResolver,
    LoggerFacade,
    LoggerFlowFacade,
  ],
  exports: [LoggerFacadeContainerComponent]
})
export class LoggerModule { }
