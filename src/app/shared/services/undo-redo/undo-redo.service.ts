import { Injectable } from '@angular/core';
import { UndoRedoDto } from '../../dtos';
import { PatchPropertyDto, SnModelDto } from '@algotech-ce/core';
import { PatchesService } from '../datas/patches.service';
import { Subject } from 'rxjs';

@Injectable()
export class UndoRedoService {

    constructor(private patchesService: PatchesService) {
    }

    stack: UndoRedoDto[] = [];
    stackChange = new Subject();

    getItem(uuid: string, host: string, customerKey: string) {
        const item = this.stack.find((s) => s.uuid === uuid && s.host === host && s.customerKey === customerKey);
        if (item) {
            return item;
        }
        const newItem: UndoRedoDto = {
            uuid,
            host,
            customerKey,
            stack: [],
            active: -1,
        };
        this.stack.push(newItem);
        return newItem;
    }

    canUndo(model: SnModelDto, host: string, customerKey: string) {
        const item = this.getItem(model.uuid, host, customerKey);
        return item.stack.length > 0 && item.active > -1;
    }

    canRedo(model: SnModelDto, host: string, customerKey: string) {
        const item = this.getItem(model.uuid, host, customerKey);
        return item.stack.length > 0 && item.active < item.stack.length - 1;
    }

    undo(model: SnModelDto, host: string, customerKey: string) {
        if (!this.canUndo(model, host, customerKey)) {
            return null;
        }
        const item = this.getItem(model.uuid, host, customerKey);
        const patches = item.stack[item.active].reverse;
        this.patchesService.recomposeSNModel(model, patches);
        item.active--;

        this.stackChange.next({ uuid: model.uuid, host, customerKey });
        return patches;
    }

    redo(model: SnModelDto, host: string, customerKey: string) {
        if (!this.canRedo(model, host, customerKey)) {
            return null;
        }
        const item = this.getItem(model.uuid, host, customerKey);
        item.active++;
        const patches = item.stack[item.active].operations;
        this.patchesService.recomposeSNModel(model, patches);

        this.stackChange.next({ uuid: model.uuid, host, customerKey });
        return patches;
    }

    update(uuid: string, host: string, customerKey: string, data: {
        operations: PatchPropertyDto[],
        reverse: PatchPropertyDto[]
    }
    ) {
        const item = this.getItem(uuid, host, customerKey);
        item.stack.splice(item.active + 1, item.stack.length);
        item.stack.push({
            operations: data.operations,
            reverse: data.reverse,
        });

        item.active = item.stack.length - 1;
        this.stackChange.next({ uuid, host, customerKey });
    }

    clear(uuid: string, host: string, customerKey: string) {
        const item = this.getItem(uuid, host, customerKey);
        item.stack = [];
        item.active = -1;
        this.stackChange.next({ uuid, host, customerKey });
    }
}
