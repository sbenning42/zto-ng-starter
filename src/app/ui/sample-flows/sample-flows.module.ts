import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleFlowsFacadeContainerComponent } from './sample-flows-facade-container/sample-flows-facade-container.component';
import { SampleFlowsFacadePresenterComponent } from './sample-flows-facade-presenter/sample-flows-facade-presenter.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SampleFlowsFacadeContainerComponent, SampleFlowsFacadePresenterComponent],
})
export class SampleFlowsModule { }
