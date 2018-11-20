import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoutingModule } from '../routing/routing.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RoutingModule,
    MaterialModule,
  ],
  declarations: [],
  exports: [
    RoutingModule,
    MaterialModule,
  ]
})
export class SharedModule { }
