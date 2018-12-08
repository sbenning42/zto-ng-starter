import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sample-flows-facade-presenter',
  templateUrl: './sample-flows-facade-presenter.component.html',
  styleUrls: ['./sample-flows-facade-presenter.component.css']
})
export class SampleFlowsFacadePresenterComponent implements OnInit {

  @Input() sample1Closed: boolean;
  @Input() sample1Paused: boolean;

  @Input() sample2Closed: boolean;
  @Input() sample2Paused: boolean;


  @Output() sample1Evt: EventEmitter<void> = new EventEmitter;
  @Output() cancelSample1Evt: EventEmitter<void> = new EventEmitter;
  @Output() pauseSample1Evt: EventEmitter<void> = new EventEmitter;
  @Output() resumeSample1Evt: EventEmitter<void> = new EventEmitter;

  @Output() sample2Evt: EventEmitter<void> = new EventEmitter;
  @Output() cancelSample2Evt: EventEmitter<void> = new EventEmitter;
  @Output() pauseSample2Evt: EventEmitter<void> = new EventEmitter;
  @Output() resumeSample2Evt: EventEmitter<void> = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  sample1() {
    this.sample1Evt.emit();
  }
  pauseSample1() {
    this.pauseSample1Evt.emit();
  }
  resumeSample1() {
    this.resumeSample1Evt.emit();
  }
  cancelSample1() {
    this.cancelSample1Evt.emit();
  }

  sample2() {
    this.sample2Evt.emit();
  }
  pauseSample2() {
    this.pauseSample2Evt.emit();
  }
  resumeSample2() {
    this.resumeSample2Evt.emit();
  }
  cancelSample2() {
    this.cancelSample2Evt.emit();
  }
}
