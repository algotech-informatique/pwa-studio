import { SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';

export interface UITreeMoveData {
    destination: SnPageWidgetDto|SnPageDto;
    page: SnPageDto;
    brothers: SnPageWidgetDto[];
    index: number;
    type: 'page'|'widget';
}
