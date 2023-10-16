import { SnSynoticSearchDto, SnVersionDto } from '@algotech-ce/core';

export class SnSearchDto {
    snModelUuid: string;
    version: SnVersionDto;
    element: SnSynoticSearchDto;
    elements: SnSynoticSearchDto[];
}
