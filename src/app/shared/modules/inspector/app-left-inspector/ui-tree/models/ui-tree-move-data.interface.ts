import { SnPageDto, SnPageWidgetDto } from '@algotech/core';

export interface UITreeMoveData {
    destination: SnPageWidgetDto|SnPageDto;
    page: SnPageDto;
    brothers: SnPageWidgetDto[];
    index: number;
    type: 'page'|'widget';
}
