import { SmartModelDto } from '@algotech/core';

export class ExportDataFileDto {
    modelList: SmartModelDto[];
    glistList: string[];
    addLayers: boolean;
}
