import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { ToastFacadePresenterComponent } from './ui/toast-facade-presenter/toast-facade-presenter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastFacadeContainerComponent } from './ui/toast-facade-container/toast-facade-container.component';
import { ToastFlowFacade } from './z-flow/toast-flow.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ToastFacadePresenterComponent, ToastFacadeContainerComponent],
  providers: [
    ToastService,
    ToastFlowFacade
  ],
  exports: [ToastFacadeContainerComponent]
})
export class ToastModule { }
