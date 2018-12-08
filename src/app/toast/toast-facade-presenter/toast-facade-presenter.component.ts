import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-toast-facade-presenter',
  templateUrl: './toast-facade-presenter.component.html',
  styleUrls: ['./toast-facade-presenter.component.css']
})
export class ToastFacadePresenterComponent implements OnInit {

  @Input() openClosed: boolean;
  @Input() closeClosed: boolean;
  @Input() openPaused: boolean;
  @Input() closePaused: boolean;
  @Input() beenOpen: boolean;

  @Output() openEvt: EventEmitter<string> = new EventEmitter;
  @Output() closeEvt: EventEmitter<void> = new EventEmitter;

  @Output() pauseOpenEvt: EventEmitter<void> = new EventEmitter;
  @Output() pauseCloseEvt: EventEmitter<void> = new EventEmitter;

  @Output() resumeOpenEvt: EventEmitter<void> = new EventEmitter;
  @Output() resumeCloseEvt: EventEmitter<void> = new EventEmitter;

  @Output() cancelOpenEvt: EventEmitter<void> = new EventEmitter;
  @Output() cancelCloseEvt: EventEmitter<void> = new EventEmitter;

  @ViewChild(FormGroupDirective) detachedForm: FormGroupDirective;

  messageForm: FormGroup;
  messageControl: FormControl = new FormControl('', [Validators.required]);

  constructor() {
    this.messageForm = new FormGroup({ message: this.messageControl });
  }

  ngOnInit() {
  }

  open() {
    if (this.openClosed) {
      const message = this.messageControl.value;
      this.messageForm.reset();
      this.detachedForm.reset();
      this.openEvt.emit(message);
    }
  }
  close() {
    if (this.closeClosed) {
      this.closeEvt.emit();
    }
  }

  pauseOpen() {
    this.pauseOpenEvt.emit();
  }
  pauseClose() {
    this.pauseCloseEvt.emit();
  }

  resumeOpen() {
    this.resumeOpenEvt.emit();
  }
  resumeClose() {
    this.resumeCloseEvt.emit();
  }

  cancelOpen() {
    this.cancelOpenEvt.emit();
  }
  cancelClose() {
    this.cancelCloseEvt.emit();
  }

}
