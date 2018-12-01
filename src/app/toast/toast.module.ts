import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { ToastFacadePresenterComponent } from './toast-facade-presenter/toast-facade-presenter.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ToastFacadePresenterComponent],
  providers: [
    ToastService,
  ],
  exports: []
})
export class ToastModule { }
