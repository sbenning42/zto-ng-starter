import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-logger-facade-presenter',
  templateUrl: './logger-facade-presenter.component.html',
  styleUrls: ['./logger-facade-presenter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggerFacadePresenterComponent implements OnInit {

  @Input() logClosed: boolean;
  @Input() errorClosed: boolean;

  @Output() logEvt: EventEmitter<any[]> = new EventEmitter;
  @Output() errorEvt: EventEmitter<any[]> = new EventEmitter;

  @Output() cancelLogEvt: EventEmitter<void> = new EventEmitter;
  @Output() cancelErrorEvt: EventEmitter<void> = new EventEmitter;

  @ViewChild(FormGroupDirective) detachedForm: FormGroupDirective;

  messageForm: FormGroup;
  messageControl: FormControl = new FormControl('', [Validators.required]);

  constructor() {
    this.messageForm = new FormGroup({ message: this.messageControl });
  }

  ngOnInit() {
  }

  log() {
    if (this.logClosed) {
      const messages = [this.messageControl.value];
      this.messageForm.reset();
      this.detachedForm.reset();
      this.logEvt.emit(messages);
    }
  }
  error() {
    if (this.errorClosed) {
      const messages = [this.messageControl.value];
      this.messageForm.reset();
      this.detachedForm.reset();
      this.errorEvt.emit(messages);
    }
  }
  cancelLog() {
    if (!this.logClosed) {
      this.cancelLogEvt.emit();
    }
  }
  cancelerror() {
    if (!this.errorClosed) {
      this.cancelErrorEvt.emit();
    }
  }

}
