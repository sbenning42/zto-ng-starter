import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { ToastFacadePresenterComponent } from './toast-facade-presenter/toast-facade-presenter.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastFacadeContainerComponent } from './toast-facade-container/toast-facade-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ToastFacadePresenterComponent, ToastFacadeContainerComponent],
  providers: [
    ToastService,
  ],
  exports: [ToastFacadeContainerComponent]
})
export class ToastModule { }
