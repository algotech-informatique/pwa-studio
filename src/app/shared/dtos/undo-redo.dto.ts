import { PatchPropertyDto } from '@algotech/core';

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
