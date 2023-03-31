import { SmartModelDto } from '@algotech-ce/core';

export class ExportDataFileDto {
    modelList: SmartModelDto[];
    glistList: string[];
    addLayers: boolean;
}
