import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { ToastResolver } from './store/toas.resolver';
import { ToastFacade } from './store/toast.facade';
import { ToastFacadeContainerComponent } from './toast-facade-container/toast-facade-container.component';
import { ToastFacadePresenterComponent } from './toast-facade-presenter/toast-facade-presenter.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ToastFacadeContainerComponent, ToastFacadePresenterComponent],
  providers: [
    ToastService,
    ToastResolver,
    ToastFacade,
  ],
  exports: [ToastFacadeContainerComponent]
})
export class ToastModule { }
