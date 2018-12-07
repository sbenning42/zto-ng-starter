import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { StorageEntries } from '../../storage/storage.models';
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

  @Output() loadEvt: EventEmitter<string[]> = new EventEmitter;
  @Output() saveEvt: EventEmitter<StorageEntries> = new EventEmitter;
  @Output() removeEvt: EventEmitter<string[]> = new EventEmitter;
  @Output() clearEvt: EventEmitter<void> = new EventEmitter;

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
    if (this.loadClosed) {
      this.loadEvt.emit(keys);
    }
  }
  cancelLoad() {
    if (!this.loadClosed) {
      this.cancelLoadEvt.emit();
    }
  }

  save() {
    if (this.saveClosed) {
      const entries = { [this.keyControl.value]: this.valueControl.value };
      this.saveForm.reset();
      this.saveEvt.emit(entries);
    }
  }
  cancelSave() {
    if (!this.saveClosed) {
      this.cancelSaveEvt.emit();
    }
  }

  remove(index: number, keys?: string[]) {
    if (this.removeClosed) {
      this.indexRemoving = index;
      this.removeEvt.emit(keys);
    }
  }
  cancelremove() {
    if (!this.removeClosed) {
      this.indexRemoving = undefined;
      this.cancelRemoveEvt.emit();
    }
  }

  clear() {
    if (this.clearClosed) {
      this.clearEvt.emit();
    }
  }
  cancelClear() {
    if (!this.clearClosed) {
      this.cancelClearEvt.emit();
    }
  }

}
