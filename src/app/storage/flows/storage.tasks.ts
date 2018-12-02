import { ZtoTaskflowTask } from '../../zto-task-flow/pattern-components/task/zto-taskflow-task.abstract';
import { ZtoDictionnary } from 'src/app/zto-task-flow/helpers/zto-dictionnary.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageEntries } from '../storage.models';

export enum StorageTaskType {
  get = '[Storage Task] Get',
  save = '[Storage Task] Save',
  remove = '[Storage Task] Remove',
  clear = '[Storage Task] Clear',
}

export class StorageTaskGet extends ZtoTaskflowTask {
  TYPE = StorageTaskType.get;
  INJECT = ['storageService'];
  REQUIRES = ['storageLoadKeys'];
  PROVIDE = ['storageEntries'];
  execute(requires: ZtoDictionnary): Observable<ZtoDictionnary> {
    const lodKeys = requires.storageLoadKeys;
    const mapProvide = (storageEntries: StorageEntries) => ({ storageEntries });
    return this.injected.storageService.getAll(lodKeys).pipe(map(mapProvide));
  }
}
export class StorageTaskSave extends ZtoTaskflowTask {
  TYPE = StorageTaskType.save;
  INJECT = ['storageService'];
  REQUIRES = ['storageEntries'];
  PROVIDE = ['storageEntries'];
  execute(requires: ZtoDictionnary): Observable<ZtoDictionnary> {
    const entries = requires.storageEntries;
    const mapProvide = (storageEntries: StorageEntries) => ({ storageEntries });
    return this.injected.storageService.save(entries).pipe(map(mapProvide));
  }
}
export class StorageTaskRemove extends ZtoTaskflowTask {
  TYPE = StorageTaskType.remove;
  INJECT = ['storageService'];
  REQUIRES = ['storageRemoveKeys'];
  execute(requires: ZtoDictionnary): Observable<ZtoDictionnary> {
    const removeKeys = requires.storageRemoveKeys;
    const mapProvide = () => ({});
    return this.injected.storageService.remove(removeKeys).pipe(map(mapProvide));
  }
}
export class StorageTaskClear extends ZtoTaskflowTask {
  TYPE = StorageTaskType.get;
  INJECT = ['storageService'];
  execute(): Observable<ZtoDictionnary> {
    const mapProvide = () => ({});
    return this.injected.storageService.clear().pipe(map(mapProvide));
  }
}
