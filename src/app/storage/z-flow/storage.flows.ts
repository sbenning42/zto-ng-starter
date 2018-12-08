import { ZFlowFlow } from '../../z-flow-redux/abstracts/z-flow-flow';
import { StorageTaskLoad, StorageTaskSave, StorageTaskRemove, StorageTaskClear } from './storage.tasks';
import { GlobalDataPoolUpdateMode } from 'src/app/z-flow-redux/services/z-flow-store.service';

export enum StorageFlowType {
  load = '[Storage Flow Type] Load',
  save = '[Storage Flow Type] Save',
  remove = '[Storage Flow Type] Remove',
  clear = '[Storage Flow Type] Clear',
}

export class StorageFlowLoad extends ZFlowFlow {
  type = StorageFlowType.load;
  constructor() {
    super();
    const loadTask = new StorageTaskLoad;
    this.addTask(loadTask, { root: true, target: true });
  }
}

export class StorageFlowSave extends ZFlowFlow {
  type = StorageFlowType.save;
  updateMode = GlobalDataPoolUpdateMode.merge;
  constructor() {
    super();
    const saveTask = new StorageTaskSave;
    this.addTask(saveTask, { root: true, target: true });
  }
}

export class StorageFlowRemove extends ZFlowFlow {
  type = StorageFlowType.remove;
  constructor() {
    super();
    const removeTask = new StorageTaskRemove;
    this.addTask(removeTask, { root: true, target: true });
  }
}

export class StorageFlowClear extends ZFlowFlow {
  type = StorageFlowType.clear;
  constructor() {
    super();
    const clearTask = new StorageTaskClear;
    this.addTask(clearTask, { root: true, target: true });
  }
}
