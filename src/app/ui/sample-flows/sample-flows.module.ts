import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleFlowsFacadeContainerComponent } from './sample-flows-facade-container/sample-flows-facade-container.component';
import { SampleFlowsFacadePresenterComponent } from './sample-flows-facade-presenter/sample-flows-facade-presenter.component';
import { SampleFlowsFlowFacade } from './z-flow/sample-flows-flow.facade';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [SampleFlowsFacadeContainerComponent, SampleFlowsFacadePresenterComponent],
  providers: [
    SampleFlowsFlowFacade
  ],
  exports: [SampleFlowsFacadeContainerComponent]
})
export class SampleFlowsModule { }
