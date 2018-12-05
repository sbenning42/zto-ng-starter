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

  @Input() logPaused: boolean;
  @Input() errorPaused: boolean;

  @Output() logEvt: EventEmitter<any[]> = new EventEmitter;
  @Output() errorEvt: EventEmitter<any[]> = new EventEmitter;

  @Output() cancelLogEvt: EventEmitter<void> = new EventEmitter;
  @Output() cancelErrorEvt: EventEmitter<void> = new EventEmitter;

  @Output() pauseLogEvt: EventEmitter<void> = new EventEmitter;
  @Output() pauseErrorEvt: EventEmitter<void> = new EventEmitter;

  @Output() resumeLogEvt: EventEmitter<void> = new EventEmitter;
  @Output() resumeErrorEvt: EventEmitter<void> = new EventEmitter;

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
      this.logEvt.emit(messages);
      this.detachedForm.reset();
    }
  }
  error() {
    if (this.errorClosed) {
      const messages = [this.messageControl.value];
      this.messageForm.reset();
      this.errorEvt.emit(messages);
      this.detachedForm.reset();
    }
  }
  cancelLog() {
    if (!this.logClosed) {
      this.cancelLogEvt.emit();
    }
  }
  cancelError() {
    if (!this.errorClosed) {
      this.cancelErrorEvt.emit();
    }
  }
  pauseLog() {
    if (!this.logClosed) {
      this.pauseLogEvt.emit();
    }
  }
  pauseError() {
    if (!this.errorClosed) {
      this.pauseErrorEvt.emit();
    }
  }
  resumeLog() {
    if (!this.logClosed) {
      this.resumeLogEvt.emit();
    }
  }
  resumeError() {
    if (!this.errorClosed) {
      this.resumeErrorEvt.emit();
    }
  }

}
