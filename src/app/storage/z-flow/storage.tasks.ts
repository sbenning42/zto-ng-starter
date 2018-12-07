import { ZFlowTask } from '../../z-flow-redux/abstracts/z-flow-task';
import { ZDictionnary } from '../../z-flow-redux/helpers/z-tools';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum StorageSymbol {
    loadKeys = '[Storage Symbol] Load Keys',
    removeKeys = '[Storage Symbol] Remove Keys',
    saveEntries = '[Storage Symbol] Save Entries',
    storageLoaded = '[Storage Symbol] Storage Loaded',
    storageEntries = '[Storage Symbol] Storage Entries',
}

export enum StorageTakType {
    getAll = '[Storage Task Type] Get All',
    save = '[Storage Task Type] Save',
    remove = '[Storage Task Type] Remove',
    clear = '[Storage Task Type] Clear',
}

export class StorageTaskGetAll extends ZFlowTask {
    
    type = StorageTakType.getAll;
    injectSymbols = ['storageService'];
    requiresSymbols = [StorageSymbol.loadKeys];
    provideSymbols = [
        StorageSymbol.storageEntries,
        StorageSymbol.storageLoaded
    ];

    execute(requires: ZDictionnary): Observable<ZDictionnary> {
        const mapProvide = entries => ({
            [StorageSymbol.storageLoaded]: true,
            [StorageSymbol.storageEntries]: entries
        });
        const loadKeys = requires[StorageSymbol.loadKeys];
        return this.injector.storageService.getAll(loadKeys).pipe(map(mapProvide));
    }
}

export class StorageTaskSave extends ZFlowTask {
    type = StorageTakType.save;
    injectSymbols = ['storageService'];
}
export class StorageTaskRemove extends ZFlowTask {
    type = StorageTakType.remove;
    injectSymbols = ['storageService'];
}
export class StorageTaskClear extends ZFlowTask {
    type = StorageTakType.clear;
    injectSymbols = ['storageService'];
}
