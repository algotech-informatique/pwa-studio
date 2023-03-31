import { PatchPropertyDto } from '@algotech-ce/core';

export class UndoRedoDto {
    uuid: string;
    host: string;
    customerKey: string;
    stack: {
        operations: PatchPropertyDto[];
        reverse: PatchPropertyDto[];
    }[];
    active: number;
}
