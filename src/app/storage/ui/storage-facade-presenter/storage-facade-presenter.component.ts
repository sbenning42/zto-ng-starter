import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { StorageEntries } from '../../../storage/storage.models';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-storage-facade-presenter',
  templateUrl: './storage-facade-presenter.component.html',
  styleUrls: ['./storage-facade-presenter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorageFacadePresenterComponent implements OnInit {

  @Input() loaded: boolean;

  @Input() entries: StorageEntries;
  get entriesAsArray(): [string, string][] {
    return Object.entries(this.entries || {});
  }

  @Input() loadClosed: boolean;
  @Input() saveClosed: boolean;
  @Input() removeClosed: boolean;
  @Input() clearClosed: boolean;

  @Input() loadPaused: boolean;
  @Input() savePaused: boolean;
  @Input() removePaused: boolean;
  @Input() clearPaused: boolean;

  @Output() loadEvt: EventEmitter<string[]> = new EventEmitter;
  @Output() saveEvt: EventEmitter<StorageEntries> = new EventEmitter;
  @Output() removeEvt: EventEmitter<string[]> = new EventEmitter;
  @Output() clearEvt: EventEmitter<void> = new EventEmitter;

  @Output() pauseLoadEvt: EventEmitter<void> = new EventEmitter;
  @Output() pauseSaveEvt: EventEmitter<void> = new EventEmitter;
  @Output() pauseRemoveEvt: EventEmitter<void> = new EventEmitter;
  @Output() pauseClearEvt: EventEmitter<void> = new EventEmitter;

  @Output() resumeLoadEvt: EventEmitter<void> = new EventEmitter;
  @Output() resumeSaveEvt: EventEmitter<void> = new EventEmitter;
  @Output() resumeRemoveEvt: EventEmitter<void> = new EventEmitter;
  @Output() resumeClearEvt: EventEmitter<void> = new EventEmitter;

  @Output() cancelLoadEvt: EventEmitter<void> = new EventEmitter;
  @Output() cancelSaveEvt: EventEmitter<void> = new EventEmitter;
  @Output() cancelRemoveEvt: EventEmitter<void> = new EventEmitter;
  @Output() cancelClearEvt: EventEmitter<void> = new EventEmitter;

  indexRemoving: number;

  saveForm: FormGroup;
  keyControl = new FormControl('', [Validators.required]);
  valueControl = new FormControl('', [Validators.required]);
  constructor() {
    this.saveForm = new FormGroup({
      key: this.keyControl,
      value: this.valueControl,
    });
  }

  ngOnInit() {
  }

  load(keys?: string[]) {
    this.loadEvt.emit(keys);
  }
  pauseLoad() {
    this.pauseLoadEvt.emit();
  }
  resumeLoad() {
    this.resumeLoadEvt.emit();
  }
  cancelLoad() {
    this.cancelLoadEvt.emit();
  }

  save() {
    const entries = { [this.keyControl.value]: this.valueControl.value };
    this.saveEvt.emit(entries);
  }
  pauseSave() {
    this.pauseSaveEvt.emit();
  }
  resumeSave() {
    this.resumeSaveEvt.emit();
  }
  cancelSave() {
    this.cancelSaveEvt.emit();
  }

  remove(index: number, keys?: string[]) {
    this.indexRemoving = index;
    this.removeEvt.emit(keys);
  }
  pauseRemove() {
    this.pauseRemoveEvt.emit();
  }
  resumeRemove() {
    this.indexRemoving = undefined;
    this.resumeRemoveEvt.emit();
  }
  cancelRemove() {
    this.indexRemoving = undefined;
    this.cancelRemoveEvt.emit();
  }

  clear() {
    this.clearEvt.emit();
  }
  pauseClear() {
    this.pauseClearEvt.emit();
  }
  resumeClear() {
    this.resumeClearEvt.emit();
  }
  cancelClear() {
    this.cancelClearEvt.emit();
  }

}
