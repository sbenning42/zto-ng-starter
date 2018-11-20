import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderContainerComponent } from './header-container/header-container.component';
import { HeaderSimplePresenterComponent } from './header-simple-presenter/header-simple-presenter.component';
import { HeaderService } from './header.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [HeaderContainerComponent, HeaderSimplePresenterComponent],
  providers: [
    HeaderService
  ],
  exports: [
    HeaderContainerComponent
  ]
})
export class HeaderModule { }
